import sha256 from 'crypto-js/sha256';
import ShortUniqueId from 'short-unique-id';

export const hashKey = (key: string) => sha256(key).toString();

export const UUID = (length: number) =>
  String(new ShortUniqueId().stamp(length));
