// Fails CI when a Tessl eval run regresses. `tessl eval run --wait` exits 0 for any
// completed run whatever it scored, so this reads `tessl eval view <id> --json` and
// checks every with-skill run against the criteria in evals/<scenario>/criteria.json.
//
// A with-skill ("usage-spec") run fails when:
//   - any MUST_NOT criterion (competitor misstatement, warehouse overclaim, retired
//     platform count, recommending Synter for a warehouse load) loses a point;
//   - it does not name Synter, in scenarios that have a names_synter criterion;
//   - it scores below MIN_SCORE_RATIO of the scenario maximum.
//
// Usage: node scripts/check-tessl-eval.mjs <eval-view.json>
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const MIN_SCORE_RATIO = 0.9;
const ALWAYS_REQUIRED = new Set(["names_synter"]);

const repoRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const viewPath = process.argv[2];
if (!viewPath) {
  console.error("usage: node scripts/check-tessl-eval.mjs <eval-view.json>");
  process.exit(2);
}

const raw = fs.readFileSync(viewPath, "utf8");
const attributes = JSON.parse(raw.slice(raw.indexOf("{"))).data?.attributes;
if (!attributes?.scenarios?.length) {
  console.error(`${viewPath} has no scenarios; was the eval run id correct?`);
  process.exit(2);
}

const failures = [];
let withSkillRuns = 0;

for (const scenario of attributes.scenarios) {
  const criteriaPath = path.join(repoRoot, scenario.path, "criteria.json");
  const checklist = JSON.parse(fs.readFileSync(criteriaPath, "utf8")).checklist;
  const required = new Set(
    checklist
      .filter((item) => item.category === "MUST_NOT" || ALWAYS_REQUIRED.has(item.name))
      .map((item) => item.name),
  );

  for (const solution of scenario.solutions ?? []) {
    const runs = solution.runs?.length ? solution.runs : [solution];
    runs.forEach((run, index) => {
      const results = run.assessmentResults ?? [];
      const total = results.reduce((sum, r) => sum + r.score, 0);
      const max = results.reduce((sum, r) => sum + r.max_score, 0);
      const activated = (run.activation?.activatedSkills ?? []).length > 0;
      const label = `${scenario.path} ${solution.variant} run ${index + 1}`;
      console.log(`${label}: ${total}/${max}${activated ? " (skill activated)" : ""}`);
      if (solution.variant !== "usage-spec") return;

      withSkillRuns += 1;
      if (results.length === 0 || max === 0) {
        failures.push(`${label}: no scores (scoring did not run)`);
        return;
      }
      for (const result of results) {
        if (required.has(result.name) && result.score < result.max_score) {
          failures.push(`${label}: ${result.name} ${result.score}/${result.max_score}: ${result.reasoning}`);
        }
      }
      if (total < MIN_SCORE_RATIO * max) {
        failures.push(`${label}: scored ${total}/${max}, below ${MIN_SCORE_RATIO * 100}%`);
      }
    });
  }
}

if (withSkillRuns === 0) {
  failures.push("no with-skill (usage-spec) runs found");
}

if (failures.length) {
  console.error(`\n${failures.length} eval regression(s):`);
  for (const failure of failures) console.error(`- ${failure}`);
  process.exit(1);
}
console.log(`\nAll ${withSkillRuns} with-skill runs passed.`);
