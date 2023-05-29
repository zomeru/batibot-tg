import { Request, Response } from 'express';
import axios from 'axios';

import { TELEGRAM_API } from '../configs/environment';
import { chatCompletion } from '../utils/gpt';

export const webhook = async (req: Request, res: Response) => {
  const userId = req.body.message.from.id;
  const message = req.body.message.text;

  if (message) {
    const gptResponse = await chatCompletion(
      {
        id: userId,
        username: req.body.message.from.username,
        firstName: req.body.message.from.first_name,
        lastName: req.body.message.from.last_name,
      },
      message
    );

    await axios.post(`${TELEGRAM_API}/sendMessage`, {
      chat_id: userId,
      text: gptResponse,
    });
  } else {
    await axios.post(`${TELEGRAM_API}/sendMessage`, {
      chat_id: userId,
      text: "We're sorry, but we don't support stickers, images, or other media yet.",
    });
  }

  return res.send();
};
