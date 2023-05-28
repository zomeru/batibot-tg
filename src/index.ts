import express from 'express';
import bodyParser from 'body-parser';
import dotenv from 'dotenv';
import axios from 'axios';
import morgan from 'morgan';

import initWebRoute from './routes/web.route';
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
  const response = await axios.get(
    `${TELEGRAM_API}/setWebhook?url=${WEBHOOK_URL}`
  );
  console.log(response.data);
};

// init web routes
initWebRoute(app);

app.listen(PORT, async () => {
  await init();
  console.log(`Server is running on ${SERVER_URL}`);
});

export default app;
