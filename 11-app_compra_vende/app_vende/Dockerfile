FROM node:14 as dev
USER node
WORKDIR /app
COPY cliente/package*.json cliente/
COPY servidor/package*.json servidor/
WORKDIR /app
COPY . .
#
FROM node:14-alpine as build
WORKDIR /app
COPY cliente/package*.json cliente/
COPY servidor/package*.json servidor/
WORKDIR /app/cliente
RUN npm install
WORKDIR /app/servidor
RUN npm install
WORKDIR /app
COPY . .
WORKDIR /app/cliente
RUN npm run build
WORKDIR /app/servidor
RUN npm run build
#
FROM node:14-alpine as prod
WORKDIR /app/servidor
COPY --from=build /app/servidor/package*.json ./ 
RUN npm install --production 
COPY --from=build /app/servidor/cert ./cert
COPY --from=build /app/servidor/build ./build
COPY --from=build /app/servidor/publico ./publico
CMD [ "node", "build/app.js" ]
