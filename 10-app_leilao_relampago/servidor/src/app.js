// @flow

import {PORTA, LOCAL} from './env'

import http from 'http'
import https from 'https'
import fs from 'fs'
import path from 'path'
import express from 'express'

import {criaServidorWS} from './ws'


const opcoesHTTPS = {
  key: fs.readFileSync(path.resolve(__dirname, '../cert/key.pem')),
  cert: fs.readFileSync(path.resolve(__dirname, '../cert/cert.pem'))
}

const app = express()

app.use(express.static(path.resolve(__dirname, '../publico')))
app.use(express.json())


const server = LOCAL ? https.createServer(opcoesHTTPS, app) : http.createServer(app)

criaServidorWS(server)


// eslint-disable-next-line no-console
server.listen(PORTA, () => console.log(`Servidor no ar na porta ${PORTA}...`))
