import { safeClient, user } from "./common";

export const fetchSafeAndOwnerCaps = async () => {
  const ownerCaps = await safeClient.fetchOwnerCapsIds(user);
  const safeIdsByOwnerCap = await Promise.all(
    ownerCaps.map(async (ownerCap) => safeClient.fetchOwnerCapSafeId(ownerCap))
  );

  console.log("ownerCaps: ", ownerCaps);
  console.log("safeIdsByOwnerCap: ", safeIdsByOwnerCap);

  const safe = safeIdsByOwnerCap[0];
  const safeState = await safeClient.fetchSafe(safe);
  console.log("safeState: ", safeState);
};

fetchSafeAndOwnerCaps();
