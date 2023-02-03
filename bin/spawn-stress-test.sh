#!/bin/bash

mnemonic="$(solana-keygen new --no-outfile --no-bip39-passphrase | tail -2 | head -1)"

out=$(sui keytool import "${mnemonic}" ed25519 2>&1 | cut -d'[' -f 2)
sui_addr="${out::-1}"

/home/aldrin/Code/laminar/tests/airdrop-coin.sh --to "${sui_addr}" --amount 500000 --cont clutchy-validator-1 1>/dev/null
/home/aldrin/Code/laminar/tests/airdrop-coin.sh --to "${sui_addr}" --amount 1000000 --cont clutchy-validator-1 1>/dev/null

sed -i "31s/.*/const TEST_USER: address = @${sui_addr};/" __tests__/assets/testract/sources/main.move

export SKIP_DEPS=1
source ./bin/setup-test-env.sh

echo
echo "Deploying testract to local validator"
testract_address=$(deploy_package "${test_assets_dir}/testract")
echo "Testract deployed under address '${testract_address}'"

nft_protocol_address=$(
    toml get "${nft_protocol_dir}/Move.toml" addresses.nft_protocol |
        tr -d '"'
)
echo "NFT protocol deployed under address '${nft_protocol_address}'"

TESTRACT_ADDRESS=${testract_address} \
    NFT_PROTOCOL_ADDRESS="${nft_protocol_address}" \
    MNEMONIC=${mnemonic} \
    node dist-stress/__tests__/stresstest.js &
