FROM node:16-alpine
WORKDIR /app_S1
COPY package.json .
RUN npm install
COPY . .
EXPOSE 5000
ENV NODE_ENV=development
CMD ["npm", "run", "dev"]
