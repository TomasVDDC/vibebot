# You can use most Debian-based base images
FROM node:23-slim

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

#VS CODE server setup
RUN curl -fsSL https://code-server.dev/install.sh | sh
RUN mkdir -p /root/.config/code-server
COPY start-code-server.sh /home/user/



# Copy the local bot-template-code.js file to the working directory
COPY run-server-template-code.js /home/user/run-server-template-code.js

WORKDIR /home/user
# Initialize npm and set type to module (for import/export)
RUN npm init -y
RUN npm pkg set type=module
# Install dependencies
RUN npm install telegraf
RUN npm install dotenv

# Make all scripts executable recursively
RUN find . -type f -name "*.sh" -exec chmod +x {} \;
RUN chmod -R 777 .
