import { NftClient } from "../src";
import { client, PACKAGE_OBJECT_ID, signer } from "./common";

const claimCertificate = async () => {
  const address = await signer.getAddress();

  const certificates = (
    await client.getNftCertificatesForAddress(`0x${address}`)
  ).filter((_) => _.data.packageObjectId === PACKAGE_OBJECT_ID);
  console.log("certificate", certificates);
  if (certificates.length) {
    const nftForCert = certificates[0].data.nftId;
    const nfts = await client.getNftsById({ objectIds: [nftForCert] });
    if (nfts.length) {
      const nft = nfts[0];
      console.log("nft", nft);
      const claimCertificateTx = NftClient.buildClaimNftCertificate({
        collectionType: `${nft.data.packageObjectId}::${nft.data.packageModule}::${nft.data.packageModuleClassName}`,
        packageObjectId: nft.data.packageObjectId,
        launchpadId: certificates[0].data.launchpadId,
        nftId: nft.data.id,
        recepient: `0x${address}`,
        nftType: nft.data.nftType,
        certificateId: certificates[0].data.id,
      });
      console.log("certificate", certificates, claimCertificateTx);
      const claimCertificateResult = await signer.executeMoveCall(
        claimCertificateTx
      );
      console.log("claimCertificateResult", claimCertificateResult);
    }
  }
};

claimCertificate();
