# A claim gate that does not rent CPU

> **Domain:** CPU PowerUp sponsor pool gate  
> **Sources:** [SOURCES.md](SOURCES.md)  
> **Vault:** [px-contract-examples-vault](https://github.com/pixel-journey/px-contract-examples-vault)

**One-sentence goal:** Teach the sponsor checks that must pass before a pool would pay `powerup`: caller is the holder, payment is a positive integer inside `max_payment`, quota remains, and the pool covers it.

**Real code:** `npm test` (unit + **sequential composition**). **Does not** call PowerUp, prove an NFT, or broadcast.

Network docs: [docs.wax.io](https://docs.wax.io/). Always verify the live system ABI for `powerup` on the chain you target.

## Composition note

`powerup.composition.test.ts` runs a desk: `canClaim` stays pure; quota and pool decrement only after ok. Shared pool, per-holder quotas. Failed gates leave the desk unchanged.

## What is true (executed)

| Rule | Result |
| --- | --- |
| Valid holder + payment + quota + pool | `{ ok: true }` |
| Wrong caller / over max / zero payment / empty quota / insufficient pool | refused |
| `canClaim` | pure; second call still ok |
| Sequential desk | quota/pool drain; third claim refused |

## Run

```bash
npm test
```

MIT — Pixel Journey
