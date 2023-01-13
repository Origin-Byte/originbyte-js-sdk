# OriginByte JS SDK

[![npm version](https://badge.fury.io/js/@originbyte%2Fjs-sdk.svg)](https://badge.fury.io/js/@originbyte%2Fjs-sdk)
[![License](https://img.shields.io/badge/License-Apache_2.0-blue.svg)](https://opensource.org/licenses/Apache-2.0)

Javascript/Typescript SDK to work with Origin Byte NFT protocol.

Please note: The project is in an active development stage. Hence, some methods might change dramatically.

## Installation

```
yarn add @originbyte/js-sdk
```

or

```
npm add  @originbyte/js-sdk
```

## Usage

The main point of the SDK is `NftClient` class. It provides all necessary methods to fetch the data from the blockchain and build transactions to interact with the contract.
However, under the hood, the `NftClient` data fetcher uses the idea of a parsers' approach: you can create your own parser and fetch any data from the blockchain - by user wallet address or directly by Object ID.

The parser, by itself, is an object which implements an interface:

```typescript
export interface SuiObjectParser<RpcResponse, DataModel> {
  parser: (
    typedData: RpcResponse,
    suiObject: SuiObject,
    rpcResponse: GetObjectDataResponse
  ) => DataModel | undefined; // Parsing function, which takes RPC response and transform it into the plain JS object.
  regex: RegExp; // Regular expression to filter objects
}
```

Example of the parser:

```typescript
export const CollectionParser: SuiObjectParser<
  NftCollectionRpcResponse,
  NftCollection
> = {
  parser: (
    data: NftCollectionRpcResponse,
    suiData: SuiObject,
    rpcResponse: GetObjectDataResponse
  ) => ({
    name: data.name,
    description: data.description,
    creators: data.creators,
    symbol: data.symbol,
    currentSupply: data.cap.fields.supply.fields.current,
    totalSupply: data.cap.fields.supply.fields.cap,
    receiver: data.receiver,
    type: suiData.data.dataType,
    id: suiData.reference.objectId,
    tags: data.tags.fields.enumerations.fields.contents.map(
      (_) => _.fields.value
    ),
    rawResponse: rpcResponse,
  }),
  regex:
    /0x[a-f0-9]{40}::collection::Collection<0x[a-f0-9]{40}::[a-zA-Z]{1,}::[a-zA-Z]{1,}, 0x[a-f0-9]{40}::std_collection::StdMeta, 0x[a-f0-9]{40}::cap::[a-zA-Z]{1,}>/,
};
```

Besides of that, the SDK provides predefined parsers and methods to interact with Origin Byte's NFT protocol. Next methods are available:

- fetchAndParseObjectsById
- fetchAndParseObjectsForAddress
- getMintAuthoritiesById
- getMarketsByParams
- getCollectionsById
- getCollectionsForAddress
- getNftsById
- getNftsForAddress
- getNftCertificatesById
- getNftCertificatesForAddress

Take a look at [Examples](#examples) for more details.

### Examples

#### Fetch Onchain Data: Collection and NFTs

```typescript
import { NftClient } from "@originbyte/js-sdk";

const getNfts = async () => {
  const client = new NftClient();
  const collection = await client.getCollectionsById({
    objectIds: ["0xfc18b65338d4bb906018e5f73b586a57b777d46d"],
  });
  const nfts = await client.getNftsForAddress(
    "0x0ec841965c95866d38fa7bcd09047f4e0dfa0ed9"
  );
  console.log("nfts", collection, nfts);
};

getNfts();
```

#### Mint new NFT

```typescript
const mintToLaunchpad = async () => {
  const collections = await client.getCollectionsForAddress(
    `0x${keypair.getPublicKey().toSuiAddress()}`
  );

  const collectionsForWallet = collections.filter(
    (_) => _.packageObjectId === PACKAGE_OBJECT_ID
  );

  console.log("collectionForWallet", collectionsForWallet);
  if (collectionsForWallet.length) {
    const collection = collectionsForWallet[0];
    const mintNftTransaction = NftClient.buildMintNftTx({
      mintAuthority: collection.mintAuthorityId,
      moduleName: "suimarines",
      name: "My First NFT",
      description: "My First NFT",
      packageObjectId: collection.packageObjectId,
      url: "https://i.imgur.com/D5yhcTC.png",
      attributes: {
        Rarity: "Ultra-rare",
        Author: "OriginByte",
      },
      launchpadId: LAUNCHPAD_ID,
    });
    // console.log('signer', keypair.getPublicKey().toSuiAddress());
    const mintResult = await signer.executeMoveCall(mintNftTransaction);
    console.log("mintResult", mintResult);
  }
};
```

More examples could be found [there](https://github.com/Origin-Byte/originbyte-js-sdk/tree/main/examples).

## Tests

See the `__tests__` directory.
We deploy `__tests__/assets/testract` contract to the local validator.
It is used to set resources up which would otherwise be beyond the scope of the test suite.

The `__tests__/assets/.tmp` directory

- contains the localnet validator network;
- `originmate` dependency;
- `ntf-protocol` dependency.

Start the localnet validator network with `$ ./bin/start-localnet.sh`.
Then, in a separate terminal, run the test suite with `$ ./bin/test.sh`.

## Useful Links

- [Website](https://originbyte.io)
- [Protocol Source Code](https://github.com/Origin-Byte/nft-protocol)
