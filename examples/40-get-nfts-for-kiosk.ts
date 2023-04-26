import { KioskReadClient } from "../src/client/kiosk/KioskReadClient";
import { kioskClient, user } from "./common";

const getNftForKiosk = async () => {
    const nfts = await kioskClient.getAllNftKioskAssociations(user);
    console.log(nfts);
}

getNftForKiosk();