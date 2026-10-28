# Education

Example of a sponsored `eosio::powerup` pool with daily quotas, a slippage guard, and a holder gate.

## Why the guards exist

Without a daily quota a single account can empty the pool. Without `max_payment` a congested network can make the sponsor overpay. Without a holder check (Pixal or similar) an attacker can create many accounts and drain the pool.

## Authorization

The claim must be signed by the account that will receive the powerup. The ownership check for the gating NFT must come from the AtomicAssets table, not from the caller.

## Inputs

- Payment must be positive.
- Payment must not exceed `max_payment`.
- Quota for the current day must still have remaining claims.
- Pool balance must cover the payment.

Negative or zero values are refused so they cannot wrap or create a free claim.

## Current status

There is an uncompiled C++ sketch. There is no `npm test` rule. There is no wasm. The NFT ownership gate is not implemented.

The sketch is not the implementation.
