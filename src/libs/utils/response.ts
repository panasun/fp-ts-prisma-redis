import { Response } from 'express';
import * as TE from 'fp-ts/TaskEither';

export const makeJson = (res: Response, data: any) =>
  TE.right(res.json({ ...data }));
export const makeError = (res: Response, error: any) =>
  TE.left(res.status(500).json({ error: String(error) }));
