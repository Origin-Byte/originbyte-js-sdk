import { client, kioskClient, user } from "./common";

export const getKiosks = async (): Promise<void> => {
  const kiosks = (await kioskClient.getWalletKiosks(user)) ?? [];
  console.log("kiosk:", kiosks);

  kiosks.forEach(async (kiosk) => {
    const dynamicFieldsOfKiosk = await client.getDynamicFields(kiosk.id.id);
    console.log(`dynamicFieldsOfKiosk ${kiosk.id.id} `, dynamicFieldsOfKiosk);

    console.log(
      "kioskFields display",
      dynamicFieldsOfKiosk[0].data?.display,
      "kioskFields[0].data?.content",
      dynamicFieldsOfKiosk[0].data?.content
    );
  });
};

getKiosks();
