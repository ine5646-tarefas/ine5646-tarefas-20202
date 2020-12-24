import http from 'http'
import https from 'https'
import fs from 'fs'
import path from 'path'

import express from 'express'
import {dados} from './dados'
import {consultaInicial, consultaPesquisaPorAltura} from './controle'


const opcoesHTTPS = {
  key: fs.readFileSync(path.resolve(__dirname, '../cert/key.pem')),
  cert: fs.readFileSync(path.resolve(__dirname, '../cert/cert.pem'))
}

const PORTA = process.env.PORT || 3000
const LOCAL = process.env.LOCAL === 'sim'
const msgNoAr = `Servidor no ar, porta ${PORTA}`

const app = express()

app.set('view engine', 'pug')

app.get('/', (req, res) => consultaInicial(res, dados))

app.get('/pesquisePorAltura', (req, res) => consultaPesquisaPorAltura(req, res, dados))

const server = LOCAL ? https.createServer(opcoesHTTPS, app) : http.createServer(app)

// eslint-disable-next-line no-console
server.listen(PORTA, () => console.log(msgNoAr))
