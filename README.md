# A claim gate that does not rent CPU

> **Domain:** CPU PowerUp sponsor pool gate  
> **Sources:** [SOURCES.md](SOURCES.md)  
> **Vault:** `px-contract-examples-vault` (private index; not this public course)

**Goal:** Teach the sponsor checks before a pool would pay `powerup`: caller is the holder, payment is a positive integer ≤ `max_payment`, quota remains, and the pool covers it.

**Code under test:** `npm test` (unit + sequential composition). **Does not** call PowerUp or broadcast.

## Learning materials

| Doc | Role |
| --- | --- |
| [EDUCATION.md](EDUCATION.md) | Full course |
| [WORKED-EXAMPLES.md](WORKED-EXAMPLES.md) | Five gates + desk |
| [TIPS.md](TIPS.md) | Pure predicate |
| [SECURITY.md](SECURITY.md) | Abuse surface |
| [SOURCES.md](SOURCES.md) | Official |

## What is true (executed)

| Rule | Result |
| --- | --- |
| Valid holder + payment + quota + pool | ok |
| Wrong caller / bounds / quota / pool | refused |
| canClaim | pure |
| Sequential desk | drains then refuses |

```bash
npm test
```

MIT — Pixel Journey
