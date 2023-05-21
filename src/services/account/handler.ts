import { message } from 'config/message';
import { Request, Response } from 'express';
import { pipe } from 'fp-ts/lib/function';
import * as TE from 'fp-ts/TaskEither';
import { log } from 'libs/log';
import { getOrElseW, makeError, makeJson, UUID } from 'libs/utils';

import {
  createAccount,
  getAccount,
  getAccounts,
  getApproveAccount,
  getApproveAccounts,
  updateAccount,
} from './account';
import {
  CreateAccountCodec,
  GetAccountCodec,
  GetAccountsCodec,
  UpdateAccountCodec,
} from './account.interface';

export const createAccountHandler = (req: Request, res: Response) =>
  pipe(
    pipe(
      TE.fromEither(CreateAccountCodec.decode(req.body)),
      TE.mapLeft(() => log.error(message.failedToDecodeCreateAccountCodec)),
    ),
    TE.chain((args) =>
      createAccount({
        accountId: `${UUID(18).toUpperCase()}`,
        userName: args.userName,
        ...args,
      }),
    ),
    TE.chain((result) => makeJson(res, result)),
    TE.orElse((e) => makeError(res, e)),
    getOrElseW,
  );

export const updateAccountHandler = (req: Request, res: Response) =>
  pipe(
    pipe(
      TE.fromEither(UpdateAccountCodec.decode(req.body)),
      TE.mapLeft(() => log.error(message.failedToDecodeUpdateAccountCodec)),
    ),
    TE.chain((args) => updateAccount(args)),
    TE.chain((result) => makeJson(res, result)),
    TE.orElse((e) => makeError(res, e)),
    getOrElseW,
  );

export const getAccountHandler = (req: Request, res: Response) =>
  pipe(
    pipe(
      TE.fromEither(GetAccountCodec.decode(req.body)),
      TE.mapLeft(() => log.error(message.failedToDecodeGetAccountCodec)),
    ),
    TE.chain((args) => getAccount(args)),
    TE.chain((result) => makeJson(res, result)),
    TE.orElse((e) => makeError(res, e)),
    getOrElseW,
  );

export const getAccountsHandler = (req: Request, res: Response) =>
  pipe(
    pipe(
      TE.fromEither(GetAccountsCodec.decode(req.body)),
      TE.mapLeft((e) =>
        log.error(message.failedToDecodeGetAccountsCodec, JSON.stringify(e)),
      ),
    ),
    TE.chain((args) => getAccounts(args)),
    TE.chain((result) => makeJson(res, result)),
    TE.orElse((e) => makeError(res, e)),
    getOrElseW,
  );

export const getApproveAccountHandler = (req: Request, res: Response) =>
  pipe(
    pipe(
      TE.fromEither(GetAccountCodec.decode(req.body)),
      TE.mapLeft(() => log.error(message.failedToDecodeGetAccountCodec)),
    ),
    TE.chain((args) => getApproveAccount(args)),
    TE.chain((result) => makeJson(res, result)),
    TE.orElse((e) => makeError(res, e)),
    getOrElseW,
  );

export const getApproveAccountsHandler = (req: Request, res: Response) =>
  pipe(
    TE.Do,
    TE.chain(() => getApproveAccounts()),
    TE.chain((result) => makeJson(res, result)),
    TE.orElse((e) => makeError(res, e)),
    getOrElseW,
  );
