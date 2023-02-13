#!/bin/bash

set -e

# set SKIP_DEPS env to skip fetching dependencies and deploying nft-protocol
# set TEST_VALIDATOR_CONFIG env to use a custom validator config
# set SUI_BIN env to use a custom sui binary

export $(cat "__tests__/.env.test" | xargs)

# current dir
root="$(pwd)"
# defined by mnemonic in test consts
test_addr="2d1770323750638a27e8a2b4ad4fe54ec2b7edf0"
# path to test assets
test_assets_dir="${root}/__tests__/assets"
test_assets_tmp_dir="${test_assets_dir}/.tmp"
nft_protocol_dir="${test_assets_tmp_dir}/nft-protocol"
originmate_dir="${test_assets_tmp_dir}/originmate"
test_validator_config=${TEST_VALIDATOR_CONFIG:-"${test_assets_tmp_dir}/localnet/client.yaml"}
sui_bin=${SUI_BIN:-"${test_assets_tmp_dir}/sui"}

mkdir -p "${test_assets_tmp_dir}"

installed_sui_version=$($sui_bin --version)
if [[ "${installed_sui_version}" != "${SUI_VERSION}" ]]; then
    echo "ERROR: expected sui version '${SUI_VERSION}'"
    echo "But running '$ sui --version' returned:"
    echo
    echo "${installed_sui_version}"
    echo
    exit 1
fi

# check for dependencies
toml --version &>/dev/null ||
    (echo "ERROR: missing dependency toml" && echo "\$ cargo install toml-cli" && exit 1)
curl --version &>/dev/null || (echo "ERROR: missing dependency curl" && exit 1)
jq --version &>/dev/null || (echo "ERROR: missing dependency jq" && exit 1)
git --version &>/dev/null || (echo "ERROR: missing dependency git" && exit 1)

sui_validator_http="http://0.0.0.0:9000"
# exit if sui local validator not running
curl --silent \
    --request POST "${sui_validator_http}" \
    --header 'Content-Type: application/json' \
    --data-raw '{ "jsonrpc":"2.0", "method":"rpc.discover","id":1}' 1>/dev/null ||
    (echo "Sui local validator not running on ${sui_validator_http}" && exit 1)

function deploy_package {
    # @arg path to package
    # @returns the address of the published module

    package_dir="${1}"

    publish_output=$($sui_bin client --client.config "${test_validator_config}" \
        publish \
        --gas-budget 30000 \
        --json \
        "${package_dir}")

    # if last command failed, print
    if [ $? -ne 0 ]; then
        echo >&2 "Cannot deploy ${package_dir}:"
        echo >&2
        echo >&2
        echo >&2 "${publish_output}"
        exit 1
    fi

    echo "${publish_output}" |
        jq -r '.effects.created[] | select( .owner == "Immutable" ) | .reference.objectId'
}

# if env "SKIP_DEPS" is not set, fetch dependencies
if [ -z "${SKIP_DEPS}" ]; then
    echo "Fetching nft-protocol dependency"
    rm -rf "${test_assets_tmp_dir}/nft-protocol"
    git clone --quiet --depth 1 "git@github.com:Origin-Byte/nft-protocol.git" "${nft_protocol_dir}"
    cd "${nft_protocol_dir}"
    git fetch --quiet --depth 1 origin "${NFT_PROTOCOL_REV}"
    git checkout --quiet "${NFT_PROTOCOL_REV}"
    originmate_rev=$(
        toml get "${nft_protocol_dir}/Move.toml" dependencies.Originmate.rev |
            tr -d '"'
    )

    echo "Fetching originmate dependency (rev ${originmate_rev})"
    rm -rf "${test_assets_tmp_dir}/originmate"
    git clone --quiet --depth 1 "git@github.com:Origin-Byte/originmate.git" "${originmate_dir}"
    cd "${originmate_dir}"
    git fetch --quiet --depth 1 origin "${originmate_rev}"
    git checkout --quiet "${originmate_rev}"

    cd "${root}"

    echo
    echo "Deploying originmate to local validator"
    # is publishable only of the addr is 0x0
    sed -i -r 's/originmate = "0x(.+)/originmate = "0x0"/' \
        "${originmate_dir}/Move.toml"
    originmate_address=$(deploy_package "${originmate_dir}")
    if [ -z "${originmate_address}" ]; then
        echo "Failed to deploy originmate to local validator"
        exit 1
    fi

    echo "Using originmate address '${originmate_address}'"
    # in originmate manifest so that nft-protocol can use it as a dep
    sed -i -r "s/originmate = \"0x0\"/originmate = \"${originmate_address}\"/" \
        "${originmate_dir}/Move.toml"
    # in nft-protocol manifest so that it can be published (otherwise missing dep)
    sed -i -r 's/nft_protocol = "0x(.+)/nft_protocol = "0x0"/' \
        "${nft_protocol_dir}/Move.toml"
    # nft-protocol will point to local copy of originmate instead of the git one
    # piping directly to tee doesn't work (perhaps there are two streams)
    new_manifest=$(
        toml set "${nft_protocol_dir}/Move.toml" \
            dependencies.Originmate \
            "REPLACE"
    )
    echo "${new_manifest/\"REPLACE\"/\{ local = \"../originmate\" \}}" |
        tee "${nft_protocol_dir}/Move.toml" >/dev/null
    # is publishable only of the addr is 0x0
    sed -i -r 's/nft_protocol = "0x(.+)/nft_protocol = "0x0"/' \
        "${nft_protocol_dir}/Move.toml"

    echo
    echo "Deploying nft-protocol to local validator"
    nft_protocol_address=$(deploy_package "${nft_protocol_dir}")
    echo "Using nft-profocol address '${nft_protocol_address}'"
    # in nft_protocol manifest so that testract can use it as a dep
    sed -i -r "s/nft_protocol = \"0x0\"/nft_protocol = \"${nft_protocol_address}\"/" \
        "${nft_protocol_dir}/Move.toml"

    coin_obj_count=$(
        $sui_bin client --client.config "${test_validator_config}" objects "${test_addr}" --json |
            jq 'map( select( .type | contains("Coin") ) ) | length'
    )
    # transfer some coins to test user if they don't have any
    if [ "${coin_obj_count}" -eq 0 ]; then
        echo "Transfering SUI to test user"

        # one for gas, one for SUI wallet
        for _i in {1..2}; do
            coin_id=$(
                $sui_bin client --client.config "${test_validator_config}" gas --json |
                    jq -r '.[0].id.id'
            )
            $sui_bin client --client.config "${test_validator_config}" \
                pay_all_sui \
                --gas-budget 100000 \
                --input-coins "${coin_id}" \
                --recipient "${test_addr}" 1>/dev/null
        done
    fi
fi

echo
echo "Deploying testract to local validator"
testract_address=$(deploy_package "${test_assets_dir}/testract")
echo "Testract deployed under address '${testract_address}'"

export NFT_PROTOCOL_ADDRESS=$(
    toml get "${nft_protocol_dir}/Move.toml" addresses.nft_protocol |
        tr -d '"'
)
export TESTRACT_ADDRESS="${testract_address}"

eval "$@"
