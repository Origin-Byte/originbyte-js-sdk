import { NftClient } from '../src';
import { LAUNCHPAD_ID, PACKAGE_OBJECT_ID, signer } from './common';

export const initLaunchpadSlot = async () => {
  const pubKey = await signer.getAddress();
  const transaction = NftClient.buildInitSlot({
    packageObjectId: PACKAGE_OBJECT_ID,
    slotAdmin: `0x${pubKey}`, // launchpad admin,
    receiver: `0x${pubKey}`, // launchpad receiver
    launchpad: LAUNCHPAD_ID,
  });
  const initLaunchpadSlotResult = await signer.executeMoveCall(transaction);
  console.log('initLaunchpadSlotResult', JSON.stringify(initLaunchpadSlotResult));
};

initLaunchpadSlot();
