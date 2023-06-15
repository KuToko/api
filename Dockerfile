FROM node:12.18.3-alpine3.12

# Create app directory

WORKDIR /app

COPY . .

RUN npm install

ENV NODE_ENV=production
ENV PORT=8000
ENV JWT_SECRET=DQFBfBMMKzvx4OSJJlGY6nJkO+r41rjXwFKv8+QwHdvZOKZt6ZVaenvNeJ13n/tCeqUx0TuFQX+w/VoYwPkMop5rMEoCibdPuyOlumWMi8PgZLyj+N7uiwtwnuMJhVNo6yg6BlruN4jjjosVyDz7l2tXodX2Jyb0LP0ZDqNkcM0Ep0efiNJTiagt/MsQNzx8I8/nNNlww/0DnyhcEkMttJvqvoPp9/Mt/yyCq2R8VkiVM53DzjTdTv2d3JbEeayvRz9QRcpHnQdqSl3H7tbMUwLmNsErJasu6NsNdTIieGYkxaaCrktwCEi65DQY08E2fq1M7XyznG9GR1c/M4CESA==

# RUN node generateServiseAccount.js
EXPOSE 8000
CMD ["npm", "start"]
