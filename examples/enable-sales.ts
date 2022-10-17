import {
  client, PACKAGE_OBJECT_ID, signer, keypair, AUTHORITY_ID, LAUNCHPAD_ID,
} from './common';

const enableSales = async () => {
  const mintNftTransaction = client.buildEnableSales({
    packageObjectId: PACKAGE_OBJECT_ID,
    launchpadId: LAUNCHPAD_ID,
    collectionType: `${PACKAGE_OBJECT_ID}::suimarines::SUIMARINES`,
  });
  const enableSalesResult = await signer.executeMoveCall(mintNftTransaction);
  console.log('enableSalesResult', enableSalesResult);
};

enableSales();
