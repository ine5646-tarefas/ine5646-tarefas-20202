//@flow

import { PORTA, LOCAL } from './env'

import http from 'http'
import https from 'https'
import fs from 'fs'
import path from 'path'
import express from 'express'
import helmet from 'helmet'

import {
  leUsuario, cadastraUsuario,
  registraLembrete, leLembretes,
  apagaLembrete, criptografaSenha } from './persistencia'

import { geraToken, validaToken } from './jwt_util'


const opcoesHTTPS = {
  key: fs.readFileSync(path.resolve(__dirname, '../cert/key.pem')),
  cert: fs.readFileSync(path.resolve(__dirname, '../cert/cert.pem'))
}

const app = express()
app.use(express.json())
app.use(helmet())

app.use(express.static(path.resolve(__dirname, '../publico')))

app.post('/cmdFacaLogin', (req, res) => {
  const { login, senha } = req.body
  const senhaCriptografada = criptografaSenha(senha)
  leUsuario(login)
    .then(usuario => {
      if (usuario !== null && usuario.senha === senhaCriptografada) {
        res.json({ ok: true, token: geraToken(login) })
      } else {
        res.json({ ok: false, message: 'login e/ou senha inválidos' })
      }
    })
    .catch(erro => {
      res.json({ ok: false, message: erro.message })
    })
})

app.post('/cmdFacaCadastro', (req, res) => {
  const { login, senha } = req.body
  const senhaCriptografada = criptografaSenha(senha)

  cadastraUsuario(login, senhaCriptografada)
    .then(resultado => {
      if (resultado) {
        res.json({ ok: true, token: geraToken(login) })
      } else {
        res.json({ ok: false, message: 'Login já foi cadastrado' })
      }
    })
    .catch(erro => {
      res.json({ ok: false, message: erro.message })
    })
})

app.post('/cmdPubliqueLembrete', (req, res) => {
  const { texto, token } = req.body
  const dadosToken = validaToken(token)
  if (dadosToken !== null) {
    registraLembrete(dadosToken.login, texto)
      .then(idRegistrado => {
        res.json({ ok: true, idRegistrado })
      })
      .catch(erro => {
        res.json({ ok: false, message: erro.message })
      })
  } else {
    res.json({ ok: false, message: 'token inválido' })
  }
})

app.delete('/cmdApagueLembrete', (req, res) => {
  const { idLembrete, token } = req.body
  const dadosToken = validaToken(token)
  if (dadosToken !== null) {
    apagaLembrete(idLembrete)
      .then(() => {
        res.json({ ok: true })
      })
      .catch(erro => {
        res.json({ ok: false, message: erro.message })
      })
  } else {
    res.json({ ok: false, message: 'token inválido' })
  }
})

app.get('/qryLeiaLembretes', (req, res) => {
  const { token } = JSON.parse(req.query.dados)
  const dadosToken = validaToken(token)
  if (dadosToken !== null) {
    leLembretes(dadosToken.login)
      .then(lembretes => {
        res.json({ ok: true, lembretes })
      })
      .catch(erro => {
        res.json({ ok: false, message: erro.message })
      })
  } else {
    res.json({ ok: false, message: 'token inválido' })
  }
})

const server = LOCAL ? https.createServer(opcoesHTTPS, app) : http.createServer(app)

// eslint-disable-next-line no-console
server.listen(PORTA, () => console.log(`Servidor no ar na porta ${PORTA}...`))
