# Official sources

| Source | Use |
| --- | --- |
| [docs.eosnetwork.com resources](https://docs.eosnetwork.com/docs/latest/apis/rpc/resources/) | Resource model vocabulary |
| [docs.wax.io](https://docs.wax.io/) | Search current PowerUp / CPU rental guides |
| System `powerup` | Live chain action on the system account — **this lab does not call it** |

**Teaching constants (not chain limits):** base payment 50, max payment 100, quota 3, pool 1000. `canClaim` is a **pure predicate**. Mutate quota only after a successful powerup you actually sent.

This gate does **not** prove the caller holds a Pixal, and it is **not** ORNG stake ([auto-stake](https://github.com/pixel-journey/px-orng-auto-wax-stake-manager)).

## Domain map

| Repo | Role |
| --- | --- |
| **This repo** | Holder + payment + quota + pool gates |
| [invariant kit](https://github.com/pixel-journey/px-invariant-kit) | Shared name / range checks |
| [auto-stake](https://github.com/pixel-journey/px-orng-auto-wax-stake-manager) | ORNG credit stake, different action |
| [treasury path](https://github.com/pixel-journey/px-contract-examples-vault/blob/main/docs/TREASURY-TOKEN-LEARNING-PATH.md) | Step 14 |
