import compression from 'compression';
import { env } from 'config/env';
import cors from 'cors';
import express, { Application, Request, Response } from 'express';
import { log } from 'libs/log';

import { AppRoutes } from './routes';

const app: Application = express();

app.use(compression());
app.use(cors());
app.use(express.json());
app.get('/management/health', (req: Request, res: Response) => res.send('Ok'));

AppRoutes.forEach((route) => {
  app[route.method](route.path, (request: Request, response: Response) =>
    route.action(request, response)
  );
});
app.listen(env.PORT, () => {
  log.info(`Server start at port ${env.PORT}`);
});
