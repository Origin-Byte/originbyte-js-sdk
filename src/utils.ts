export const strToByteArray = (str: string): number[] => {
  const utf8Encode = new TextEncoder();
  return Array.from(utf8Encode.encode(str).values());
};

// https://stackoverflow.com/a/10456644
export const splitBy = <T>(list: T[], chunkSize: number): T[][] => {
  const result: T[][] = [];
  for (let i = 0; i < list.length; i += chunkSize) {
    result.push(list.slice(i, i + chunkSize));
  }

  return result;
};

export const toMap = <T, K>(list: T[], keyFn: (el: T) => K): Map<K, T> => {
  return new Map<K, T>(list.map((elem) => [keyFn(elem), elem]));
};

export const groupBy = <T, K>(list: T[], keyFn: (el: T) => K): Map<K, T[]> => {
  return list.reduce((acc, elem) => {
    const group = acc.get(keyFn(elem)) || [];
    group.push(elem);
    acc.set(keyFn(elem), group);
    return acc;
  }, new Map<K, T[]>());
};

// TODO: Replace with lodash functions
export const uniq = <T>(list: T[]): T[] => Array.from(new Set(list).values());

export const uniqBy = <T, K>(list: T[], keyFn: (el: T) => K): T[] => {
  const m = toMap(list, keyFn);
  return Array.from(m.values());
};
