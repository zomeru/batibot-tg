# Batibot-TG

ChatGpt in your telegram app!

- Supports image generation
- Supports conversation history

## 🛠 Set Up

1. Install and use the correct version of Node using [NVM](https://github.com/nvm-sh/nvm) (Node Version Manager)

   ```sh
   nvm install 16.9.1
   nvm use 16.9.1
   ```

2. Install [PNPM](https://pnpm.io/) (a Javascript package manager)

   - Using Homebrew
     ```sh
     brew install pnpm
     ```
   - Using npm
     ```sh
     npm install -g pnpm
     ```

3. Install dependencies

   ```sh
   pnpm install
   ```

4. Install [ngrok](https://ngrok.com/download)

5. Start a tunnel using ngrok

   ```
   ngrok http 8000
   ```

6. Create a `.env` file

   - Generate an OPENAI API key -> https://platform.openai.com/account/api-keys
   - Create a bot in Telegram by messaging @BotFather
   - Create an account on Supabase and create a new project -> https://supabase.com/dashboard/projects

   ```
   PORT=8000

   TG_BOT_TOKEN=<YOUR_TG_BOT_TOKEN>
   SERVER_URL=<NGROK_FORWARDING_URL>

   OPENAI_API_KEY=<OPENAI_API_KEY>

   SUPABASE_URL=<SUPABASE_PROJECT_URL>
   SUPABASE_SECRET_KEY=<SUPABASE_SECRET_KEY>
   ```

7. Start the development server

   ```sh
   pnpm dev
   ```
