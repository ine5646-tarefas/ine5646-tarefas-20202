FROM node:14 as dev
USER node
WORKDIR /app
COPY package*.json ./
WORKDIR /app
COPY . .
#
FROM node:14-alpine as build
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
RUN npm run build
#
FROM node:14-alpine as prod
WORKDIR /app
COPY --from=build /app/package*.json ./ 
RUN npm install --production 
COPY --from=build /app/cert ./cert
COPY --from=build /app/build ./build
COPY --from=build /app/views ./views
CMD [ "node", "build/app.js" ]
