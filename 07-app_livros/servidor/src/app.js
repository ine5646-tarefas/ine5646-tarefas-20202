//@flow

import {PORTA, LOCAL} from './env'

import http from 'http'
import https from 'https'
import fs from 'fs'
import path from 'path'
import express from 'express'
import * as banco from './banco'


const opcoesHTTPS = {
  key: fs.readFileSync(path.resolve(__dirname, '../cert/key.pem')),
  cert: fs.readFileSync(path.resolve(__dirname, '../cert/cert.pem'))
}

const app = express()

app.use(express.json())

app.use(express.static(path.resolve(__dirname, '../publico')))

app.get('/conecta', (req, res) => banco.conecta(res))

app.get('/desconecta', (req, res) => banco.desconecta(res))

app.post('/salva', (req, res) => {
  const titulo = req.body.titulo
  const autor = req.body.autor
  const paginas = req.body.paginas
  banco.salva(res, titulo, autor, paginas)
})

app.get('/pesquisaPorId', (req, res) => {
  const id = req.query.id
  banco.pesquisaPorId(res, id)
})

app.get('/pesquisaTodos', (req, res) => banco.pesquisaTodos(res))

app.get('/pesquisaPorTitulo', (req, res) => {
  const titulo = req.query.titulo
  banco.pesquisaPorTitulo(res, titulo)
})

app.get('/apagaTudo', (req, res) => banco.apagaTudo(res))

app.get('/apagaPorId', (req, res) => {
  const id = req.query.id
  banco.apagaPorId(res, id)
})


const server = LOCAL ? https.createServer(opcoesHTTPS, app) : http.createServer(app)

// eslint-disable-next-line no-console
server.listen(PORTA, () => console.log(`No ar, porta ${PORTA}...`))
