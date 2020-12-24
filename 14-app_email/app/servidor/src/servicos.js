//@flow

import type {TokenJWT, TokenUUID, Email, 
  FazLogin, ConfirmaTokenRedefinicao,
  EnviaEmailDePara, PesquisaUsuario, LeEmailsEnviados,
  RespostaDeuNaoDeu} from './tipos-flow'

import {RABBITMQ_URL} from './env'

import {ServiceBroker} from 'moleculer'


const broker = new ServiceBroker({
  nodeID: 'nodo-app_email',
  transporter: RABBITMQ_URL
})

broker.start()


process.on('SIGINT', () => {
  console.log('Encerrando broker app_email')
  broker.stop()
})

export const NOME_APP = 'UFSC - CTC - INE - INE5646 :: App email'


type RespostaObtemConfiguracao =
    {| ok: true, configuracao: {| MAX_MSGS_LIDAS: number |} |}
  | {| ok: false, motivo: string |}

export async function obtemConfiguracao(): Promise<RespostaObtemConfiguracao> {
  try {
    const MAX_MSGS_LIDAS = await broker.call('mensageiro.informaMaxMsgsLidas')
    return {ok: true, configuracao: {MAX_MSGS_LIDAS}}
  } catch (erro) {
    return {ok: false, motivo: encontraMotivo(erro)}
  }
}

type RespostaRenovaToken =
    {| ok: false |}
  | {|ok: true, token: TokenJWT |}

export async function renovaToken(token: TokenJWT): Promise<RespostaRenovaToken> {
  try {
    const novoToken: TokenJWT | null = await broker.call('autentica.renovaToken', {token})
    return novoToken === null ? {ok: false} : {ok: true, token: novoToken}
  } catch (erro){
    return {ok: false}
  }
}

export async function leEmailsEnviados(token: TokenJWT, qtd: number): Promise<LeEmailsEnviados> {
  try {
    return broker.call('mensageiro.leEmailsEnviados', {token, qtd})
  } catch (erro) {
    return {ok: false, motivo: encontraMotivo(erro)}
  }
}


export async function validaEmailPara(token: TokenJWT, email: Email): Promise<PesquisaUsuario> {
  try {
    return await broker.call('autentica.pesquisaUsuario', {token, email})
  } catch (erro) {
    return {ok: false, motivo: encontraMotivo(erro)}
  }
}


export async function fazLogin(email: Email, senha: string): Promise<FazLogin> {
  try {
    return await broker.call('autentica.fazLogin', {email, senha})
  } catch (erro) {
    return {ok: false, motivo: encontraMotivo(erro)}
  }
}

export async function removeUsuarioDoBanco(tokenJWT: TokenJWT): Promise<RespostaDeuNaoDeu> {
  try {
    return await broker.call('autentica.remove', {token: tokenJWT})
  } catch (erro) {
    return {ok: false, motivo: encontraMotivo(erro)}
  }
}


export async function cadastra(host: string, email: Email, nome: string, senha: string): Promise<RespostaDeuNaoDeu> {
  try {
    return await broker.call('autentica.cadastra', {origin: host, nomeApp: NOME_APP, email, nome, senha})
  } catch (erro) {
    return {ok: false, motivo: encontraMotivo(erro)}
  }
}

type RespostaAutenticaRecuperaSenha = {| ok: true |} | {| ok: false, motivo: string |}
export async function recuperaSenha(host: string, email: Email): Promise<RespostaAutenticaRecuperaSenha> {
  try {
    return await broker.call('autentica.recuperaSenha', {origin: host, nomeApp: NOME_APP, email})
  } catch (erro) {
    return {ok: false, motivo: encontraMotivo(erro)}
  }
}

export async function confirma(token: TokenUUID): Promise<RespostaDeuNaoDeu> {
  try {
    return await broker.call('autentica.confirma', {token})
  } catch (erro) {
    return {ok: false, motivo: encontraMotivo(erro)}
  }
}


export async function confirmaTokenRedefinicao(tokenNovaSenha: TokenUUID): Promise<ConfirmaTokenRedefinicao> {
  try {
    return await broker.call('autentica.confirmaTokenRedefinicao', {token: tokenNovaSenha})
  } catch (erro) {
    return {ok: false, motivo: encontraMotivo(erro)}
  }
}


export async function enviaEmailDePara(token: TokenJWT, para: string, 
  assunto: string, texto: string): Promise<EnviaEmailDePara> {
  try {
    return await broker.call('mensageiro.enviaEmailDePara', {token, para, assunto, texto})
  } catch (erro) {
    return {ok: false, motivo: encontraMotivo(erro)}
  }
}


export async function alteraSenha(tokenNovaSenha: TokenUUID, senha: string): Promise<RespostaDeuNaoDeu> {
  try {
    return await broker.call('autentica.alteraSenha', {token: tokenNovaSenha, senha})
  } catch (erro) {
    return {ok: false, motivo: encontraMotivo(erro)}
  }
}

function encontraMotivo(erro) {
  return erro.type === 'VALIDATION_ERROR' ? erro.data[0].message : 'Microserviço de autenticação inacessível'
}
