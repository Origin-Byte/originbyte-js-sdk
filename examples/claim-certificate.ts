import { NftType } from '../src';
import {
  client, LAUNCHPAD_ID, PACKAGE_OBJECT_ID, signer,
} from './common';

const claimCertificate = async () => {
  const address = await signer.getAddress();

  const certificates = (await client.getNftCertificatesForAddress(`0x${address}`)).filter((_) => _.packageObjectId === PACKAGE_OBJECT_ID);
  console.log('certificate', certificates);
  if (certificates.length) {
    const nftForCert = certificates[0].nftId;
    const nfts = await client.getNftsById({ objectIds: [nftForCert] });
    if (nfts.length) {
      const nft = nfts[0];
      console.log('nft', nft);
      const claimCertificateTx = client.buildClaimNftCertificate({
        collectionType: `${nft.data.packageObjectId}::${nft.data.packageModule}::${nft.data.packageModuleClassName}`,
        packageObjectId: nft.data.packageObjectId,
        marketId: certificates[0].marketId,
        nftId: nft.data.id,
        recepient: `0x${address}`,
        nftType: nft.data.nftType,
        certificateId: certificates[0].id,
      });
      console.log('certificate', certificates, claimCertificateTx);
      const claimCertificateResult = await signer.executeMoveCall(claimCertificateTx);
      console.log('claimCertificateResult', claimCertificateResult);
    }
  }
};

claimCertificate();
