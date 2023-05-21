import { env } from 'config/env';
import * as E from 'fp-ts/Either';
import { pipe } from 'fp-ts/lib/function';
import * as O from 'fp-ts/Option';
import * as TE from 'fp-ts/TaskEither';
import { Redis } from 'ioredis';
import { log } from 'libs/log';
import { isEmpty } from 'libs/utils';

import { cacheKey } from './cacheKey';
import { message } from './message';

export const getCache = <T>(redis: Redis, args: { key: string }) =>
  pipe(
    TE.tryCatch(
      () => redis.get(args.key),
      () => log.info(message.failedToGetCache),
    ),
    TE.chain((data) =>
      pipe(
        data,
        E.fromPredicate(
          () => !isEmpty(data),
          () => log.info(message.cacheNotFound),
        ),
        E.map((r) =>
          E.tryCatch(
            () => JSON.parse(String(r)) as T,
            () => log.info(message.failedToParseCache),
          ),
        ),
        E.flatten,
        E.foldW(
          (e) => TE.left(e),
          (r) => TE.right(r),
        ),
      ),
    ),
  );

export const setCache = <T>(
  redis: Redis,
  args: { data: TE.TaskEither<Error, T>; key: string; expire?: number },
): TE.TaskEither<Error, T> =>
  pipe(
    args.data,
    TE.bindTo('data'),
    TE.bind('cache', ({ data }) =>
      TE.tryCatch(
        () =>
          redis.set(
            args.key,
            JSON.stringify(data),
            'EX',
            args.expire ?? env.DEFAULT_CACHE_EXPIRATION,
          ),
        () => log.info(message.failedToSetCache),
      ),
    ),
    TE.map(({ data }) => data),
  );

export const delCache = (
  redis: Redis,
  args: { key: string },
): TE.TaskEither<Error, string> =>
  pipe(
    E.tryCatch(
      () => redis.del(args.key),
      () => log.info(message.failedToDeleteCache),
    ),
    E.map(() => args.key),
    TE.fromEither,
  );

export const deleteCache = <T>(
  redis: Redis | null,
  args: {
    key: string;
    data: T;
  },
  enabledCache = true,
) =>
  pipe(
    enabledCache,
    O.fromPredicate(
      (isEnabledCache) => isEnabledCache === true && !isEmpty(redis),
    ),
    O.fold(
      () => TE.right(args.data),
      () =>
        pipe(
          TE.tryCatch(
            () => redis.del(args.key),
            () => log.info(message.failedToDeleteCache),
          ),
          TE.map(() => args.data),
        ),
    ),
  );

export const deletesCache = <T>(
  redis: Redis | null,
  args: {
    keys: string[];
    data: T;
  },
  enabledCache = true,
) =>
  pipe(
    TE.sequenceArray(
      args.keys.map((key) =>
        deleteCache(redis, { key, data: args.data }, enabledCache),
      ),
    ),
    TE.map(() => args.data),
  );

export const getSetCache = <T>(
  redis: Redis | null,
  args: { data: TE.TaskEither<Error, T>; key: string; expire?: number },
  enabledCache = true,
) =>
  pipe(
    enabledCache,
    O.fromPredicate(
      (isEnabledCache) => isEnabledCache === true && !isEmpty(redis),
    ),
    O.foldW(
      () => args.data,
      () =>
        pipe(
          getCache(redis, { key: args.key }),
          TE.map((data) => data as T),
          TE.orElse(() =>
            setCache(redis, {
              data: args.data,
              key: args.key,
              expire: args.expire,
            }),
          ),
        ),
    ),
  );

export const cache = {
  get: getCache,
  set: setCache,
  del: delCache,
  delete: deleteCache,
  deletes: deletesCache,
  getSet: getSetCache,
  key: cacheKey,
};
