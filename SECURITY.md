# Security — sponsor gate that does not rent CPU

## Closed in tests

| Issue | Behavior |
| --- | --- |
| Caller ≠ holder | refused |
| Payment not positive integer / above max / above pool | refused |
| Quota ≤ 0 | refused |
| Failed check | quota and pool **unchanged** |
| Second `canClaim` | does not mutate the input object |

Check order: holder → positive int → max_payment → quota → pool.

## Not closed (production)

| Concern | Guidance |
| --- | --- |
| Auth | Real `require_auth` — holder string is whoever the caller typed |
| System action | No `eosio::powerup`, no CPU weight, no `payer` |
| NFT / Pixal gate | **Not** in `canClaim` despite older description copy |
| Amount type | JS numbers, not assets — switch to bigint before production |
| Mutation | Decrement quota and pool only **after** ok, in the same action as powerup |

## Attack angles

1. Decrementing quota before the pool check (too-large payment burns the daily claim and pays nothing).  
2. Expecting a second pure `canClaim` to lower quota.  
3. Building a powerup action with a user-supplied action name.  
4. Confusing this with ORNG stake ([auto-stake](https://github.com/pixel-journey/px-orng-auto-wax-stake-manager)).  
5. Calling a matching string an NFT sybil gate.

## Honesty limits

Predicate only. Does not call PowerUp or broadcast.

| Sibling | Distinction |
| --- | --- |
| [ORNG auto-stake](https://github.com/pixel-journey/px-orng-auto-wax-stake-manager) | Stake path, not CPU rent |
| [pausable guard](https://github.com/pixel-journey/px-token-pausable-emergency-guard) | Emergency flag |

[resources RPC](https://docs.eosnetwork.com/docs/latest/apis/rpc/resources/) · [docs.wax.io](https://docs.wax.io/).
