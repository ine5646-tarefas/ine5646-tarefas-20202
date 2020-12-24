FROM node:14 as dev
USER node
WORKDIR /app
COPY package*.json /app/
WORKDIR /app
COPY . .
#
FROM node:14-alpine as build
WORKDIR /app
COPY package*.json /app/
WORKDIR /app
RUN npm install
COPY . .
WORKDIR /app
RUN npm run build
#
FROM node:14-alpine as prod
WORKDIR /app
COPY --from=build /app/package*.json ./ 
RUN npm install --production 
COPY --from=build /app/build ./build
CMD [ "node", "build/app.js" ]
