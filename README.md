# What is VibeBot?

VibeBot is a platform that simplifies the process of creating custom Telegram bots. Instead of writing code manually, users can:

- **Chat with AI**: Describe what you want your bot to do in plain English
- **Generate Bot Code**: The AI creates the necessary code based on your requirements
- **Deploy Instantly**: Your bot is automatically deployed and ready to use on Telegram

**🌐 [Visit VibeBot Website](https://vibe-bot.com/)**

## Tech Stack

### Frontend

- **React 19** - Modern React with the latest features
- **Next.js 15.3** - Full-stack React framework with App Router
- **TypeScript 5** - Type-safe development
- **Tailwind CSS 4** - Utility-first CSS framework
- **React Hook Form** + **Zod** - Form handling and validation
- **React Query** - Server state management

### Backend & Database

- **PostgreSQL** - Relational database for storing bot data
- **Drizzle ORM** - Type-safe database operations
- **Next.js API Routes and Server Actions** - Server-side functionality
- **Anthropic AI SDK** - Claude AI integration for bot generation
- **Clerk** - Authentication and user management

### Bot Execution Environment

- **E2B Sandboxes** - Secure, isolated containers for running generated bot code
- **Docker** - Containerization for consistent bot deployment
- **Node.js Runtime** - JavaScript execution environment for Telegram bots
- **Telegraf** - Modern Telegram Bot API framework
- **Claude Code Integration** - AI-powered code generation and execution

## Getting Started

1. **Clone the repository**

   ```bash
   git clone https://github.com/TomasVDDC/vibebot.git
   cd vibebot-frontend
   ```

2. **Install dependencies**

   ```bash
   pnpm install
   ```

3. **Set up environment variables**
   Create a `.env` file with your configuration:

   ```bash
   # Database
   DATABASE_LOCAL_URL=your_postgresql_url

   # Authentication (Clerk)
   NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=your_clerk_key
   CLERK_SECRET_KEY=your_clerk_secret

   # AI Integration
   ANTHROPIC_API_KEY=your_anthropic_key

   ```

4. **Run the development server**

   ```bash
   pnpm run dev
   ```

5. **Open your browser**
   Navigate to [http://localhost:3000](http://localhost:3000)

## Project Structure

```
├── app/                 # Next.js App Router pages
│   ├── api/            # API routes
│   ├── db/             # Database schema and configuration
│   └── home/           # Main application pages
├── components/         # Reusable UI components
├── lib/               # Utility functions and helpers
├── hooks/             # Custom React hooks
└── sandbox-template/   # Bot deployment configuration
    ├── e2b.Dockerfile  # Container definition for bot execution
    ├── e2b.toml       # E2B sandbox configuration
    └── docker-compose.yml # Local container orchestration
```

## Bot Execution Environment

VibeBot uses [**E2B (Code Interpreter)**](https://e2b.dev/) sandboxes to securely execute generated bot code. This provides several benefits:

### E2B Sandboxes

- **Isolated Execution**: Each bot runs in its own secure container
- **Pre-configured Environment**: Comes with Node.js, npm, and essential tools
- **Claude Code Integration**: Built-in AI assistant for code generation and debugging
- **Template-based**: Uses `vibebot-template-v1` for consistent deployments

### Docker Configuration

The `sandbox-template/` directory contains:

- **e2b.Dockerfile**: Defines the container environment with Node.js 23, Telegraf, and Claude Code
- **docker-compose.yml**: Local development setup for testing bot containers
- **Setup Scripts**: Automated configuration for Claude Code and VS Code server to test in development.

### How It Works

1. User describes desired bot behavior in the chat interface
2. AI generates JavaScript code using the Telegraf framework
3. Code is deployed to an isolated E2B sandbox
4. Bot runs securely with access to Telegram API
5. Real-time monitoring and task tracking through the web interface

## License

This project is licensed under the MIT License.
