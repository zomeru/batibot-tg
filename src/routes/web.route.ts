import express from 'express';
import { webhook } from '../controllers/bot.controller';

const router = express.Router();

const initWebRoute = (app: express.Application) => {
  const TG_BOT_TOKEN = process.env.TG_BOT_TOKEN;
  const URI = `/webhook/${TG_BOT_TOKEN}`;

  router.get('/', (_, res) => {
    res.send('Hello World!');
  });

  router.post(URI, webhook);

  return app.use('/', router);
};

export default initWebRoute;
