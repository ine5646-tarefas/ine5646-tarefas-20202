//@flow
import { PORTA , LOCAL} from './env'

import http from 'http'
import https from 'https'
import path from 'path'
import fs from 'fs'

import express from 'express'
import { enviaPedidoProcessado, obtemPedidos } from './rabbit'

import type {Comando} from './tipos_flow'


const opcoesHTTPS = {
  key: fs.readFileSync(path.resolve(__dirname, '../cert/key.pem')),
  cert: fs.readFileSync(path.resolve(__dirname, '../cert/cert.pem'))
}

const app = express()
app.use(express.json())
app.use(express.static('publico'))

app.post(('/CmdEnviePedidoProcessado': Comando), (req, res) => {
  enviaPedidoProcessado(req.body)
    .then(() => res.json({ ok: true }))
    .catch(erro => res.json({ ok: false, message: erro.message }))
})
app.post(('/CmdBusquePedidos': Comando), (req, res) => {
  obtemPedidos()
    .then(r => res.json(r))
    .catch(erro => res.json({ ok: false, message: erro.message }))
})


const server = LOCAL ? https.createServer(opcoesHTTPS, app) : http.createServer(app)

// eslint-disable-next-line no-console
server.listen(PORTA, () => console.log(`Servidor no ar na porta ${PORTA}...`))
