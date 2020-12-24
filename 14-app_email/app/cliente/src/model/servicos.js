// @flow
import type {Email, TokenJWT, 
  LeEmailsEnviados, RespostaObtemConfiguracao,
  RespostaRenovaToken, RespostaRecuperaSenha,
  FazLogin, RespostaDeuNaoDeu,
  PesquisaUsuario, EnviaEmailDePara} from '../tipos-flow'

export async function obtemConfiguracao(): Promise<RespostaObtemConfiguracao> {
  return await enviaPOST('/obtenhaConfiguracao', {})
}

export async function renovaToken(token: TokenJWT): Promise<RespostaRenovaToken> {
  return await enviaPOST('/renoveToken', {token})
}

export async function recuperaSenha(email: Email): Promise<RespostaRecuperaSenha> {
  return await enviaPOST('/recupereSenha', {email})
}

export async function fazLogin(email: Email, senha: string): Promise<FazLogin> {
  return await enviaPOST('/facaLogin', {email, senha})
}

export async function cadastra(email: Email, nome: string, senha: string): Promise<RespostaDeuNaoDeu> {
  return await enviaPOST('/cadastre', {email, nome, senha})
}

export async function removeUsuario(token: TokenJWT): Promise<RespostaDeuNaoDeu> {
  return await enviaPOST('/removaUsuario', {token})
}

export async function validaEmailPara(token: TokenJWT, email: Email): Promise<PesquisaUsuario> {
  return await enviaPOST('/valideEmailPara', {token, email})
}

export async function enviaEmailDePara(token: TokenJWT, para: Email, assunto: string, texto: string): Promise<EnviaEmailDePara> {
  return await enviaPOST('/envieEmailDePara', {token, para, assunto, texto})
}

export async function leEmailsEnviados(token: TokenJWT, qtd: number): Promise<LeEmailsEnviados> {
  return await enviaPOST('/leiaEmailsEnviados', {token, qtd})
}

async function enviaPOST(endereco, objeto) {
  const resposta = await fetch(endereco, {
    method: 'POST',
    headers: {
      'content-type': 'application/json'
    },
    body: JSON.stringify(objeto)
  })

  return await resposta.json()
}

