import { NftClient } from '../src';
import { LAUNCHPAD_SLOT_ID, PACKAGE_OBJECT_ID, signer } from './common';

const enableSales = async () => {
  const mintNftTransaction = NftClient.buildEnableSales({
    packageObjectId: PACKAGE_OBJECT_ID,
    slotId: LAUNCHPAD_SLOT_ID,
  });

  const enableSalesResult = await signer.executeMoveCall(mintNftTransaction);
  console.log('enableSalesResult', JSON.stringify(enableSalesResult));
};

enableSales();
