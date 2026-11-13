# Worked examples — powerup sponsor gate

`canClaim` is **pure**: it never mutates quota or pool. Composition tests decrement only after ok.

## Example A — all gates pass

caller === holder, payment in (0, max_payment], quota > 0, payment ≤ pool → `{ ok: true }`.

## Example B — not the holder

caller ≠ holder → `not the holder`.

## Example C — non-positive / over max

payment 0 or > max_payment → refused.

## Example D — quota exhausted

remaining_quota ≤ 0 → refused.

## Example E — insufficient pool

payment > pool_balance → refused.

## Example F — sequential desk

Two successful claims drain quota/pool in the composition harness; third fails; failed checks leave desk unchanged.

## Example G — honesty

This is **not** a call to system `powerup`. Always verify live ABI on the target chain.
