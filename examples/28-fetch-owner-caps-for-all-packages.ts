import { SafeFullClient } from "../src";
import { user, provider } from "./common";

export const fetchSafeAndOwnerCaps = async () => {
  const SAFE_CLIENT = SafeFullClient.fromProvider(provider);

  const allObjects = await SAFE_CLIENT.client.getObjects(user);
  const ownerCapObjects = allObjects.filter((obj) =>
    obj.type.endsWith("::OwnerCap")
  );

  console.log("ownerCapObjects: ", ownerCapObjects);

  const ownerCaps2Objects = await SAFE_CLIENT.fetchAllOwnerCapsByUser(user);
  console.log("ownerCaps2Objects: ", ownerCaps2Objects);
};

fetchSafeAndOwnerCaps();
