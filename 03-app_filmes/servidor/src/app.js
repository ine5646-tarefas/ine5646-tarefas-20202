import http from 'http'
import https from 'https'
import path from 'path'
import fs from 'fs'

import express from 'express'


const opcoesHTTPS = {
  key: fs.readFileSync(path.resolve(__dirname, '../cert/key.pem')),
  cert: fs.readFileSync(path.resolve(__dirname, '../cert/cert.pem'))
}

const PORTA = process.env.PORT || 3000
const LOCAL = process.env.LOCAL === 'sim'

const app = express()

app.use(express.static(path.resolve(__dirname, '../publico')))

const server = LOCAL ? https.createServer(opcoesHTTPS, app) : http.createServer(app)

// eslint-disable-next-line no-console
server.listen(PORTA, () => console.log(`No ar, HTTPS porta ${PORTA}`))
