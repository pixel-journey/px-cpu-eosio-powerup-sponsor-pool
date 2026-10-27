#include <eosio/eosio.hpp>
#include <eosio/asset.hpp>
#include <eosio/system.hpp>

using namespace eosio;

// Quest: px-cpu-eosio-powerup-sponsor-pool
CONTRACT px_cpu_sponsor : public contract {
public:
    using contract::contract;

    struct [[eosio::table]] user_quota {
        name account;
        uint32_t last_powerup_sec;
        uint16_t daily_claims;
        uint64_t primary_key() const { return account.value; }
    };
    typedef multi_index<"quotas"_n, user_quota> quotas_table;

    [[eosio::action]]
    void claimcpu(name user) {
        check(has_auth(user) || has_auth(get_self()), "missing authority");
        check(is_account(user), "user does not exist");

        uint32_t now = current_time_point().sec_since_epoch();
        quotas_table quotas(get_self(), get_self().value);
        auto itr = quotas.find(user.value);

        if (itr == quotas.end()) {
            // First row: contract pays RAM. Gate this on NFT ownership before mainnet.
            quotas.emplace(get_self(), [&](auto& row) {
                row.account = user;
                row.last_powerup_sec = now;
                row.daily_claims = 1;
            });
        } else if (now - itr->last_powerup_sec >= 86400) {
            quotas.modify(itr, same_payer, [&](auto& row) {
                row.last_powerup_sec = now;
                row.daily_claims = 1;
            });
        } else {
            check(itr->daily_claims < 2, "daily free CPU quota exceeded");
            quotas.modify(itr, same_payer, [&](auto& row) { row.daily_claims += 1; });
        }

        // Fractions are out of 1e15 (100% of the network powerup pool).
        int64_t net_frac = 100000000;
        int64_t cpu_frac = 5000000000;
        asset max_payment(50000000, symbol("WAX", 8));

        action(
            permission_level{get_self(), "active"_n},
            "eosio"_n,
            "powerup"_n,
            std::make_tuple(get_self(), user, uint32_t(1), net_frac, cpu_frac, max_payment)
        ).send();
    }
};
