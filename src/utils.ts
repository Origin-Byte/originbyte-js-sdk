export const strToByteArray = (str: string): number[] => {
  const utf8Encode = new TextEncoder();
  return Array.from(utf8Encode.encode(str).values());
};
