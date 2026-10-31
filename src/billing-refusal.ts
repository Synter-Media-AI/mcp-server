/**
 * Billing refusals the Synter API returns (402 / INSUFFICIENT_CREDITS /
 * ON_DEMAND_CAP_REACHED / USAGE_BILLING_SETUP_REQUIRED / PAYMENT_METHOD_REQUIRED
 * / ACCOUNT_READ_ONLY / plan gates) are turned into a tool result the model
 * relays to the user: what is blocked, why, the exact fix link, and an
 * instruction to show that link. Before this, a 402 either threw a bare
 * "Error: INSUFFICIENT_CREDITS" or returned legacy `/sign-up?plan=developer`
 * links buried in JSON.
 *
 * The server (apps/web lib/billing/mcp-billing-refusal.ts) already sends the
 * full payload; this module prefers it verbatim and only builds a fallback
 * for older API deployments.
 */

export const BILLING_REFUSAL_CODES = new Set([
  "INSUFFICIENT_CREDITS",
  "USAGE_BILLING_SETUP_REQUIRED",
  "ON_DEMAND_CAP_REACHED",
  "PAYMENT_METHOD_REQUIRED",
  "PAYMENT_FAILED",
  "PAST_DUE",
  "ACCOUNT_READ_ONLY",
  "SUBSCRIPTION_REQUIRED",
  "SUBSCRIPTION_INACTIVE",
  "UPGRADE_REQUIRED",
  "PAID_PLAN_REQUIRED",
  "ENTITLEMENT_REQUIRED",
  "TRIAL_LIMIT_REACHED",
  "CAMPAIGN_LIMIT_REACHED",
  "SEAT_LIMIT_REACHED",
]);

export interface BillingRefusalPayload extends Record<string, unknown> {
  code: string;
  message: string;
  action_url: string;
  assistant_instruction: string;
}

const CANONICAL_ORIGIN = "https://synterai.com";

function str(value: unknown): string | null {
  return typeof value === "string" && value.trim() ? value : null;
}

/** Billing links live on the web app origin; API overrides keep staging local. */
function billingOrigin(apiUrl: string): string {
  try {
    const url = new URL(apiUrl);
    if (
      url.hostname === "staging.synterai.com" ||
      url.hostname === "staging.syntermedia.ai" ||
      url.hostname === "localhost"
    ) {
      return url.origin;
    }
  } catch {
    // fall through
  }
  return CANONICAL_ORIGIN;
}

/**
 * Returns the refusal payload when an API response is a billing refusal,
 * otherwise null (the caller keeps its normal error handling).
 */
export function billingRefusalFromResponse(
  status: number,
  data: Record<string, unknown> | null | undefined,
  apiUrl: string,
): BillingRefusalPayload | null {
  const body = data ?? {};
  const code = str(body.code) ?? str(body.error) ?? "";
  const isBilling =
    body.billing_refusal === true || status === 402 || BILLING_REFUSAL_CODES.has(code);
  if (!isBilling) return null;

  const serverUrl = str(body.action_url) ?? str(body.upgradeUrl);
  const serverMessage = str(body.message);
  if (body.billing_refusal === true && serverUrl && serverMessage) {
    return {
      ...body,
      code: code || "BILLING_REQUIRED",
      message: serverMessage,
      action_url: serverUrl,
      assistant_instruction:
        str(body.assistant_instruction) ??
        `Show the user this link exactly as written so they can fix billing: ${serverUrl}`,
    };
  }

  // Older API deployment: build a usable prompt from what we have.
  const origin = billingOrigin(apiUrl);
  const billing = `${origin}/settings/billing?source=mcp`;
  const card = `${origin}/settings/billing?setup=payment&source=mcp`;
  const actionUrl =
    code === "PAYMENT_METHOD_REQUIRED" || code === "PAYMENT_FAILED" || code === "PAST_DUE"
      ? card
      : code === "ON_DEMAND_CAP_REACHED"
        ? `${origin}/settings/billing?section=spend-management&source=mcp`
        : serverUrl && !serverUrl.includes("/sign-up") && !/plan=/.test(serverUrl)
          ? serverUrl
          : billing;
  const message = `This action is a write, and your Synter account needs a payment method or available credits to run it. Synter is free to connect; writes are $0.25 per verified write, 0% of ad spend. Add a payment method at ${actionUrl} to continue.`;
  return {
    ...body,
    success: false,
    code: code || "BILLING_REQUIRED",
    billing_refusal: true,
    message,
    action_url: actionUrl,
    assistant_instruction: `Tell the user this action is blocked for billing and show them this link exactly as written so they can fix it: ${actionUrl} — then offer to retry once they confirm it's done.`,
  };
}

/** Thrown by API helpers so the tool handler can return a relayable result. */
export class BillingRefusalError extends Error {
  readonly payload: BillingRefusalPayload;
  constructor(payload: BillingRefusalPayload) {
    super(payload.message);
    this.name = "BillingRefusalError";
    this.payload = payload;
  }
}

/** Text block the model reads first: message, link, instruction, then JSON. */
export function formatBillingRefusalText(payload: BillingRefusalPayload): string {
  return [
    `BILLING ACTION REQUIRED (${payload.code})`,
    payload.message,
    `Fix it here: ${payload.action_url}`,
    `Assistant: ${payload.assistant_instruction}`,
    "",
    JSON.stringify(payload, null, 2),
  ].join("\n");
}
