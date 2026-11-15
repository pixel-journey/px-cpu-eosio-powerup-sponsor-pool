# Security

## Closed by tests

- Caller is not the holder name.
- Payment not a positive integer, above `max_payment`, or above `pool_balance`.
- Quota `<= 0`.
- A failed check does not decrement quota or pool (composition harness).
- Calling `canClaim` twice does not mutate the input object.

## Not closed

- No `require_auth`. The holder string is whoever the caller typed.
- No system `powerup` action, no CPU weight, no `payer`.
- No NFT or Pixal ownership check, despite older description copy.
- Numbers are JS numbers, not asset quantities. A fractional payment is refused; a value above `Number.MAX_SAFE_INTEGER` is not modeled.
- The desk is test-only. There is no on-chain table.

## Attack the purity rule stops

If the contract decrements quota before the pool check, a too-large payment burns the user's daily claim and pays nothing. The composition test asserts the opposite: failure leaves quota and pool unchanged.
