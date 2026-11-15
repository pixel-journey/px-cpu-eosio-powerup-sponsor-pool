# Worked examples — sponsor claim gate

`canClaim` returns `{ ok: true }` or `{ ok: false, reason }`. It never changes `remaining_quota` or `pool_balance`. The composition desk decrements only after `ok`.

This is **not** an `eosio::powerup` call. No CPU is rented.

## Base object (unit tests)

```text
caller alice, holder alice, payment 50, max_payment 100,
remaining_quota 3, pool_balance 1000
→ ok
```

| Change | Result |
| --- | --- |
| caller `bob` | `not the holder` |
| payment `150` | `exceeds max_payment` |
| payment `100` (equal to max) | ok |
| payment `0` or `-10` | `non-positive payment` |
| payment `1.5` | refused (not an integer) |
| quota `0` or `-1` | `quota exhausted` |
| payment `80`, pool `40` | `insufficient pool` |
| payment `40`, pool `40` | ok |
| `canClaim` twice on the same object | still ok; quota stays `3`; pool stays `1000` |

## Desk — one holder

Pool `1000`. Alice quota `2`, max payment `100`.

| Step | Effect |
| --- | --- |
| Claim `50` | paid `50`, pool `950`, quota `1` |
| Claim `80` | paid `130`, pool `870`, quota `0` |
| Claim `10` | throws `quota`; pool stays `870` |

## Desk — shared pool

Pool `200`. Alice and Bob each have quota `1` and max `100`.

Alice claims `90`, Bob claims `100`. Pool is `10`. Both further claims fail on **quota**, not on the leftover `10`.

## Failed checks do not write

Pool `100`, Alice quota `3`, max `50`.

| Call | Reason |
| --- | --- |
| Bob claims for Alice, payment `10` | holder |
| Alice pays `60` | max_payment |
| Alice pays `0` | non-positive |

After all three: `claims` is `0`, pool is `100`, quota is `3`.

## Pool empty with quota left

Pool `40`, Alice quota `5`, max `100`. She claims `40`. Pool is `0`, quota is `4`. The next `1` fails `insufficient pool`. Quota is not decremented on that failure.
