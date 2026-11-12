/**
 * Composition: sequential sponsor claims.
 * canClaim is pure; the desk mutates quota and pool only after ok.
 * Multiple holders share one pool; quotas are per holder.
 */
import { describe, it } from "node:test";
import assert from "node:assert/strict";
import { canClaim } from "./powerup.ts";

type Holder = {
  name: string;
  remaining_quota: number;
  max_payment: number;
};

type Desk = {
  pool_balance: number;
  holders: Map<string, Holder>;
  paid: number;
  claims: number;
};

function openDesk(pool: number, holders: Holder[]): Desk {
  const map = new Map<string, Holder>();
  for (const h of holders) map.set(h.name, { ...h });
  return { pool_balance: pool, holders: map, paid: 0, claims: 0 };
}

function claim(
  desk: Desk,
  caller: string,
  holderName: string,
  payment: number,
): void {
  const holder = desk.holders.get(holderName);
  if (!holder) throw new Error("unknown holder");
  const check = canClaim({
    caller,
    holder: holder.name,
    payment,
    max_payment: holder.max_payment,
    remaining_quota: holder.remaining_quota,
    pool_balance: desk.pool_balance,
  });
  if (!check.ok) throw new Error(check.reason);
  holder.remaining_quota -= 1;
  desk.pool_balance -= payment;
  desk.paid += payment;
  desk.claims += 1;
}

describe("composition: sequential sponsor claims", () => {
  it("two claims drain quota and pool; third is refused", () => {
    const desk = openDesk(1000, [
      { name: "alice", remaining_quota: 2, max_payment: 100 },
    ]);
    claim(desk, "alice", "alice", 50);
    claim(desk, "alice", "alice", 80);
    assert.equal(desk.claims, 2);
    assert.equal(desk.paid, 130);
    assert.equal(desk.pool_balance, 870);
    assert.equal(desk.holders.get("alice")!.remaining_quota, 0);
    assert.throws(() => claim(desk, "alice", "alice", 10), /quota/);
    assert.equal(desk.pool_balance, 870);
  });

  it("shared pool, independent quotas", () => {
    const desk = openDesk(200, [
      { name: "alice", remaining_quota: 1, max_payment: 100 },
      { name: "bob", remaining_quota: 1, max_payment: 100 },
    ]);
    claim(desk, "alice", "alice", 90);
    claim(desk, "bob", "bob", 100);
    assert.equal(desk.pool_balance, 10);
    assert.throws(() => claim(desk, "alice", "alice", 10), /quota/);
    assert.throws(() => claim(desk, "bob", "bob", 10), /quota/);
  });

  it("failed gates leave desk unchanged", () => {
    const desk = openDesk(100, [
      { name: "alice", remaining_quota: 3, max_payment: 50 },
    ]);
    assert.throws(() => claim(desk, "bob", "alice", 10), /holder/);
    assert.throws(() => claim(desk, "alice", "alice", 60), /max_payment/);
    assert.throws(() => claim(desk, "alice", "alice", 0), /non-positive/);
    assert.equal(desk.claims, 0);
    assert.equal(desk.pool_balance, 100);
    assert.equal(desk.holders.get("alice")!.remaining_quota, 3);
  });

  it("insufficient pool refuses even with quota left", () => {
    const desk = openDesk(40, [
      { name: "alice", remaining_quota: 5, max_payment: 100 },
    ]);
    claim(desk, "alice", "alice", 40);
    assert.equal(desk.pool_balance, 0);
    assert.throws(() => claim(desk, "alice", "alice", 1), /insufficient pool/);
    assert.equal(desk.holders.get("alice")!.remaining_quota, 4);
    assert.equal(desk.claims, 1);
  });
});
