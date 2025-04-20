# You can use most Debian-based base images
FROM node:21-slim

# Copy the local bot-template-code.js file to the working directory
COPY bot-template-code.js /home/user/bot-template-code.js

RUN ls -la /home/user/bot-template-code.js && echo "✅ File copied successfully!"

WORKDIR /home/user
# Initialize npm and set type to module (for import/export)
RUN npm init -y
RUN npm pkg set type=module
# Install dependencies
RUN npm install telegraf
RUN npm install dotenv






