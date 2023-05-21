import {
  createAccountHandler,
  getAccountHandler,
  getAccountsHandler,
  getApproveAccountHandler,
  getApproveAccountsHandler,
  updateAccountHandler,
} from 'services/account';

export const AppRoutes = [
  {
    path: '/account/createAccount',
    method: 'post',
    action: createAccountHandler,
  },
  {
    path: '/account/updateAccount',
    method: 'post',
    action: updateAccountHandler,
  },
  {
    path: '/account/getAccount',
    method: 'post',
    action: getAccountHandler,
  },
  {
    path: '/account/getAccounts',
    method: 'post',
    action: getAccountsHandler,
  },
  {
    path: '/account/getApproveAccount',
    method: 'post',
    action: getApproveAccountHandler,
  },
  {
    path: '/account/getApproveAccounts',
    method: 'post',
    action: getApproveAccountsHandler,
  },
];
