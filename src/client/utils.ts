import { GetObjectDataResponse, ObjectOwner } from '@mysten/sui.js';

export const isObjectExists = (o: GetObjectDataResponse) => o.status === 'Exists';

export const parseObjectOwner = (owner: ObjectOwner) => {
  let ownerAddress = '';

  if (typeof owner === 'object') {
    if ('AddressOwner' in owner) {
      ownerAddress = owner.AddressOwner;
    }
    if ('ObjectOwner' in owner) {
      ownerAddress = owner.ObjectOwner;
    }
  }
  return ownerAddress;
};
