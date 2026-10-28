export type ClaimCheck = {
  caller: string;
  holder: string;
  payment: number;
  max_payment: number;
  remaining_quota: number;
  pool_balance: number;
};

export function canClaim(c: ClaimCheck): { ok: true } | { ok: false; reason: string } {
  if (c.caller !== c.holder) return { ok: false, reason: "not the holder" };
  if (!Number.isInteger(c.payment) || c.payment <= 0) return { ok: false, reason: "non-positive payment" };
  if (c.payment > c.max_payment) return { ok: false, reason: "exceeds max_payment" };
  if (c.remaining_quota <= 0) return { ok: false, reason: "quota exhausted" };
  if (c.payment > c.pool_balance) return { ok: false, reason: "insufficient pool" };
  return { ok: true };
}
