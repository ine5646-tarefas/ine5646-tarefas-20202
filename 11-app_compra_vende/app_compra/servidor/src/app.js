// @flow
import { PORTA , LOCAL} from './env'

import http from 'http'
import https from 'https'
import path from 'path'
import fs from 'fs'

import express from 'express'
import { enviaPedido, obtemPedidosProcessados } from './rabbit'

import type { Comando, Solicitacao, Pedido } from './tipos_flow'


const opcoesHTTPS = {
  key: fs.readFileSync(path.resolve(__dirname, '../cert/key.pem')),
  cert: fs.readFileSync(path.resolve(__dirname, '../cert/cert.pem'))
}

const app = express()
app.use(express.json())
app.use(express.static('publico'))

app.post(('/CmdEnviePedido': Comando), (req, res) => {
  const pedido: Pedido = req.body
  enviaPedido(pedido)
    .then(() => res.json({ ok: true }))
    .catch(erro => res.json({ ok: false, message: erro.message }))
})

app.post(('/CmdBusquePedidosProcessados': Comando), (req, res) => {
  const sol: Solicitacao = req.body
  obtemPedidosProcessados(sol)
    .then(r => res.json(r))
    .catch(erro => res.json({ ok: false, message: erro.message }))
})

const server = LOCAL ? https.createServer(opcoesHTTPS, app) : http.createServer(app)

// eslint-disable-next-line no-console
server.listen(PORTA, () => console.log(`Servidor no ar na porta ${PORTA}...`))
