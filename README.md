# px-cpu-eosio-powerup-sponsor-pool

Quest 139. Tier B. The contract calls `eosio::powerup` so a new account can get a short CPU window without staking.

## Behavior

- `claimcpu(user)` requires the user or the contract.
- Two claims per 24 hours. The window resets when `now - last_powerup_sec >= 86400`.
- The first quota row is paid by the contract. That is an explicit exception to "the contract never pays RAM". Gate it on an NFT ownership check before mainnet, or the table is an open RAM faucet.
- `net_frac = 1e8` and `cpu_frac = 5e9` are shares of the powerup pool out of 1e15, not percentages and not WAX.
- `max_payment` is 0.50000000 WAX. If the market price of that fraction is higher, `powerup` fails and the quota change reverts with it.

The contract needs a WAX balance and `eosio.code` on active. `days` is 1.

## Not done

No NFT gate. No payment from the user. No refund of unused max_payment (the system contract handles that).

Private while the vector suite is open.
