import { message } from 'config/message';
import { pipe } from 'fp-ts/lib/function';
import * as TE from 'fp-ts/TaskEither';
import { gql } from 'graphql-request';
import { gqlRequest } from 'libs/gql';
import { log } from 'libs/log';

import { CreateWalletResponseCodec } from './wallet.interface';

const gqlCreateWallet = gql`
  mutation CreateWallet($accountId: String!) {
    createWallet(accountId: $accountId) {
      walletId
    }
  }
`;

export const createWallet = (args: { accountId: string }) =>
  pipe(
    gqlRequest(gqlCreateWallet, { accountId: args.accountId }),
    TE.chain((res) =>
      pipe(
        TE.fromEither(CreateWalletResponseCodec.decode(res)),
        TE.mapLeft(() =>
          log.error(message.failedToDecodeCreateWalletResponseCodec),
        ),
      ),
    ),
    TE.map((r) => r.createWallet),
  );
