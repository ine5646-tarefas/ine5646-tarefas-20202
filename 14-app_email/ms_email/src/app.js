// @flow

import {RABBITMQ_URL} from './env'

import {validaEmail, enviaEmail} from './servicos'

import type {Email, Resposta} from './tipos-flow'

import {ServiceBroker} from 'moleculer'

const broker = new ServiceBroker({
  nodeID: 'nodo-ms_email',
  transporter: RABBITMQ_URL
})

process.on('SIGINT', () => {
  console.log('Encerrando broker email')
  broker.stop()
})

broker.createService({
  name: 'email',
  actions: {
    enviaEmail: {
      params: {
        para: {type: 'email', messages: {email: 'Campo precisa ser um e-mail'}},
        assunto: {type: 'string'},
        texto: {type: 'string'}
      }
      ,
      async handler (ctx) {
        const para: Email = ctx.params.para
        const assunto: string = ctx.params.assunto
        const texto: string = ctx.params.texto
        try {
          const resp: Resposta = await enviaEmail(para, assunto, texto)
          return resp
        } catch (erro) {
          return {ok: false, motivo: erro.message}
        }
      }
    }
    ,
    validaEmail: {
      params: {
        email: {type: 'email', messages: {email: 'Campo precisa ser um e-mail'}}
      }
      ,
      async handler (ctx) {
        const email: Email = ctx.params.email
        try {
          const resp: Resposta = await validaEmail(email)
          return resp
        } catch (erro){
          return {ok: false, motivo: erro.message}
        }
      }
    }
  }
})


broker.start().then(() => console.log('Iniciou ms_email'))
