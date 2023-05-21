import { env } from 'config/env';
import * as TE from 'fp-ts/TaskEither';
import { GraphQLClient } from 'graphql-request';
import { log } from 'libs/log';

const client = new GraphQLClient(env.API_GATEWAY_URL, {
  headers: {
    x_service_account_key: env.SERVICE_ACCOUNT_KEY,
  },
});

export const gqlRequest = (query, variables) =>
  TE.tryCatch(
    () => client.request(query, variables),
    (e) => log.error(String(e)),
  );
