import { GetObjectDataResponse, ObjectOwner } from "@mysten/sui.js";

export const isObjectExists = (o: GetObjectDataResponse) =>
  o.status === "Exists";

export const parseObjectOwner = (
  owner: ObjectOwner
): "shared" | "immutable" | string => {
  if (typeof owner === "object") {
    if ("AddressOwner" in owner) {
      return owner.AddressOwner;
    }
    if ("ObjectOwner" in owner) {
      return owner.ObjectOwner;
    }
    if ("Shared" in owner) {
      return "shared";
    }
    if ("Immutable" in owner) {
      return "immutable";
    }
  }

  throw new Error("Unexpected owner type");
};
