import {
  client, LAUNCHPAD_ID, signer,
} from './common';

const enableSales = async () => {
  const markets = await client.getMarketsByParams({ objectIds: [LAUNCHPAD_ID] });
  if (markets[0]) {
    const market = markets[0];
    if (market.live) {
      throw new Error('Market is already live');
    }
    console.log('Market:', market);
    const mintNftTransaction = client.buildEnableSales({
      packageObjectId: market.packageObjectId,
      marketId: market.id,
      collectionType: `${market.packageObjectId}::${market.packageModule}::${market.packageModuleClassName}`,
    });
    const enableSalesResult = await signer.executeMoveCall(mintNftTransaction);
    console.log('enableSalesResult', enableSalesResult);
  }
};

enableSales();
