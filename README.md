# px-cpu-eosio-powerup-sponsor-pool

Quest 139. Private. Uncompiled sketch. There is no `npm test`. `cdt-cpp` was not run. Nothing was sent to `eosio::powerup`.

## What the file tries to say

`contracts/src/px_cpu_sponsor.cpp` sketches `claimcpu(user)`:

- The user or the contract must authorize.
- Two claims in 24 hours.
- The first table row is paid by the contract. That is an open RAM faucet until an NFT check exists. It does not exist.
- `net_frac = 1e8` and `cpu_frac = 5e9` are shares of the powerup pool out of 1e15. `max_payment` is 0.50000000 WAX.

The contract would need a WAX balance and `eosio.code`. Neither was configured. `client/wharfkit-demo.ts` was not run.

Do not deploy this file.
