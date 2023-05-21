import { env } from 'config/env';
import { hashKey } from 'libs/utils';

const hashKeyPrefix = (key: string) =>
  hashKey(`${env.CACHE_KEY_PREFIX}_${key}`);

export const cacheKey = {
  activeAccounts: () => hashKeyPrefix('activeAccounts'),
  account: (uuid: string) => hashKeyPrefix(`account_${uuid}`),
  approveAccounts: () => hashKeyPrefix('approveAccounts'),
  getAccountMemos: (userId: string) =>
    hashKeyPrefix(`getAccountMemos_${userId}`),
};
