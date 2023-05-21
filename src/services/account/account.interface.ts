import * as t from 'io-ts';
import * as td from 'io-ts-types';
import { optional } from 'io-ts-extra';
import {
  AccountAuthMethodEnum,
  AccountStatusEnum,
} from '../../../prisma/client';

export enum SortFieldEnum {
  id = 'id',
  accountId = 'accountId',
  firstName = 'firstName',
  lastName = 'lastName',
  createdAt = 'createdAt',
  updatedAt = 'updatedAt',
}

export enum SortOptionsEnum {
  desc = 'desc',
  asc = 'asc',
}

export const UpdateAccountCodec = t.partial({
  uuid: t.string,
  accountId: t.string,
  status: t.keyof(AccountStatusEnum),
  userName: t.string,
  email: t.string,
  firstName: t.string,
  lastName: t.string,
});

export type IUpdateAccount = t.TypeOf<typeof UpdateAccountCodec>;

export const CreateAccountCodec = t.exact(
  t.intersection([
    t.partial({
      email: t.string,
      firstName: t.string,
      lastName: t.string,
    }),
    t.type({
      uuid: t.string,
      userName: t.string,
      authMethod: t.keyof(AccountAuthMethodEnum),
    }),
  ]),
);

export interface ICreateAccount extends t.TypeOf<typeof CreateAccountCodec> {
  accountId: string;
}
export const GetAccountCodec = t.exact(
  t.partial({
    uuid: t.string,
    accountId: t.string,
    userName: t.string,
  }),
);

export type IGetAccount = t.TypeOf<typeof GetAccountCodec>;

export const GetAccountByAdminCodec = t.exact(
  t.type({
    uuid: t.string,
    accountId: t.string,
  }),
);

export type IGetAccountByAdmin = t.TypeOf<typeof GetAccountByAdminCodec>;

export const ApproveAccountCodec = t.exact(
  t.type({
    uuid: t.string,
    accountId: t.string,
    adminPincode: t.string,
    approvedBy: t.string,
  }),
);

export type IApproveAccount = t.TypeOf<typeof ApproveAccountCodec>;

export const GetAccountAdminCodec = t.exact(
  t.type({
    uuid: t.string,
  }),
);

export type IGetAccountAdmin = t.TypeOf<typeof GetAccountAdminCodec>;

export const GetAccountsCodec = t.exact(
  t.intersection([
    t.partial({
      startDate: t.string,
      endDate: t.string,
      status: t.array(t.keyof(AccountStatusEnum)),
      limit: t.number,
      offset: t.number,
      sortField: t.keyof(SortFieldEnum),
      sortOption: t.keyof(SortOptionsEnum),
    }),
    t.type({
      uuid: t.string,
    }),
  ]),
);
export type IGetAccounts = t.TypeOf<typeof GetAccountsCodec>;
