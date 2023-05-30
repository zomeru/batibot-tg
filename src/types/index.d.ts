export type User = {
  id: number;
  username: string;
  firstName?: string;
  lastName?: string;
};

export type DeterminePromptType =
  | 'TEXT_GENERATION'
  | 'IMAGE_GENERATION'
  | 'SYSTEM_ERROR';

export type GPTCreateChatCompletionParams = {
  userPrompt: string;
  systemContent: string;
};
