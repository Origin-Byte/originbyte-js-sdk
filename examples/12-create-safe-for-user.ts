import { safeClient } from "./common";

export const createSafeForUser = async () => {
  const { safe, ownerCap, effects } = await safeClient.createSafeForSender();

  console.log("safe: ", JSON.stringify(safe));
  console.log("ownerCap: ", JSON.stringify(ownerCap));
  console.log("effects: ", effects);
};

createSafeForUser();
