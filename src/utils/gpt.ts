import { supabase, openai } from '../configs';

type User = {
  id: number;
  username: string;
  firstName?: string;
  lastName?: string;
};

export const chatCompletion = async (user: User, prompt: string) => {
  // Check if user exists in database
  const { data: currentUser } = await supabase
    .from('users')
    .select('tg_user_id')
    .eq('tg_user_id', user.id)
    .single();

  // If user doesn't exist, create user
  if (!currentUser) {
    await supabase.from('users').insert([
      {
        tg_user_id: user.id,
        username: user.username,
        first_name: user.firstName || '',
        last_name: user.lastName || '',
      },
    ]);
  }

  // Get 10 most recent messages and assistant_response from user
  const { data: messages } = await supabase
    .from('messages')
    .select('message,assistant_response')
    .eq('user', user.id)
    .order('created_at', { ascending: false })
    .limit(10);

  // Format recent messages
  let formattedMessages = '';
  if (messages && messages.length > 0) {
    // 1.
    // User prompt: "What is your name?"
    // Assistant response: "My name is John Doe."
    formattedMessages = messages
      .map((recent, index) => {
        return `${index + 1}.\n User prompt: "${
          recent.message
        }"\n Assistant response: "${recent.assistant_response}"\n`;
      })
      .join('\n');
  }

  const response = await openai.createChatCompletion({
    model: 'gpt-3.5-turbo',
    messages: [
      {
        role: 'system',
        content: `Respond to the user's messages as best, accurately, convincingly, and as human-like as you can, keep it short and straight to the point. Maximum of 5 sentences. You can also add bullets and numbers in a list in addition to the 5 sentences, but add then only if the user asks for it. You can try to call their name sometimes if you want, here's the user's name: ${
          user.firstName || user.username
        }.${
          formattedMessages &&
          ` Also, you can try to make your answer based on the user's recent messages and your response (as an assistant) to those recent messages (conversation history), if they did not get the answer they want and they ask again. Here are the 10 recent messages of the user, the most recent is always number 1:\n\n${formattedMessages}`
        }`,
      },
      { role: 'user', content: prompt },
    ],
  });

  const defaultResponse =
    'Sorry, something went wrong on our end. Please try again.';

  if (
    response.data.choices.length <= 0 ||
    !response.data.choices[0]?.message?.content
  ) {
    // Save message to database
    await supabase.from('messages').insert([
      {
        user: user.id,
        message: prompt,
        assistant_response: defaultResponse,
      },
    ]);
    return defaultResponse;
  }

  const gptResponse = response.data.choices[0].message.content;

  // Save message to database
  await supabase.from('messages').insert([
    {
      user: user.id,
      message: prompt,
      assistant_response: gptResponse,
    },
  ]);
  return gptResponse;
};
