module ai_investment_account::ai_investment {
    use std::error;
    use std::signer;
    use std::string::{Self, String};
    use aptos_framework::account;
    use aptos_framework::coin;
    use aptos_framework::aptos_coin::AptosCoin;

    // ====== Error codes ======
    const E_NOT_AUTHORIZED: u64 = 1;
    const E_COMPANY_NOT_FOUND: u64 = 2;
    const E_INSUFFICIENT_FUND: u64 = 3;
    const E_SAME_COMPANY: u64 = 4;
    const E_NEGOTIATION_NOT_FOUND: u64 = 5;
    const E_NEGOTIATION_NOT_PENDDING: u64 = 6;

    // ====== Structs ======

    // AI Company structure
    struct AICompany has key {
        name: String,
        address: address,
        stock_price: u64, // Price per share (in smallest unit of APT)
        total_shares: u64, // Total shares issued
        available_shares: u64, // Available shares for investment
    }

    // Investment structure
    struct Investment has key, store {
        investor: address,
        company_name: String,
        shares: u64,
        total_value: u64,
        timestamp: u64,
    }

    // Negotiation structure
    struct Negotiation has key, store {
        id: u64,
        investor: address,
        company_name: String,
        target_company_name: String, //铭心科技 -> MarkMind Tech
        shares: u64,
        agree: bool,
        completed: bool,
        price_per_share: u64,
        timestamp: u64,
    }

    // Investor Portfolio for tracking all investments
    struct Portfolio has key {
        assets: vector<Investment>,
        negotiations: vector<u64>, // Track negotiation IDs
    }

    // Global counter for negotiation IDs
    struct GlobalCounter has key {
        negotiation_id_counter: u64,
    }

    // ====== View functions ======
    #[view]
    public fun get_company_name(company_addr: address): String acquires AICompany {
        let company = borrow_global<AICompany>(company_addr);
        company.name
    }

    #[view]
    public fun get_company_stock_price(company_addr: address): u64 acquires AICompany {
        let company = borrow_global<AICompany>(company_addr);
        company.stock_price
    }

    #[view]
    public fun get_company_available_shares(company_addr: address): u64 acquires AICompany {
        let company = borrow_global<AICompany>(company_addr);
        company.available_shares
    }

    #[view]
    public fun get_portfolio_size(account: address): u64 acquires Portfolio {
        if (!exists<Portfolio>(account)) {
            return 0
        };

        let portfolio = borrow_global<Portfolio>(account);
        vector::length(&portfolio.assets)
    }

    #[view]
    public fun get_negotiation_details(negotiation_id: u64): (address, String, String, u64, bool, bool, u64) {
        let negotiation = borrow_global<Negotiation>(@ai_investment_account);
        (
            negotiation.investor,
            negotiation.company_name,
            negotiation.target_company_name,
            negotiation.shares,
            negotiation.agree,
            negotiation.completed,
            negotiation.price_per_share
        )
    }

    // ====== Privately accessible functions ======
    fun get_witness(): AICompany {
        AICompany {
            name: string::utf8(b""),
            address: @0x0,
            stock_price: 0,
            total_shares: 0,
            available_shares: 0,
        }
    }

    // ====== Initialization function ======
    fun init_module(admin: &signer) {
        let admin_addr = signer::address_of(admin);

        // Initialize global counter
        move_to(admin, GlobalCounter { negotiation_id_counter: 1 });
    }

    // ====== Public functions ======

    // Register a new AI company
    public entry fun register_company(
        account: &signer,
        name: String,
        stock_price: u64,
        total_shares: u64
    ) acquires AICompany {
        let account_addr = signer::address_of(account);

        // Create company structure
        let company = AICompany {
            name,
            address: account_addr,
            stock_price,
            total_shares,
            available_shares: total_shares,
        };

        move_to(account, company);
    }

    // Initiate an investment negotiation between two AI companies
    public entry fun initiate_negotiation(
        investor: &signer,
        company_name: String,
        target_company_addr: address,
        shares: u64
    ) acquires AICompany, GlobalCounter, Negotiation {
        let investor_addr = signer::address_of(investor);

        // Get global counter
        let global_counter = borrow_global_mut<GlobalCounter>(@ai_investment_account);
        let negotiation_id = global_counter.negotiation_id_counter;
        global_counter.negotiation_id_counter = negotiation_id + 1;

        // Get company details
        let company = borrow_global<AICompany>(investor_addr);
        let target_company = borrow_global<AICompany>(target_company_addr);

        // Calculate price based on target company's stock price
        let price_per_share = target_company.stock_price;

        // Ensure the target company has enough available shares
        assert!(target_company.available_shares >= shares, error::invalid_argument(E_INSUFFICIENT_FUND));

        // Create negotiation
        let negotiation = Negotiation {
            id: negotiation_id,
            investor: investor_addr,
            company_name: company.name,
            target_company_name: target_company.name,
            shares,
            agree: false, // Pending
            completed: false,
            price_per_share,
            timestamp: 0, // Can be enhanced with timestamp
        };

        move_to(investor, negotiation);
    }

    // Accept/Reject a negotiation
    public entry fun respond_negotiation(
        responder: &signer,
        negotiation_id: u64,
        accept: bool
    ) acquires Negotiation, AICompany {
        let responder_addr = signer::address_of(responder);
        let negotiation = borrow_global_mut<Negotiation>(responder_addr);

        // Verify negotiation exists and is pending
        assert!(negotiation.id == negotiation_id, error::invalid_argument(E_NEGOTIATION_NOT_FOUND));
        assert!(!negotiation.completed, error::invalid_argument(E_NEGOTIATION_NOT_PENDDING));

        if (accept) {
            negotiation.agree = true;
            negotiation.completed = true;

            // Process the investment transfer
            // Note: In real implementation, would handle APT transfer here
            // For demo purposes, we update share ownership
        } else {
            negotiation.agree = false;
            negotiation.completed = true;
        }
    }

    // Direct investment without negotiation
    public entry fun make_direct_investment(
        investor: &signer,
        target_company_addr: address,
        shares: u64
    ) acquires AICompany, Portfolio {
        let investor_addr = signer::address_of(investor);
        let target_company = borrow_global_mut<AICompany>(target_company_addr);

        // Check if enough shares available
        assert!(target_company.available_shares >= shares, error::invalid_argument(E_INSUFFICIENT_FUND));

        // Calculate total investment value
        let total_value = shares * target_company.stock_price;

        // Update available shares
        target_company.available_shares = target_company.available_shares - shares;

        // Create investment record
        let investment = Investment {
            investor: investor_addr,
            company_name: target_company.name,
            shares,
            total_value,
            timestamp: 0, // Can be enhanced with timestamp
        };

        // Add to portfolio
        if (!exists<Portfolio>(investor_addr)) {
            let portfolio = Portfolio {
                assets: vector::empty<Investment>(),
                negotiations: vector::empty<u64>(),
            };
            move_to(investor, portfolio);
        };

        let portfolio = borrow_global_mut<Portfolio>(investor_addr);
        vector::push_back(&mut portfolio.assets, investment);
    }

    // Get sum of all shares held by investor
    #[view]
    public fun get_investor_total_shares(investor: address, company_name: String): u64 acquires Portfolio {
        if (!exists<Portfolio>(investor)) {
            return 0
        };

        let portfolio = borrow_global<Portfolio>(investor);
        let total_shares = 0;
        let i = 0;
        let len = vector::length(&portfolio.assets);

        while (i < len) {
            let investment = vector::borrow(&portfolio.assets, i);
            if (investment.company_name == company_name) {
                total_shares = total_shares + investment.shares;
            };
            i = i + 1;
        };

        total_shares
    }

    // Get total investment value across all companies
    #[view]
    public fun get_investor_total_value(investor: address): u64 acquires Portfolio {
        if (!exists<Portfolio>(investor)) {
            return 0
        };

        let portfolio = borrow_global<Portfolio>(investor);
        let total_value = 0;
        let i = 0;
        let len = vector::length(&portfolio.assets);

        while (i < len) {
            let investment = vector::borrow(&portfolio.assets, i);
            total_value = total_value + investment.total_value;
            i = i + 1;
        };

        total_value
    }

    // Helper function to compare strings (Move doesn't have built-in string comparison)
    public fun compare_strings(s1: &String, s2: &String): bool {
        string::bytes(s1) == string::bytes(s2)
    }
}
