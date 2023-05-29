import express from 'express';
import bodyParser from 'body-parser';
import dotenv from 'dotenv';
import morgan from 'morgan';

import initWebRoute from './routes/web.route';
import { useFetch } from './utils';
import {
  TELEGRAM_API,
  WEBHOOK_URL,
  PORT,
  SERVER_URL,
} from './configs/environment';

dotenv.config();

const app = express();

app.use(morgan('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// init telegram webhook
const init = async () => {
  const data = await useFetch(`${TELEGRAM_API}/setWebhook?url=${WEBHOOK_URL}`, {
    method: 'GET',
  });
  console.log('webhook', data);
};

// init web routes
initWebRoute(app);

app.listen(PORT, async () => {
  await init();
  console.log(`Server is running on ${SERVER_URL}`);
});

export default app;
