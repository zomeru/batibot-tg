import { Request, Response } from 'express';

import { TELEGRAM_API } from '../configs/environment';
import { chatCompletion, useFetch } from '../utils';

export const webhook = async (req: Request, res: Response) => {
  const userId = req.body?.message?.from?.id;
  const message = req.body?.message?.text;

  console.log({
    body: req.body,
  });

  const sendMessageURL = `${TELEGRAM_API}/sendMessage`;

  if (message) {
    const gptResponse = await chatCompletion(
      {
        id: userId,
        username: req.body?.message?.from?.username,
        firstName: req.body?.message?.from?.first_name,
        lastName: req.body?.message?.from?.last_name,
      },
      message
    );

    await useFetch(sendMessageURL, {
      method: 'POST',
      body: {
        chat_id: userId,
        text: gptResponse,
      },
    });
  } else {
    await useFetch(sendMessageURL, {
      method: 'POST',
      body: {
        chat_id: userId,
        text: "We're sorry, but we don't support stickers, images, or other media yet.",
      },
    });
  }

  return res.send();
};
