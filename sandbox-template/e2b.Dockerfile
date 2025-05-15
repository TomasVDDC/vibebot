# You can use most Debian-based base images
FROM node:23-slim

# By default when we push the template to e2b, the home directory will be set to /home/user. By matching this we make sure that the claude code config file is in the correct place
# when we try to run it on the e2b sandbox.
RUN mkdir -p /home/user

# Install curl to then be able to install code-server
RUN apt-get update && apt-get install -y \
    curl \
    procps \
    jq \
    sed \
    grep \
    nano \
    vim \
    git \
    sudo \
    python3 \
    && apt-get clean && rm -rf /var/lib/apt/lists/*

COPY run-server-template-code.js /home/user/run-server-template-code.js

# Set working directory to the new home
WORKDIR /home/user

# Define environment variable for the home directory
ENV HOME=/home/user

# Install claude-code
RUN npm i -g @anthropic-ai/claude-code

# Install nodemon, to hot reload the server
RUN npm install -g nodemon

# Install code-server
RUN curl -fsSL https://code-server.dev/install.sh | sh
RUN mkdir -p /root/.config/code-server
COPY start-code-server.sh /home/user/

# Set up claude code
COPY set-up-claude-code.sh /home/user/

# Initialize npm and set type to module (for import/export)
RUN npm init -y
RUN npm pkg set type=module
# Install dependencies
RUN npm install telegraf
RUN npm install dotenv

# Make all scripts executable recursively
RUN find . -type f -name "*.sh" -exec chmod +x {} \;
RUN chmod -R 777 .

# run scripts
RUN /home/user/set-up-claude-code.sh
