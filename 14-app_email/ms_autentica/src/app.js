// @flow

import {RABBITMQ_URL} from './env'

import type {
  Email, TokenJWT, TokenUUID,
  RespostaDeuNaoDeu, RespostaFazLogin, 
  RespostaConfirmaTokenRedefinicao, RespostaPesquisaUsuario,
  RespostaRenovaToken} from './tipos-flow'

import {fazLogin, removeUsuarioDoBanco, cadastra, 
  recuperaSenha, confirma, confirmaTokenRedefinicao, alteraSenha,
  pesquisaUsuario, renovaToken} from './servicos'

import {ServiceBroker} from 'moleculer'

const broker = new ServiceBroker({
  nodeID: 'nodo-ms_autentica',
  transporter: RABBITMQ_URL
})

process.on('SIGINT', () => {
  console.log('Encerrando broker autentica')
  broker.stop()
})


broker.createService({
  name: 'autentica',
  actions: {
    renovaToken: {
      params: {
        token: {type: 'string'}
      }
      ,
      handler(ctx) {
        const token: TokenJWT = ctx.params.token

        const resposta: Promise<RespostaRenovaToken> = renovaToken(token)
        return resposta
      }
    }
    ,
    recuperaSenha: {
      params: {
        origin: {type: 'string'},
        nomeApp: {type: 'string'},
        email: {type: 'email', messages: {email: 'Campo precisa ser um e-mail'}}
      }
      ,
      handler (ctx) {
        const origin: string = ctx.params.origin
        const nomeApp: string = ctx.params.nomeApp
        const email: Email = ctx.params.email
  
        const resposta: Promise<RespostaDeuNaoDeu> = recuperaSenha(broker, origin, nomeApp, email)
        return resposta
  
      }
    }
    ,
    fazLogin: {
      params: {
        email: {type: 'email', messages: {email: 'Campo precisa ser um e-mail'}},
        senha: {type: 'string'}
      }
      ,
      handler (ctx) {
        const email: Email = ctx.params.email
        const senha: string = ctx.params.senha
        const resposta: Promise<RespostaFazLogin> = fazLogin(email, senha)
        return resposta
      }
    }
    ,
    remove: {
      params: {
        token: {type: 'string'}
      },
      handler (ctx) {
        const token: TokenJWT = ctx.params.token
        const resposta: Promise<RespostaDeuNaoDeu> = removeUsuarioDoBanco(broker, token)
        return resposta
  
      }
    }
    ,
    cadastra: {
      params: {
        origin: {type: 'string'},
        nomeApp: {type: 'string'},
        email: {type: 'email', messages: {email: 'Campo precisar ser um e-mail'}},
        nome: {type: 'string'},
        senha: {type: 'string'},
      }
      ,
      handler (ctx) {
        const origin: string = ctx.params.origin
        const nomeApp: string = ctx.params.nomeApp
        const email: Email = ctx.params.email
        const nome: string = ctx.params.nome
        const senha: string = ctx.params.senha
        const resposta: Promise<RespostaDeuNaoDeu> = cadastra(broker, origin, nomeApp, email, nome, senha)
        return resposta  
      }
    }
    ,
    confirma: {
      params: {
        token: {type: 'string'}
      }
      ,
      handler (ctx) {
        const token: TokenUUID = ctx.params.token
        const resposta: Promise<RespostaDeuNaoDeu> = confirma(token)
        return resposta
      }
    }
    ,
    confirmaTokenRedefinicao: {
      params: {
        token: {type: 'string'}
      }
      ,
      handler (ctx) {
        const token: TokenUUID = ctx.params.token
        const resposta: Promise<RespostaConfirmaTokenRedefinicao> = confirmaTokenRedefinicao(token)
        return resposta  
      }
    }
    ,
    alteraSenha: {
      params: {
        token: {type: 'string'},
        senha: {type: 'string'}
      }
      ,
      handler (ctx) {
        const token: TokenUUID = ctx.params.token
        const senha: string = ctx.params.senha
        const resposta: Promise<RespostaDeuNaoDeu> = alteraSenha(token, senha)
        return resposta  
      }
    }
    ,
    pesquisaUsuario: {
      params: {
        token: {type: 'string'},
        email: {type: 'email', messages: {email: 'Campo precisa ser um e-mail'}}
      },
      handler (ctx) {
        const token: TokenJWT = ctx.params.token
        const email: Email = ctx.params.email
        const resposta: Promise<RespostaPesquisaUsuario> = pesquisaUsuario(token, email)
        return resposta  
      }
    }
  }
})

broker.start().then(() => console.log('ms_autentica está no ar'))