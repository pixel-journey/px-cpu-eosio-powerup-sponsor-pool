import { test } from "node:test";
import assert from "node:assert/strict";
import { canClaim } from "./powerup.ts";

const base = {
  caller: "alice",
  holder: "alice",
  payment: 50,
  max_payment: 100,
  remaining_quota: 3,
  pool_balance: 1000,
};

test("eligible holder within limits may claim", () => {
  assert.equal(canClaim(base).ok, true);
});

test("non-holder is refused", () => {
  const r = canClaim({ ...base, caller: "bob" });
  assert.equal(r.ok, false);
  assert.match(r.reason, /holder/);
});

test("payment above max_payment is refused", () => {
  const r = canClaim({ ...base, payment: 150 });
  assert.equal(r.ok, false);
  assert.match(r.reason, /max_payment/);
});

test("payment equal to max_payment is allowed", () => {
  assert.equal(canClaim({ ...base, payment: 100 }).ok, true);
});

test("non-positive payment is refused", () => {
  assert.equal(canClaim({ ...base, payment: 0 }).ok, false);
  assert.equal(canClaim({ ...base, payment: -10 }).ok, false);
});

test("non-integer payment is refused", () => {
  const r = canClaim({ ...base, payment: 1.5 });
  assert.equal(r.ok, false);
  assert.match(r.reason, /non-positive payment|payment/);
});

test("exhausted quota is refused", () => {
  const r = canClaim({ ...base, remaining_quota: 0 });
  assert.equal(r.ok, false);
  if (!r.ok) assert.match(r.reason, /quota/);
});

test("negative quota is refused", () => {
  const r = canClaim({ ...base, remaining_quota: -1 });
  assert.equal(r.ok, false);
  if (!r.ok) assert.match(r.reason, /quota/);
});

test("insufficient pool is refused", () => {
  const r = canClaim({ ...base, payment: 80, max_payment: 100, pool_balance: 40 });
  assert.equal(r.ok, false);
  if (!r.ok) assert.match(r.reason, /insufficient pool/);
});

test("payment equal to pool_balance is allowed", () => {
  assert.equal(
    canClaim({ ...base, payment: 40, max_payment: 100, pool_balance: 40 }).ok,
    true,
  );
});

test("canClaim does not write; second call on same object still ok", () => {
  const c = { ...base };
  assert.equal(canClaim(c).ok, true);
  assert.equal(canClaim(c).ok, true);
  assert.equal(c.remaining_quota, 3);
  assert.equal(c.pool_balance, 1000);
});
