# OriginByte JS SDK

## Installation

```
yarn add @originbyte/js-sdk
```

or 

```
npm add  @originbyte/js-sdk
```

## Usage

### Fetch Onchain Data

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