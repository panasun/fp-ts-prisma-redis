import { createWallet } from './wallet';
import { getOrElse, isEmpty } from 'libs/utils';

describe('Wallet', () => {
  test('createWallet', async () => {
    const result = await getOrElse(
      createWallet({ accountId: 'TEST_ACCOUNT_ID' }),
    );
    expect(!isEmpty(result.walletId)).toEqual(true);
  });
});
