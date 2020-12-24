// @flow

import {RABBITMQ_URL} from './env'

import {enviaEmailDePara, leEmailsEnviados, usuarioRemovido, informeMaxMsgsLidas} from './servicos'

import {ServiceBroker} from 'moleculer'

import type {RespostaLeEmailsEnviados, RespostaEnviaEmailDePara, TokenJWT, Email} from './tipos-flow'

const broker = new ServiceBroker({
  nodeID: 'nodo-ms_mensageiro',
  transporter: RABBITMQ_URL
})

process.on('SIGINT', () => {
  console.log('Encerrando broker autentica')
  broker.stop()
})

broker.createService({
  name: 'mensageiro',
  actions: {
    informaMaxMsgsLidas: {
      handler() {
        return informeMaxMsgsLidas()
      }
    }
    ,
    enviaEmailDePara: {
      params: {
        token: {type: 'string', messages: {string: 'Token deve ser do tipo JWT'}},
        para: {type: 'email', messages: {email: 'Destinatário deve ser e-mail'}},
        assunto: {type: 'string'},
        texto: {type: 'string'}
      }
      ,
      handler (ctx) {
        const token: TokenJWT = ctx.params.token
        const para: Email = ctx.params.para
        const assunto: string = ctx.params.assunto
        const texto: string = ctx.params.texto
  
        const resposta: Promise<RespostaEnviaEmailDePara> = enviaEmailDePara(broker, token, para, assunto, texto)
        return resposta
      }
    }
    ,
    leEmailsEnviados: {
      params: {
        token: {type: 'string', messages: {string: 'Token deve ser do tipo JWT'}},
        qtd: {type: 'number', min: 1, messages: {number: 'Qtd deve ser número', numberMin: 'Qtd deve ser no mínimo 1'}}
      }
      ,
      handler (ctx) {
        const token: TokenJWT = ctx.params.token
        const qtd: number = ctx.params.qtd
        const resposta: Promise<RespostaLeEmailsEnviados> = leEmailsEnviados(broker, token, qtd)
        return resposta  
      }
    }
  },
  events: {
    'usuario.removido': {
      handler(email) {
        usuarioRemovido(email)
      }
    }
  }
})

broker.start().then(() => console.log('ms_mensageiro no ar'))
