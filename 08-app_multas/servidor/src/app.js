//@flow

import {PORTA, LOCAL} from './env'
import http from 'http'
import https from 'https'
import fs from 'fs'
import path from 'path'

import express from 'express'

import { configuraApolloServer } from './apollo'


const opcoesHTTPS = {
  key: fs.readFileSync(path.resolve(__dirname, '../cert/key.pem')),
  cert: fs.readFileSync(path.resolve(__dirname, '../cert/cert.pem'))
}

const app = express()
app.use(express.static(path.resolve(__dirname, '../publico')))

const server = LOCAL ? https.createServer(opcoesHTTPS, app) : http.createServer(app)

configuraApolloServer(app, server)

server.listen(PORTA, () => {
  // eslint-disable-next-line no-console
  console.log(`Vá para http://localhost:${PORTA}/graphql para executar consultas!`)
})
