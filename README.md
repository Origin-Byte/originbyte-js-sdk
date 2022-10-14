# OriginByte JS SDK

[![npm version](https://badge.fury.io/js/@originbyte%2Fjs-sdk.svg)](https://badge.fury.io/js/@originbyte%2Fjs-sdk)
[![License](https://img.shields.io/badge/License-Apache_2.0-blue.svg)](https://opensource.org/licenses/Apache-2.0)

Javascipt/Typescript SDK to work with Origin Byte NFT protocol.

Please note: The project is in active development stage, some methods might change dramatically.

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
However, under the hood the `NftClient` data fetcher use idea of parsers approach: you can create your own parser and fetch any data from the blockchain - by user wallet address or directly by Object ID.

The parser, by itself, is an object which implements interface: 

```typescript

export interface SuiObjectParser<RpcResponse, DataModel> {
  parser: (
    typedData: RpcResponse,
    suiObject: SuiObject,
    rpcResponse: GetObjectDataResponse
  ) => DataModel | undefined // Parsing function, which takes RPC response and transform it into the plain JS object.
  regex: RegExp // Regular expression to filter objects
}

```
Example of the parser:

```typescript
  export const CollectionParser: SuiObjectParser<NftCollectionRpcResponse, NftCollection> = {
    parser: (data, suiData, _) => ({
      name: data.name,
      description: data.description,
      creators: data.creators,
      symbol: data.symbol,
      currentSupply: data.cap.fields.supply.fields.current,
      totalSupply: data.cap.fields.supply.fields.cap,
      receiver: data.receiver,
      type: suiData.data.dataType,
      id: suiData.reference.objectId,
      tags: data.tags.fields.enumerations.fields.contents.map((__) => __.fields.value),
      rawResponse: _,
    }),
    regex: /0x[a-f0-9]{40}::collection::Collection<0x[a-f0-9]{40}::[a-zA-Z]{1,}::[a-zA-Z]{1,}, 0x[a-f0-9]{40}::std_collection::StdMeta, 0x[a-f0-9]{40}::cap::[a-zA-Z]{1,}>/,
  };

```

Beside of that, the SDK provide predefined parsers and methods to interact with Origin Byte's NFT protocol. Next methods are available:

- getCollectionsById
- getCollectionsForAddress
- getNftsById
- getNftsForAddress

Take a look at [Examples](#examples) for more details.


### Examples

#### Fetch Onchain Data: Collection and NFTs

```typescript
import { NftClient } from '@originbyte/js-sdk';

const getNfts = async () => {
  const client = new NftClient();
  const collection = await client.getCollectionsById({ objectIds: ['0xfc18b65338d4bb906018e5f73b586a57b777d46d'] });
  const nfts = await client.getNftsForAddress('0x0ec841965c95866d38fa7bcd09047f4e0dfa0ed9');
  console.log('nfts', collection, nfts);
};

getNfts();
```

#### Mint new NFT

```typescript
  // TBD
```

More examples could be found [there](https://github.com/Origin-Byte/originbyte-js-sdk/tree/main/examples).

## Useful Links

- [Website](https://originbyte.io)
- [Protocol Source Code](https://github.com/Origin-Byte/nft-protocol)