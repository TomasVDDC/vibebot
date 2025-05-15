# Vibebot Sandbox Template

This folder provides a Docker-based sandbox environment for developing and running a Telegram bot using Node.js, with support for Claude Code and a built-in code-server (VS Code in the browser). It is designed to be used as an E2B template, allowing programmatic sandbox creation via the E2B platform.

## Key Components

- **e2b.Dockerfile**: Sets up a Node.js environment, installs development tools, Claude Code, and code-server.
- **docker-compose.yml**: Orchestrates the container, exposing ports for the code-server (web IDE).
- **run-server-template-code.js**: Starts an HTTP server and sets up the webhook for the Telegram bot.
- **e2b.toml**: Configuration for E2B, specifying template name, ID, and Dockerfile.
- **set-up-claude-code.sh**: Configures Claude Code with allowed tools.
- **start-code-server.sh**: Script to launch code-server with no authentication.

## Usage

### 1. Build and Start the Sandbox Locally

```sh
docker-compose up -d --build
docker-compose exec sandbox-template /bin/bash
# Once inside the container, start the code-server:
./start-code-server.sh
```

### 2. Access code-server (VS Code in browser)

Open [http://localhost:8080](http://localhost:8080) in your browser.

### 3. Build the E2B Template

To make the template available on e2b

```sh
e2b template build -n vibebot-template-v1
```

### 4. Using the Template in E2B SDKs

```js
import { Sandbox } from "e2b";
const sandbox = await Sandbox.create("vibebot-template-v1");
```

## Environment Variables

The bot expects certain environment variables (e.g., `BOT_TOKEN_...`, `PORT`, `WEBHOOK_DOMAIN`) to be set, typically locally via a `.env` file.
Otherwise they are passes as parameters when the e2b sandbox is created.

## Ports

- `4983`: (Custom, can be used as needed)
- `8080`: code-server (web IDE)

## Customization

- Add dependencies via `npm install` as needed.
