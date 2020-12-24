// @flow

import {PORTA, LOCAL} from './env'

import http from 'http'
import https from 'https'
import fs from 'fs'

import path from 'path'
import express from 'express'

import {NOME_APP} from './servicos'
import {
  fazLogin, renovaToken,
  leEmailsEnviados,
  removeUsuarioDoBanco, cadastra, 
  recuperaSenha, confirma, confirmaTokenRedefinicao, 
  enviaEmailDePara, alteraSenha, validaEmailPara,
  obtemConfiguracao} from './servicos'

import {tokenUUIDToString} from './tipos-flow'


const opcoesHTTPS = {
  key: fs.readFileSync(path.resolve(__dirname, '../cert/key.pem')),
  cert: fs.readFileSync(path.resolve(__dirname, '../cert/cert.pem'))
}

const app = express()

app.use(express.static(path.resolve(__dirname, '../publico')))

app.use(express.json())

app.post('/renoveToken', (req, res) => {
  renovaToken(req.body.token).then(r => res.json(r))
})

app.post('/obtenhaConfiguracao', (req, res) => {
  obtemConfiguracao().then(r => res.json(r))
})

app.post('/leiaEmailsEnviados', (req, res) => {
  const {token, qtd} = req.body
  leEmailsEnviados(token, qtd).then(r => res.json(r))
})

app.post('/envieEmailDePara', (req, res) => {
  const {token, para, assunto, texto} = req.body
  enviaEmailDePara(token, para, assunto, texto).then(r => res.json(r))
})

app.post('/recupereSenha', (req, res) => {
  const email = req.body.email
  recuperaSenha(req.headers.origin, email).then(r => res.json(r))
})

import type {FazLogin} from './tipos-flow'
app.post('/facaLogin', (req, res) => {
  const {email, senha} = req.body
  fazLogin(email, senha).then((r: FazLogin) => res.json(r))
})


app.post('/removaUsuario', (req, res) => {
  removeUsuarioDoBanco(req.body.token).then(r => res.json(r))
})
 
import type { RespostaDeuNaoDeu } from './tipos-flow'
app.post('/cadastre', (req, res) => {
  const {email, nome, senha} = req.body
  cadastra(req.headers.origin, email, nome, senha).then((r: RespostaDeuNaoDeu) => res.json(r))
})

app.post('/valideEmailPara', (req, res) => {
  const {token, email} = req.body
  validaEmailPara(token, email).then(r => res.json(r))
})

app.get('/confirma/:token', (req, res) => {
  confirma(req.params.token).then(resposta => {
    if (resposta.ok) {
      res.setHeader('Content-Type', 'text/html; charset=UTF-8')
      res.write(`<h3>${NOME_APP} :: Confirmação de Cadastro</h3>`)
      res.write('<p>Cadastro confirmado. Pode fechar esta janela.</p>')
      res.end()
    }
    else {
      res.setHeader('Content-Type', 'text/html; charset=UTF-8')
      res.write(`<h3>${NOME_APP} :: Confirmação de Cadastro</h3>`)
      res.write('<p>Confirmação já tinha sido feita, se liga meu!</p>')
      res.end()
    }
  })
})

app.get('/redefineSenha/:token', (req, res) => {
  confirmaTokenRedefinicao(req.params.token)
    .then(resposta => {
      if (resposta.ok === false) {
        res.setHeader('Content-Type', 'text/html; charset=UTF-8')
        res.write(`<h3>${NOME_APP} :: Redefinindo Senha</h3>`)
        res.write(`<p>${resposta.motivo}.</p>`)
        res.end()
      } else {
        res.setHeader('Content-Type', 'text/html; charset=UTF-8')
        res.write(`<h3>${NOME_APP} :: Redefinindo Senha</h3>`)
        res.write('<form action=\'/alteraSenha\' method=\'GET\'>')
        res.write(`<input type='hidden' name='token' value='${tokenUUIDToString(resposta.token)}'>`)
        res.write('<p>Nova senha: <input type=\'password\' name=\'senha\'>')
        res.write('<button>Redefinir</button> </p>')
        res.write('</form>')
        res.end()
      }
    })
})

app.get('/alteraSenha', (req, res) => {
  const {token, senha} = req.query
  alteraSenha(token, senha).then(resultado => {
    if (resultado.ok) {
      res.setHeader('Content-Type', 'text/html; charset=UTF-8')
      res.write(`<h3>${NOME_APP} :: Redefinição de Senha</h3>`)
      res.write('<p>Senha modificada. Pode fechar esta janela.</p>')
      res.end()
    }
    else {
      res.setHeader('Content-Type', 'text/html; charset=UTF-8')
      res.write(`<h3>${NOME_APP} :: Redefinição de Senha</h3>`)
      res.write('<p>Token sem validade. A senha permanece a mesma.</p>')
      res.end()
    }
  })
})


const server = LOCAL ? https.createServer(opcoesHTTPS, app) : http.createServer(app)


// eslint-disable-next-line no-console
server.listen(PORTA, () => console.log(`Servidor no ar na porta ${PORTA}...`))