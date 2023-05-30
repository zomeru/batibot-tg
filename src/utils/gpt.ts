import { openai } from '../configs';
import {
  getUser,
  createUser,
  getUserRecentPrompts,
  saveUserPrompt,
} from '../services/supabase';
import {
  chatCompletionSystemContent,
  promptTypeGPTSystemContent,
  defaultGPTResponse,
  imageGenerationPrompt,
} from '../constants/gpt';
import type {
  User,
  DeterminePromptType,
  GPTCreateChatCompletionParams,
} from '../types';

const gptCreateChatCompletion = async ({
  userPrompt,
  systemContent,
}: GPTCreateChatCompletionParams) => {
  const response = await openai.createChatCompletion({
    model: 'gpt-3.5-turbo',
    messages: [
      {
        role: 'system',
        content: systemContent,
      },
      {
        role: 'user',
        content: userPrompt,
      },
    ],
  });

  if (
    response.data.choices.length <= 0 ||
    !response.data.choices[0]?.message?.content
  ) {
    return null;
  }

  return response?.data?.choices[0]?.message?.content;
};

export const determineUserPrompt = async (
  prompt: string
): Promise<DeterminePromptType> => {
  const userPromptType = await gptCreateChatCompletion({
    userPrompt: prompt,
    systemContent: promptTypeGPTSystemContent,
  });

  if (!userPromptType) return 'SYSTEM_ERROR';

  return userPromptType as DeterminePromptType;
};

export const findOrCreateUserAndGetRecentMessages = async (
  user: User,
  numberOfRecentMessages?: number
) => {
  // Check if user exists in database
  const [currentUser] = await getUser(user.id);

  // If user doesn't exist, create user
  if (!currentUser) await createUser(user);

  // Get 20 most recent messages and assistant_response from user
  const [recentMessages] = await getUserRecentPrompts(
    user.id,
    numberOfRecentMessages
  );

  // Format recent messages
  let formattedMessages = '';
  if (
    recentMessages &&
    Array.isArray(recentMessages) &&
    recentMessages.length > 0
  ) {
    // 1.
    // User prompt: "What is your name?"
    // Assistant response: "My name is John Doe."
    formattedMessages = recentMessages
      .map((recent, index) => {
        return `${index + 1}.\n User prompt: "${
          recent.message
        }"\n Assistant response: "${recent.assistant_response}"\n`;
      })
      .join('\n');
  }

  return formattedMessages;
};

export const chatCompletion = async (user: User, prompt: string) => {
  const formattedMessages = await findOrCreateUserAndGetRecentMessages(
    user,
    20
  );

  const gptResponse = await gptCreateChatCompletion({
    userPrompt: prompt,
    systemContent: chatCompletionSystemContent(user, formattedMessages),
  });

  await saveUserPrompt(
    user.id,
    prompt,
    gptResponse ? gptResponse : defaultGPTResponse
  );

  if (!gptResponse) {
    return defaultGPTResponse;
  }

  return gptResponse;
};

export const imageGeneration = async (user: User, prompt: string) => {
  try {
    const recentMessages = await findOrCreateUserAndGetRecentMessages(user, 1);

    const response = await openai.createImage({
      prompt: imageGenerationPrompt(prompt, recentMessages),
      n: 1,
      size: '256x256',
      response_format: 'url',
    });

    const imageUrl = response.data.data[0]?.url;
    await saveUserPrompt(
      user.id,
      prompt,
      imageUrl ? imageUrl : defaultGPTResponse
    );

    if (!imageUrl) {
      return defaultGPTResponse;
    }

    return imageUrl;
  } catch (error: any) {
    if (error.response) {
      console.log('error generating image data', error.response.data);
    } else {
      console.log('error generating image message', error.message);
    }

    return defaultGPTResponse;
  }
};
