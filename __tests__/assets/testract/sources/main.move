module testract::testract {
    use std::option;
    use std::vector;
    use std::string;

    use sui::coin;
    use sui::object::{Self, UID};
    use sui::transfer::{share_object, transfer};
    use sui::tx_context::{Self, TxContext};

    use nft_protocol::collection::{Self, Collection, MintCap};
    use nft_protocol::creators;
    use nft_protocol::display;
    use nft_protocol::nft;
    use nft_protocol::royalty;
    use nft_protocol::tags;
    use nft_protocol::transfer_allowlist;

    // mint more NFTs if not enough for new tests
    const NFTS_TO_MINT: u64 = 32;

    struct TESTRACT has drop {}

    struct Witness has drop {}

    // simulates a generic NFT
    struct CapyNft has key, store {
        id: UID,
    }

    const TEST_USER: address = @0x2d1770323750638a27e8a2b4ad4fe54ec2b7edf0;

    fun init(witness: TESTRACT, ctx: &mut TxContext) {
        let (mint_cap, collection) = collection::create<TESTRACT>(
            &witness,
            ctx,
        );

        add_domains(&mut collection, &mut mint_cap, ctx);

        let col_cap = transfer_allowlist::create_collection_cap<TESTRACT, Witness>(
            &Witness {}, ctx,
        );

        let wl = transfer_allowlist::create(Witness {}, ctx);
        transfer_allowlist::insert_collection(
            Witness {},
            &col_cap,
            &mut wl,
        );

        let i = 0;
        while (i < NFTS_TO_MINT) {
            transfer(nft::new<TESTRACT, Witness>(&Witness {}, TEST_USER, ctx), TEST_USER);
            transfer(CapyNft { id: object::new(ctx) }, TEST_USER);
            i = i + 1;
        };

        let (treasury_cap, meta) = coin::create_currency(
            witness,
            0,
            vector::empty(),
            vector::empty(),
            vector::empty(),
            option::none(),
            ctx,
        );

        transfer(col_cap, TEST_USER);
        transfer(treasury_cap, TEST_USER);
        transfer(mint_cap, TEST_USER);
        transfer(wl, TEST_USER);

        share_object(collection);
        share_object(meta);
    }

    public entry fun mint_n_nfts(
        n: u64,
        safe: &mut nft_protocol::safe::Safe,
        ctx: &mut TxContext,
    ) {
        let sender = sui::tx_context::sender(ctx);

        let i = 0;
        while (i < n) {
            let nft = nft::new<TESTRACT, Witness>(&Witness {}, sender, ctx);
            nft_protocol::safe::deposit_nft(nft, safe, ctx);

            i = i + 1;
        };
    }

    public entry fun create_bid(
        price: u64,
        safe: &mut nft_protocol::safe::Safe,
        treasury: &mut sui::coin::TreasuryCap<TESTRACT>,
        orderbook: &mut nft_protocol::ob::Orderbook<TESTRACT, TESTRACT>,
        ctx: &mut TxContext,
    ) {
        let wallet = coin::mint(treasury, price, ctx);

        nft_protocol::ob::create_bid(
            orderbook,
            safe,
            price,
            &mut wallet,
            ctx,
        );

        coin::burn(treasury, wallet);
    }

    public entry fun collect_royalty(
        payment: &mut nft_protocol::royalties::TradePayment<TESTRACT, TESTRACT>,
        ctx: &mut TxContext,
    ) {
        nft_protocol::royalties::transfer_remaining_to_beneficiary(Witness {}, payment, ctx);
    }

    fun add_domains(
        collection: &mut Collection<TESTRACT>,
        mint_cap: &mut MintCap<TESTRACT>,
        ctx: &mut TxContext,
    ) {
        collection::add_domain(
            collection,
            mint_cap,
            creators::from_address(tx_context::sender(ctx), ctx)
        );

        display::add_collection_display_domain(
            collection,
            mint_cap,
            string::utf8(b"Suimarines"),
            string::utf8(b"A unique NFT collection of Suimarines on Sui"),
            ctx,
        );

        display::add_collection_url_domain(
            collection,
            mint_cap,
            sui::url::new_unsafe_from_bytes(b"https://originbyte.io/"),
            ctx,
        );

        display::add_collection_symbol_domain(
            collection,
            mint_cap,
            string::utf8(b"SUIM"),
            ctx,
        );

        let royalty = royalty::from_address(tx_context::sender(ctx), ctx);
        royalty::add_proportional_royalty(&mut royalty, 100);
        royalty::add_royalty_domain(collection, mint_cap, royalty);

        let tags = tags::empty(ctx);
        tags::add_tag(&mut tags, tags::art());
        tags::add_collection_tag_domain(collection, mint_cap, tags);
    }
}
