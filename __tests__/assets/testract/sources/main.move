module testract::testract {
    use std::option;
    use std::vector;
    use std::string;

    use sui::coin;
    use sui::object::{Self, UID};
    use sui::transfer::{share_object, transfer};
    use sui::tx_context::{Self, TxContext};

    use nft_protocol::collection::{Self, Collection};
    use nft_protocol::display;
    use nft_protocol::nft;
    use nft_protocol::royalties::{Self, TradePayment};
    use nft_protocol::royalty;
    use nft_protocol::tags;
    use nft_protocol::transfer_allowlist_domain;
    use nft_protocol::transfer_allowlist;
    use nft_protocol::witness;

    // mint more NFTs if not enough for new tests
    const NFTS_TO_MINT: u64 = 32;

    struct TESTRACT has drop {}

    struct Witness has drop {}

    // simulates a generic NFT
    struct CapyNft has key, store {
        id: UID,
    }

    const TEST_USER: address = @0xddcdd8e07b59852f58ba8db8daff1b585d2fca23;

    fun init(witness: TESTRACT, ctx: &mut TxContext) {
        let (mint_cap, collection) = collection::create<TESTRACT>(
            &witness,
            ctx,
        );
        let delegated_witness = witness::from_witness(&Witness {});

        add_domains(&mut collection, ctx);

        let allowlist = transfer_allowlist::create(&Witness {}, ctx);
        transfer_allowlist::insert_collection<TESTRACT, Witness>(
            &Witness {},
            witness::from_witness(&Witness {}),
            &mut allowlist,
        );

        collection::add_domain(
            delegated_witness,
            &mut collection,
            transfer_allowlist_domain::from_id(object::id(&allowlist)),
        );

        let i = 0;
        while (i < NFTS_TO_MINT) {
            transfer(
                nft::new<TESTRACT, Witness>(
                    &Witness {},
                    string::utf8(b"some nft"),
                    sui::url::new_unsafe_from_bytes(b"http://example.com"),
                    TEST_USER,
                    ctx,
                ),
                TEST_USER,
            );
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

        transfer(treasury_cap, TEST_USER);
        transfer(mint_cap, TEST_USER);
        transfer(allowlist, TEST_USER);

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
            let nft = nft::new<TESTRACT, Witness>(
                &Witness {},
                string::utf8(b"hi there"),
                sui::url::new_unsafe_from_bytes(b"http://example.com"),
                sender,
                ctx,
            );
            nft_protocol::safe::deposit_nft(nft, safe, ctx);

            i = i + 1;
        };
    }

    public entry fun create_bid(
        price: u64,
        safe: &mut nft_protocol::safe::Safe,
        treasury: &mut sui::coin::TreasuryCap<TESTRACT>,
        orderbook: &mut nft_protocol::orderbook::Orderbook<TESTRACT, TESTRACT>,
        ctx: &mut TxContext,
    ) {
        let wallet = coin::mint(treasury, price, ctx);

        nft_protocol::orderbook::create_bid(
            orderbook,
            safe,
            price,
            &mut wallet,
            ctx,
        );

        coin::burn(treasury, wallet);
    }

    public entry fun collect_royalty(
        payment: &mut TradePayment<TESTRACT, TESTRACT>,
        ctx: &mut TxContext,
    ) {
        royalties::transfer_remaining_to_beneficiary(Witness {}, payment, ctx);
    }

    fun add_domains(
        collection: &mut Collection<TESTRACT>,
        ctx: &mut TxContext,
    ) {
        let delegated_witness = witness::from_witness(&Witness {});

        display::add_collection_display_domain(
            delegated_witness,
            collection,
            string::utf8(b"Suimarines"),
            string::utf8(b"A unique NFT collection of Suimarines on Sui"),
        );

        display::add_collection_url_domain(
            delegated_witness,
            collection,
            sui::url::new_unsafe_from_bytes(b"https://originbyte.io/"),
        );

        display::add_collection_symbol_domain(
            delegated_witness,
            collection,
            string::utf8(b"SUIM"),
        );

        let royalty = royalty::from_address(tx_context::sender(ctx), ctx);
        royalty::add_proportional_royalty(&mut royalty, 125); // 1.25%
        royalty::add_royalty_domain(
            nft_protocol::witness::from_witness(&Witness {}),
            collection,
            royalty,
        );

        let tags = tags::empty(ctx);
        tags::add_tag(&mut tags, tags::art());
        tags::add_collection_tag_domain(
            nft_protocol::witness::from_witness(&Witness {}),
            collection,
            tags,
        );
    }
}
