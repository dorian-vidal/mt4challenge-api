FROM node:18
WORKDIR /usr/src/app
COPY package*.json ./
RUN npm ci --include=dev
RUN npm install webpack
COPY . .
CMD ["npm", "run", "start:dev" ]