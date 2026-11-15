# Tips

- Keep `canClaim` pure. The only writer in this repo is the composition harness, and it runs after `ok`.
- Order inside `canClaim` is holder, then payment shape, then max, then quota, then pool. A test that only matches `/quota/` will not see a pool failure if quota is already zero.
- Quota is a **count of claims**, not a token balance. Payment `50` and payment `80` each cost one quota.
- Two holders share `pool_balance` and do not share `remaining_quota`.
- `payment` is a JavaScript `number` and must be an integer. Do not port this to a token amount without switching to `bigint`. `2^53` is the silent ceiling of this file.
- Production PowerUp needs the live system contract ABI ([resources RPC](https://docs.eosnetwork.com/docs/latest/apis/rpc/resources/)). Matching this predicate is not a successful `powerup`.
- A Pixal-holder check is **not** in `canClaim`. The GitHub description that mentions a sybil gate is ahead of the tests.
