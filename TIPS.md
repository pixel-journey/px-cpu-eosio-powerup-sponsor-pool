# Tips — sponsor gate that does not rent CPU

`canClaim` returns ok or a reason. It does not call `eosio::powerup`, move the pool, or prove an NFT.

## Check order

1. Caller equals the holder string.
2. Payment is a positive integer.
3. Payment ≤ `max_payment`.
4. Quota `> 0`.
5. Payment ≤ pool.

A test that only matches `/quota/` will miss a pool failure if quota is already zero. The pool case in the tests uses payment 80, max 100, pool 40 so the failure is step 5.

## Do

- Keep the predicate pure. Decrement quota and pool only **after** ok, in the same action as the real powerup.
- Treat quota as a **count of claims**, not a token balance. Payment 50 and payment 80 each cost one quota.
- Share `pool_balance` across holders. Do not share `remaining_quota`.
- Switch to `bigint` before this becomes a token amount. These fields are JavaScript numbers. `2^53` is the silent ceiling.

## Don't

- Call a matching string an NFT gate. Pixal ownership is **not** in `canClaim`. Older description copy that says "sybil gate" is ahead of the tests.
- Decrement quota before the pool check. A too-large payment would burn the daily claim and pay nothing.
- Confuse this with ORNG stake ([auto-stake](https://github.com/pixel-journey/px-orng-auto-wax-stake-manager)). Powerup rents CPU. ORNG stake buys randomness credits.

## Common mistakes

1. Expecting a second `canClaim` to lower quota. It will not.
2. Reading "insufficient pool" when max was already exceeded (order).
3. Building a powerup action with a user-supplied action name.
4. Using `payment` 50.5. It fails the integer check.

## Nice-to-have extensions (not in this repo)

| Idea | Note |
| --- | --- |
| Real `eosio::powerup` | System contract ABI; `max_payment` is the slippage ceiling |
| Pixal template allowlist | Read the asset in the same action |
| Pause the pool | [pausable](https://github.com/pixel-journey/px-token-pausable-emergency-guard) |
| Refund unused quota at day end | New clock tests |

ABI: [resources RPC](https://docs.eosnetwork.com/docs/latest/apis/rpc/resources/). Docs: [docs.wax.io](https://docs.wax.io/).
