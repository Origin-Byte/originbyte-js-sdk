#!/bin/bash

set -e

source __tests__/.env.test.sh

localnet_dir="__tests__/assets/.tmp/localnet"
sui_bin="__tests__/assets/.tmp/sui"

mkdir -p "${localnet_dir}"

# if sui file does not exist, download it
# TODO: check sui version as well
if [ ! -f "${sui_bin}" ]; then
    echo "Downloading sui binary version '${SUI_TAG}'"

    wget "https://github.com/MystenLabs/sui/releases/download/${SUI_TAG}/sui" \
        -O "${sui_bin}" -q --show-progress
    chmod +x "${sui_bin}"
fi

# check if dir exists
if [ ! -f "${localnet_dir}/network.yaml" ]; then
    $sui_bin genesis -f --working-dir "${localnet_dir}"
fi

echo ${SUI_TAG}
echo ${sui_bin}

$sui_bin --version

$sui_bin start --network.config "${localnet_dir}/network.yaml"
