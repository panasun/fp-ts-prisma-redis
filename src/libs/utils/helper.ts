import * as E from 'fp-ts/Either';
import * as TE from 'fp-ts/TaskEither';

/* eslint-disable no-unused-vars */
export const isEmpty = (obj: any) =>
  obj !== 0 &&
  obj !== false &&
  [Object, Array].includes((obj || {}).constructor) &&
  !Object.entries(obj || {}).length;

export const getOrElse = async <T>(data: TE.TaskEither<Error, T>) =>
  E.getOrElse((e) => e)(await data()) as T;
export const getOrElseW = async <A, T>(data: TE.TaskEither<A, T>) =>
  E.getOrElse((e) => e)(await data()) as T | A;
