export const { PORT, SERVER_URL, TG_BOT_TOKEN } = process.env;
export const TELEGRAM_API = `https://api.telegram.org/bot${TG_BOT_TOKEN}`;
export const URI = `/webhook/${TG_BOT_TOKEN}`;
export const WEBHOOK_URL = `${SERVER_URL}${URI}`;
export const SUPABASE_URL = process.env.SUPABASE_URL;
export const SUPABASE_SECRET_KEY = process.env.SUPABASE_SECRET_KEY;
