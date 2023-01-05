#!/bin/bash

localnet_dir="__tests__/assets/.tmp/localnet"

# check if dir exists
if [ ! -d "${localnet_dir}" ]; then
    mkdir "${localnet_dir}"
    sui genesis -f --working-dir "${localnet_dir}"
fi

sui start --network.config "${localnet_dir}/network.yaml"
