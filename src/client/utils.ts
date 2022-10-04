import { GetObjectDataResponse } from '@mysten/sui.js';

export const isObjectExists = (o: GetObjectDataResponse) => o.status === 'Exists';
