# Official sources

| Source | Use |
| --- | --- |
| [docs.eosnetwork.com resources](https://docs.eosnetwork.com/docs/latest/apis/rpc/resources/) | Resource model vocabulary |
| [docs.wax.io](https://docs.wax.io/) | Search current PowerUp / CPU rental guides |
| System `powerup` | Live chain action on the system account — **this lab does not call it** |

## Product facts locked by tests

**Teaching constants (not chain limits):** base payment 50, max payment 100, quota 3, pool 1000.

`canClaim` check order:

1. Caller equals the holder string
2. Payment is a positive integer
3. Payment ≤ `max_payment`
4. Quota `> 0`
5. Payment ≤ pool

Failed checks leave quota and pool **unchanged**. A pure second `canClaim` does **not** mutate the input object.

- Quota is a **count of claims**, not a token balance. Payment 50 and payment 80 each cost one quota once you mutate after ok.
- Decrement quota and pool only **after** ok, in the same action as a real powerup you actually sent.
- This gate does **not** prove the caller holds a Pixal, and it is **not** ORNG stake ([auto-stake](https://github.com/pixel-journey/px-orng-auto-wax-stake-manager)).
- Fields are JavaScript numbers here. Switch to bigint before production amounts near `2^53`.

## Domain map

| Repo | Role |
| --- | --- |
| **This repo** | Holder + payment + quota + pool gates |
| [invariant kit](https://github.com/pixel-journey/px-invariant-kit) | Shared name / range checks |
| [auto-stake](https://github.com/pixel-journey/px-orng-auto-wax-stake-manager) | ORNG credit stake, different action |
| [pausable](https://github.com/pixel-journey/px-token-pausable-emergency-guard) | Pause the pool without a single-key trap |
| [treasury path](https://github.com/pixel-journey/px-contract-examples-vault/blob/main/docs/TREASURY-TOKEN-LEARNING-PATH.md) | Step 14 |
