# Official sources

| Source | Use |
| --- | --- |
| [WAX PowerUp / resource docs](https://docs.wax.io/) | Search docs.wax.io for current PowerUp / CPU rental guides |
| [docs.eosnetwork.com](https://docs.eosnetwork.com/) | System contracts, resources |
| System `powerup` | Live chain action on the network's system account (verify ABI on the chain you target) |

This lab is a **pre-check only**. It does not call `powerup` or move WAX.

## Domain map

| Repo | Role |
| --- | --- |
| **This repo** | Holder + payment + quota + pool gates |
| [px-invariant-kit](https://github.com/pixel-journey/px-invariant-kit) | Shared name / range checks |
