# Security notes — powerup sponsor pool

## Authorization

- Only an eligible holder may call `claimpowerup` for their own account.
- Only the admin may change `max_payment` or deposit into the pool.
- The Pixal ownership check must read the AtomicAssets table; it must not trust a caller-supplied asset id list.

## Inputs and quotas

- Claim amount (or the computed powerup payment) must be positive and ≤ `max_payment`.
- Daily quota must be checked and decremented atomically.
- A claim that would exceed the remaining pool balance is refused.
- Negative or zero payment values are refused.

## Slippage and sybil

`max_payment` is a hard guard. If the network price for the requested CPU/NET exceeds it, the action must fail rather than overpay. The Pixal-holder gate exists so one entity cannot drain the pool through many accounts.

## What the tested rule covers

`npm test` runs `invariants/powerup.test.ts`.

- Eligible holder within limits may claim.
- Non-holder is refused.
- Payment above `max_payment` is refused.
- Non-positive payment is refused.
- Exhausted quota is refused.
- Insufficient pool balance is refused.

## Current status

The TypeScript rule exists. The C++ sketch is uncompiled. The NFT ownership gate is not implemented. The sketch is not the implementation.
