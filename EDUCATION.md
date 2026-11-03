# Education — a sponsor gate that does not call powerup

> **Rung:** `npm test` passes. `canClaim` returns ok or a reason. It does not call `eosio::powerup`, move a pool, or read an NFT. `contracts/src/px_cpu_sponsor.cpp` is an **uncompiled sketch**.  
> **The test is the rule.**

## What you should be able to do

| Level | After this file |
| --- | --- |
| Beginner | Accept Alice at payment 50 inside max 100, quota 3, and pool 1000 |
| Intermediate | Name the five refusals in the order the function checks them |
| Masterclass | Say why `caller === holder` is not an NFT check, and why these fields are JavaScript numbers |

---

## Beginner — one scene

```text
caller           alice
holder           alice
payment          50
max_payment      100
remaining_quota  3
pool_balance     1000
```

`canClaim` returns `{ ok: true }`.

| Change | Result the test locks |
| --- | --- |
| caller `bob` | `ok: false`, reason matches `holder` |
| payment 150 | `ok: false`, reason matches `max_payment` |
| payment 0 or -10 | `ok: false` |
| quota 0 | `ok: false`, reason matches `quota` |
| payment 80, max 100, pool 40 | `ok: false`, reason matches `insufficient pool` |

Nothing in the success case spends the quota or the pool. A second call with the same object still returns ok. The function is a predicate.

### Words

| Word | Meaning here |
| --- | --- |
| Holder | The string that must equal `caller`. Not a Pixal balance and not a template id |
| `max_payment` | Slippage-style ceiling on this one payment |
| Quota | A number that must be `> 0`. The function does not decrement it |
| Pool | A number that must cover `payment`. The function does not subtract it |

### Predict, then run

```bash
npm test
```

1. The happy path does not return a transaction id.
2. Non-positive payments are refused. The test does not assert the reason string. The source reason is `non-positive payment`.
3. Payment 80 fails the pool check only because 80 is still within max 100. If max were 70, the max check would fail first. That pair is not a test.

---

## Intermediate — order is the reason you will see

```text
1. caller !== holder          → "not the holder"
2. payment not a positive int → "non-positive payment"
3. payment > max_payment      → "exceeds max_payment"
4. remaining_quota <= 0       → "quota exhausted"
5. payment > pool_balance     → "insufficient pool"
6. otherwise                  → { ok: true }
```

The insufficient-pool test sets payment 80, max 100, pool 40 so the failure is step 5, not step 3. If you change max to 10 while debugging and still expect "insufficient pool," you will mis-read the lab.

Quota 0 fails even if the pool is full. The test locks that.

These are JavaScript `number`s, not `bigint`. A payment of `50.5` fails step 2 (`Number.isInteger`). No test passes a fractional payment. Amounts that matter on chain should not stay in `number`. See the dex-tax course for `Number(MAX_AMOUNT)` collapsing. This file does not demonstrate that collapse. It also does not guard it.

### Attack → test

| Attack | Naive code | This lab | Test |
| --- | --- | --- | --- |
| Bob claims Alice's slot | Sponsor drained by non-holders | `not the holder` | `non-holder is refused` |
| Pay more than the published max | Slippage / grief on the pool | `exceeds max_payment` | `payment above max_payment` |
| Zero or negative payment | Nonsense powerup | `ok: false` | `non-positive payment is refused` |
| Keep claiming after the daily count | One holder empties the pool | `quota exhausted` | `exhausted quota is refused` |
| Payment the pool cannot cover | Action fails later, or wraps | `insufficient pool` | `insufficient pool is refused` |

---

## Masterclass — a green predicate is not a CPU rental

`eosio::powerup` is a system action: you pay WAX, you name the receiver, you set `max_payment` so a price move cannot take more than you allowed. This function does not build that action. `client/wharfkit-demo.ts` is not a passing integration test unless `npm test` runs it. The executed file is `invariants/powerup.test.ts`.

What a real sponsor still has to do, in one transaction, after `canClaim` would have returned ok:

1. Prove the holder. A string field the user sets to their own name is not a Pixal NFT gate. The index row for this repo says the NFT gate is not done. Believe that over the word "holder" in the type.
2. Decrement quota and pool **in the same action** as the powerup, or a retry double-spends. This predicate decrements nothing, so two ok results do not reserve the WAX.
3. `require_auth` of the caller. Then the caller-versus-holder check is about the NFT, not about a second name in the action data.
4. Use the chain's token amount, not a JavaScript number, for `payment`, `max_payment`, and `pool_balance`.
5. Send `powerup` with a constant action name. No user-supplied action name.

The sketch under `contracts/src/` does not change the rung. It is uncompiled. The test wins until a pinned CDT build exists.

### Exercise

1. Happy path. `ok`? (true. Tested.)
2. Quota 0 and a full pool. Which reason? (`quota exhausted`. The quota check is before the pool check. Tested.)
3. Does a successful `canClaim` reduce `remaining_quota`? (No. Call it again on the same object. Derived from the source: it returns a result and does not write.)

---

## What this course will not teach

- That Alice owns a Pixal
- A sent `eosio::powerup` transaction
- A quota that decreases
