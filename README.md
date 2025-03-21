# SWEATSHOP ID Card Generator

A web application that allows users to log in with Twitter, then automatically retrieves their Twitter avatar and name to generate a personalized SWEATSHOP ID card.

## Features

- Twitter OAuth login using NextAuth.js
- Retrieves user's Twitter profile picture and name
- Generates a customized ID card with the user's information
- Allows downloading the generated badge as a PNG image
- Customizable position/title field

## Technical Stack

- Next.js with App Router
- TypeScript
- TailwindCSS for styling
- NextAuth.js for authentication
- Canvas for image manipulation
- Sharp for image processing
- Axios for HTTP requests

## Getting Started

### Prerequisites

- Node.js 18.x or higher
- Twitter Developer Account with API credentials

### Setup

1. Clone the repository:
   ```bash
   git clone <repository-url>
   cd sweatshop
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Copy the example environment file and fill in your Twitter API credentials:
   ```bash
   cp .env.local.example .env.local
   ```

4. Edit `.env.local` and add your Twitter API credentials:
   ```
   TWITTER_CLIENT_ID=your_twitter_client_id_here
   TWITTER_CLIENT_SECRET=your_twitter_client_secret_here
   NEXTAUTH_URL=http://localhost:3000
   NEXTAUTH_SECRET=your_generated_secret_here
   ```

   You can generate a random string for NEXTAUTH_SECRET using:
   ```bash
   openssl rand -base64 32
   ```

5. Generate the badge template:
   ```bash
   npm run generate-template-simple
   ```
   > 注意：如果执行 `npm run generate-template` 出错，请使用上面的简单版命令代替

6. Start the development server:
   ```bash
   npm run dev
   ```

7. Open [http://localhost:3000](http://localhost:3000) in your browser.

## Twitter API Setup

1. Create a Twitter Developer account at [developer.twitter.com](https://developer.twitter.com)
2. Create a new project and app
3. Set up OAuth 2.0 and configure the callback URL as `http://localhost:3000/api/auth/callback/twitter`
4. Get your Client ID and Client Secret from the Twitter Developer Portal
5. Add these credentials to your `.env.local` file

## Deployment

This application can be deployed to Vercel, Netlify, or any other Next.js-compatible hosting service.

For production deployment, make sure to:

1. Set the environment variables in your hosting platform
2. Configure the callback URL in your Twitter Developer Portal to match your production URL

## License

MIT
