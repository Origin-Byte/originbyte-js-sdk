module testract::testract {
    use nft_protocol::collection;
    use nft_protocol::nft;
    use nft_protocol::transfer_allowlist;
    use std::option;
    use std::vector;
    use sui::coin;
    use sui::object::{Self, UID};
    use sui::transfer::{share_object, transfer};
    use sui::tx_context::{TxContext};

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

        share_object(wl);
        share_object(collection);
        share_object(meta);
    }
}
