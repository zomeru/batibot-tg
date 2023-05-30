import { Request, Response } from 'express';

import { TELEGRAM_API } from '../configs/environment';
import {
  chatCompletion,
  determineUserPrompt,
  imageGeneration,
  useFetch,
} from '../utils';
import { defaultGPTResponse } from '../constants/gpt';

const sendMessageURL = `${TELEGRAM_API}/sendMessage`;

const sendDefaultResponse = async (userId: number) => {
  await useFetch(sendMessageURL, {
    method: 'POST',
    body: {
      chat_id: userId,
      text: defaultGPTResponse,
    },
  });
};

export const webhook = async (req: Request, res: Response) => {
  const userId = req.body?.message?.from?.id;
  const message = req.body?.message?.text;

  // Send typing action to user
  await useFetch(`${TELEGRAM_API}/sendChatAction`, {
    method: 'POST',
    body: {
      chat_id: userId,
      action: 'typing',
    },
  });

  // If message is text, send a response from GPT-3
  if (message) {
    const userPromptType = await determineUserPrompt(message);
    console.log('userPromptType', userPromptType);

    const user = {
      id: userId,
      username: req.body?.message?.from?.username,
      firstName: req.body?.message?.from?.first_name,
      lastName: req.body?.message?.from?.last_name,
    };

    if (userPromptType === 'TEXT_GENERATION') {
      const gptResponse = await chatCompletion(user, message);

      await useFetch(sendMessageURL, {
        method: 'POST',
        body: {
          chat_id: userId,
          text: gptResponse,
        },
      });
    } else if (userPromptType === 'IMAGE_GENERATION') {
      const imageGPTResponse = await imageGeneration(user, message);

      if (imageGPTResponse !== defaultGPTResponse) {
        console.log('Image generation successful');
        await useFetch(`${TELEGRAM_API}/sendPhoto`, {
          method: 'POST',
          body: {
            chat_id: userId,
            photo: imageGPTResponse,
          },
        });
      } else {
        console.log('Image generation failed');
        await sendDefaultResponse(userId);
      }
    } else {
      // Something went wrong, send default response
      await sendDefaultResponse(userId);
    }
  } else {
    // If message is not text, send default response
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
