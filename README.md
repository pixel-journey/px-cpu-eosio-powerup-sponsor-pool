# px-cpu-eosio-powerup-sponsor-pool

Private. Tested TypeScript rule exists. C++ sketch is uncompiled. Nothing was sent to `eosio::powerup`.

## What is true

`npm test` runs `invariants/powerup.test.ts`.

- Eligible holder within limits may claim.
- Non-holder is refused.
- Payment above `max_payment` is refused.
- Non-positive payment is refused.
- Exhausted quota is refused.
- Insufficient pool balance is refused.

The C++ in `contracts/src/px_cpu_sponsor.cpp` is still an uncompiled sketch. The NFT ownership gate is not implemented. `cdt-cpp` was not run. There is no wasm.

## Run

```bash
npm test
```

No host is called.

Do not deploy the sketch.
