//@flow

import jwt from 'jsonwebtoken'
import {MAX_MSGS_LIDAS} from './env'

import type {ServiceBroker} from 'moleculer'

import {salvaCopiaDeEmail, leTodosEmailsDe, removeMensagensDe} from './banco'

import type {Email, TokenJWT, EmailEnviado, TokenJWTDecodificado, RespostaEnviaEmailDePara, RespostaLeEmailsEnviados} from './tipos-flow'

import {emailToString} from './tipos-flow'

export async function informeMaxMsgsLidas(): Promise<number> {
  return parseInt(MAX_MSGS_LIDAS || 5, 10)
}

export async function enviaEmailDePara(broker: ServiceBroker, token: TokenJWT, para: Email,
  assunto: string, texto: string): Promise<RespostaEnviaEmailDePara> {

  try {
    const tokenRenovado: TokenJWT | null = await renovaTokenJWT(broker, token)

    if (tokenRenovado == null)
      throw new Error('Token inválido ou expirado')

    const tokenDecodificado: TokenJWTDecodificado = jwt.decode(tokenRenovado)

    // verifica se destinatário é usuário da aplicação
    const dadosDestinatario = await broker.call('autentica.pesquisaUsuario', {token: tokenRenovado, email: para})
    if (dadosDestinatario.ok === false)
      throw new Error(dadosDestinatario.motivo)

    const assuntoEmail: string = 'UFSC-CTC-INE-INE5646 :: App Email -- mensagem para você'
    const textoEmail = 
    `Remetente: ${emailToString(tokenDecodificado.email)} (${tokenDecodificado.nome})

    Assunto: ${assunto}

    Mensagem:
    ${texto}
    `
    await broker.call('email.enviaEmail', {para, assunto: assuntoEmail, texto: textoEmail})
    await salvaCopiaDeEmail(tokenDecodificado.email, para, assunto, texto)

    return {ok: true, token: tokenRenovado}
  } catch (erro) {
    console.log('Erro em enviaEmailDePara:', erro)
    return {ok: false, motivo: `Erro: ${erro.message}`}
  }
}

export async function leEmailsEnviados(broker: ServiceBroker, 
  token: TokenJWT, qtd: number): Promise<RespostaLeEmailsEnviados> {
  const MAX_EMAILS: number = parseInt(MAX_MSGS_LIDAS,10)  || 5

  return {ok: false, motivo: 'Ainda não implementado'}
}

export async function usuarioRemovido(email: Email) {
  await removeMensagensDe(email)
}

async function renovaTokenJWT(broker: ServiceBroker, token: TokenJWT): Promise<TokenJWT | null> {
  return await broker.call('autentica.renovaToken', {token})
}
