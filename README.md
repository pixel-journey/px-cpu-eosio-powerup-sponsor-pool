# A claim gate that does not rent CPU

> **Trust:** private educational lab. C++ sketch is uncompiled.  
> **Vault:** [px-contract-examples-vault](https://github.com/pixel-journey/px-contract-examples-vault)

**One-sentence goal:** Teach the sponsor checks that must pass before a pool would pay `eosio::powerup`: caller is the holder string, payment is a positive integer inside `max_payment`, quota remains, and the pool covers it.

**Real code:** `npm test`. **Does not** call `eosio::powerup`, prove an NFT, or decrement the pool.

The course is [EDUCATION.md](EDUCATION.md) (beginner, intermediate, masterclass). Masterclass sections are the work this repo does not do.

## What is true (executed)

| Rule | Result |
| --- | --- |
| Alice, payment 50, max 100, quota 3, pool 1000 | `{ ok: true }` |
| Caller `bob` | refused, reason matches holder |
| Payment 150 | refused, reason matches `max_payment` |
| Payment 0 or -10 | `ok: false` |
| Quota 0 | refused, reason matches quota |
| Payment 80 against pool 40, max still 100 | refused, reason matches insufficient pool |

`canClaim` does not write. A second call on the same object is still ok.

`contracts/src/px_cpu_sponsor.cpp` is an uncompiled sketch. The NFT gate is not implemented. There is no wasm.

## Run

```bash
npm test
```

See [EDUCATION.md](EDUCATION.md) and [SECURITY.md](SECURITY.md).

MIT — Pixel Journey
