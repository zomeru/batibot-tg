import { supabase } from '../configs';
import type { User } from '../types';

export const getUser = async (userId: number) => {
  const { data, error } = await supabase
    .from('users')
    .select('tg_user_id')
    .eq('tg_user_id', userId)
    .single();

  return [data, error];
};

export const createUser = async (user: User) => {
  const { data, error } = await supabase.from('users').insert([
    {
      tg_user_id: user.id,
      username: user.username,
      first_name: user.firstName || '',
      last_name: user.lastName || '',
    },
  ]);

  return [data, error];
};

// Get 20 recent messages from user
export const getUserRecentPrompts = async (
  userId: number,
  limit: number = 20
) => {
  const { data, error } = await supabase
    .from('messages')
    .select('message,assistant_response')
    .eq('user', userId)
    .order('created_at', { ascending: false })
    .limit(limit);

  return [data, error];
};

// Save message from user along with GPT-3 response
export const saveUserPrompt = async (
  userId: number,
  userPrompt: string,
  assistantResponse: string
) => {
  const { data, error } = await supabase.from('messages').insert([
    {
      user: userId,
      message: userPrompt,
      assistant_response: assistantResponse,
    },
  ]);

  return [data, error];
};
