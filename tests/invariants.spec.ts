export const invariants = [
  {
    id: "quota",
    attack: "Third claimcpu inside the same 24h window.",
    expect: "throws daily free CPU quota exceeded. powerup is not called.",
  },
  {
    id: "auth",
    attack: "Account A calls claimcpu(B).",
    expect: "throws missing authority unless A is the contract.",
  },
  {
    id: "ram-faucet",
    attack: "A new account calls claimcpu and the contract pays the first row.",
    expect: "Known gap. Mainnet must require an NFT (or a user-paid row) before emplace.",
  },
  {
    id: "fraction-units",
    attack: "Treat cpu_frac as a WAX amount.",
    expect: "cpu_frac is a 1e15 share of the CPU powerup pool. max_payment is the only WAX field.",
  },
  {
    id: "slippage",
    attack: "Powerup market moves above 0.5 WAX for the configured fraction.",
    expect: "eosio rejects the action and the quota increment reverts.",
  },
];
