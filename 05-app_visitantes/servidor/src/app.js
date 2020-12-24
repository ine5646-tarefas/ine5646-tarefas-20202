import http from 'http'
import https from 'https'
import fs from 'fs'
import path from 'path'

import express from 'express'

import obtemVisitantes from './dados'

const PORTA = process.env.PORT || 3000
const LOCAL = process.env.LOCAL === 'sim'


const opcoesHTTPS = {
  key: fs.readFileSync(path.resolve(__dirname, '../cert/key.pem')),
  cert: fs.readFileSync(path.resolve(__dirname, '../cert/cert.pem'))
}

const app = express()
app.use(express.static(path.resolve(__dirname, '../publico')))

app.get('/dados', (req, res) => {
  setTimeout(() => res.json(obtemVisitantes()), 3000)
})

const server = LOCAL ? https.createServer(opcoesHTTPS, app) : http.createServer(app)


// eslint-disable-next-line no-console
server.listen(PORTA, () => console.log(`No ar, HTTPS porta ${PORTA}`))
