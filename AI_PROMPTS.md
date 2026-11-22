# AI prompts

Non-negotiables:

- Teaching constants: base 50, max 100, quota 3, pool 1000. These are **not** chain powerup prices.
- Check order: holder → positive payment → ≤ max → quota > 0 → ≤ pool.
- Failed checks leave quota and pool unchanged.
- Pure `canClaim` does not mutate the input object.
- Mutate quota/pool only **after** ok, next to a real powerup you actually sent.
- This is **not** `orng.wax` stake and **not** a Pixal proof.
- No wasm, no broadcast, no system `powerup` call in this repo.

Prompt seeds:

1. Walk a payment of 80 through all five gates with quota 1 and pool 1000.
2. Show why a second pure `canClaim` must not burn quota.
3. Port the predicate order to another Antelope chain without inventing WAX prices as truth.
4. Refuse equating this lab with [auto-stake](https://github.com/pixel-journey/px-orng-auto-wax-stake-manager).
