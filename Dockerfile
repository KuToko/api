FROM node:12.18.3-alpine3.12

# Create app directory

WORKDIR /app

COPY . .

RUN npm install

CMD ["npm", "run", "start"]
