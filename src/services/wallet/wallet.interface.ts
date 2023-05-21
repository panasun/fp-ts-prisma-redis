import * as t from 'io-ts';

export const CreateWalletResponseCodec = t.type({
  createWallet: t.type({
    walletId: t.string,
  }),
});
