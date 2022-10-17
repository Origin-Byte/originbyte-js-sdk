import { NftType } from '../src';
import {
  client, LAUNCHPAD_ID, PACKAGE_OBJECT_ID, signer,
} from './common';

const claimCertificate = async () => {
  const address = await signer.getAddress();

  const certificate = await client.getNftCertificatesForAddress(`0x${address}`);
  if (certificate.length) {
    const claimCertificateTx = client.buildClaimNftCertificate({
      collectionType: `${PACKAGE_OBJECT_ID}::suimarines::SUIMARINES`,
      packageObjectId: PACKAGE_OBJECT_ID,
      launchpadId: LAUNCHPAD_ID,
      nftId: certificate[0].nftId,
      recepient: `0x${address}`,
      nftType: NftType.UNIQUE,
      certificateId: certificate[0].id,
    });
    console.log('certificate', certificate, claimCertificateTx);
    const claimCertificateResult = await signer.executeMoveCall(claimCertificateTx);
    console.log('claimCertificateResult', claimCertificateResult);
  }
};

claimCertificate();
