import { env } from 'config/env';
import { message } from 'config/message';
import { pipe } from 'fp-ts/lib/function';
import * as TE from 'fp-ts/TaskEither';
import { omit } from 'fp-ts-std/Record';
import { cache, redis } from 'libs/cache';
import { log } from 'libs/log';
import { prisma } from 'libs/prisma';
import { isEmpty } from 'libs/utils';
import { createWallet } from 'services/wallet';

import { Account, AccountStatusEnum } from '../../../prisma/client';
import {
  ICreateAccount,
  IGetAccount,
  IGetAccounts,
  IUpdateAccount,
} from './account.interface';

export const createAccount = (args: ICreateAccount) =>
  pipe(
    TE.Do,
    TE.bind('wallet', () => createWallet({ accountId: args.accountId })),
    TE.bind('account', ({ wallet }) =>
      TE.tryCatch(
        () =>
          prisma.account.create({
            data: {
              ...omit(['email', 'firstName', 'lastName', 'userName'])(args),
              userName: args?.userName.trim()?.toLowerCase(),
              email: args?.email?.trim()?.toLowerCase(),
              firstName: args?.firstName?.trim(),
              lastName: args?.lastName?.trim(),
              walletId: wallet.walletId,
            },
          }),
        (e) => log.error(message.failedToCreateAccount, String(e)),
      ),
    ),
    TE.chain((data) =>
      cache.deletes(redis, {
        data,
        keys: [cache.key.activeAccounts()],
      }),
    ),
    TE.map(({ account }) => account),
  );

export const updateAccount = (args: IUpdateAccount) =>
  pipe(
    getAccount(
      !isEmpty(args?.uuid)
        ? { uuid: args.uuid }
        : { accountId: args.accountId },
    ),
    TE.bindTo('account'),
    TE.chain(({ account }) =>
      TE.tryCatch(
        () =>
          prisma.account.update({
            where: !isEmpty(args.accountId)
              ? { accountId: args.accountId }
              : { uuid: args.uuid },
            data: {
              email: args?.email?.toLowerCase()?.trim() ?? account.email,
              firstName:
                args?.firstName?.toLowerCase()?.trim() ?? account.firstName,
              lastName:
                args?.lastName?.toLowerCase()?.trim() ?? account.lastName,
            },
          }),
        (e) => log.error(message.failedToUpdateAccount, String(e)),
      ),
    ),
    TE.chain((data) =>
      cache.deletes(redis, {
        keys: [
          cache.key.account(data.uuid),
          cache.key.account(data.accountId),
          cache.key.activeAccounts(),
        ],
        data,
      }),
    ),
  );

export const getAccount = (args: IGetAccount) =>
  pipe(
    TE.right(
      args?.accountId !== env.EXCHANGE_ACCOUNT_ID
        ? TE.tryCatch(
          () =>
            prisma.account.findUniqueOrThrow({
              where: !isEmpty(args?.accountId)
                ? { accountId: args.accountId }
                : !isEmpty(args?.uuid)
                  ? { uuid: args.uuid }
                  : !isEmpty(args?.userName)
                  ? { userName: args.userName?.trim() }
                  : undefined,
              }),
            () => log.error(message.failedToGetAccount),
          )
        : TE.right({
            id: 0,
            accountId: args.accountId,
            userName: args.accountId,
            uuid: args.accountId,
            firstName: 'EXCHANGE',
            lastName: 'ACCOUNT',
            status: AccountStatusEnum.APPROVE,
            email: env.EXCHANGE_EMAIL,
            walletId: env.EXCHANGE_WALLET_ID,
            createdAt: new Date(),
            updatedAt: new Date(),
          } as Account),
    ),
    TE.chain((data) =>
      cache.getSet(redis, {
        data,
        key: cache.key.account(args.uuid ?? args.accountId ?? args.userName),
      }),
    ),
  );

export const getAccounts = (args: IGetAccounts) =>
  pipe(
    TE.Do,
    TE.bind('accounts', () =>
      TE.tryCatch(
        () =>
          prisma.account.findMany({
            where: {
              AND: [
                {
                  createdAt: {
                    gte: new Date(args.startDate),
                    lte: new Date(args.endDate),
                  },
                },
                isEmpty(args?.status)
                  ? { status: undefined }
                  : {
                    OR: args?.status?.map((s) => ({ status: s })),
                  },
              ],
            },
            orderBy: {
              [args?.sortField ?? 'id']: args?.sortOption ?? 'desc',
            },
            take: args?.limit ?? 20,
            skip: args?.offset ?? 0,
          }),
        (e) => log.error(message.failedToGetAccounts, String(e)),
      ),
    ),
    TE.bind('total', () =>
      pipe(
        TE.tryCatch(
          () =>
            prisma.account.aggregate({
              where: {
                AND: [
                  {
                    createdAt: {
                      gte: new Date(args.startDate),
                      lte: new Date(args.endDate),
                    },
                  },
                  isEmpty(args?.status)
                    ? { status: undefined }
                    : {
                      OR: args?.status?.map((s) => ({ status: s })),
                    },
                ],
              },
              _count: { id: true },
            }),
          () => log.error(message.failedToGetAccountsCount),
        ),
        TE.map((r) => r._count.id),
      ),
    ),
  );

export const getApproveAccounts = () =>
  pipe(
    pipe(
      TE.tryCatch(
        () =>
          prisma.account.findMany({
            where: {
              status: AccountStatusEnum.APPROVE,
            },
            select: {
              accountId: true,
              walletId: true,
            },
          }),
        () => log.error(message.failedToGetApproveAccounts),
      ),
      TE.map((accounts) => ({ accounts })),
      TE.right,
    ),
    TE.chain((data) =>
      cache.getSet(redis, {
        data,
        key: cache.key.activeAccounts(),
      }),
    ),
  );

export const getApproveAccount = (args: IGetAccount) =>
  pipe(
    getAccount(args),
    TE.chain((account) =>
      account.status === AccountStatusEnum.APPROVE
        ? TE.right(account)
        : TE.left(log.error(message.accountIsNotApprove)),
    ),
  );
