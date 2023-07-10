#######################################
#######################################
########## PRODUCTION IMAGE ###########
#######################################
#######################################
FROM node:18 AS production
WORKDIR /usr/src/app
COPY package*.json ./
RUN npm ci --include=dev
RUN npm install webpack
COPY . .
RUN npm run build
CMD ["npm", "run", "start:prod" ]

#######################################
#######################################
########## DEVELOPMENT IMAGE ##########
#######################################
#######################################
FROM node:18 AS development
WORKDIR /usr/src/app
COPY package*.json ./
RUN npm ci --include=dev
RUN npm install webpack
COPY . .
CMD ["npm", "run", "start:dev" ]