module testract::testract {
    use sui::transfer::share_object;
    use sui::transfer::transfer;
    use sui::tx_context::TxContext;

    use nft_protocol::collection;
    use nft_protocol::nft;
    use nft_protocol::transfer_allowlist;

    struct TESTRACT has drop {}

    struct Witness has drop {}

    const TEST_USER: address = @0x2d1770323750638a27e8a2b4ad4fe54ec2b7edf0;

    fun init(witness: TESTRACT, ctx: &mut TxContext) {
        let (mint_cap, collection) = collection::create<TESTRACT>(
            &witness,
            ctx,
        );

        let col_cap = transfer_allowlist::create_collection_cap<TESTRACT, Witness>(
            &Witness {}, ctx,
        );

        let wl = transfer_allowlist::create(Witness {}, ctx);
        transfer_allowlist::insert_collection(
            Witness {},
            &col_cap,
            &mut wl,
        );

        transfer(nft::new<TESTRACT>(TEST_USER, ctx), TEST_USER);
        transfer(nft::new<TESTRACT>(TEST_USER, ctx), TEST_USER);
        transfer(nft::new<TESTRACT>(TEST_USER, ctx), TEST_USER);
        transfer(nft::new<TESTRACT>(TEST_USER, ctx), TEST_USER);

        transfer(col_cap, TEST_USER);
        transfer(mint_cap, TEST_USER);

        share_object(wl);
        share_object(collection);
    }
}
