FROM node:18

# Set working dir
WORKDIR /app

# Copy files
COPY package*.json ./
RUN npm install

COPY . .

EXPOSE 8080

CMD ["node", "server.js"]
