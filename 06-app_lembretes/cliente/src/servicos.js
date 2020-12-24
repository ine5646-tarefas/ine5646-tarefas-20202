//@flow

// -----
// implementa acesso a serviços disponíveis no lado servidor
// -----

import type {Token, Lembrete} from './tipos_flow'

async function fazCadastro (login: string, senha: string): Promise<Token> {
  let resposta = await executaPOST('/cmdFacaCadastro', { login, senha })
  if (resposta.ok) { return resposta.token } else { throw new Error(resposta.message) }
}

async function fazLogin (login: string, senha: string): Promise<Token> {
  let resposta = await executaPOST('/cmdFacaLogin', { login, senha })
  if (resposta.ok) { return resposta.token } else { throw new Error(resposta.message) }
}

async function publicaLembrete (texto: string, token: Token): Promise<{| ok: true|}> {
  let resposta = await executaPOST('/cmdPubliqueLembrete', { texto, token })
  if (resposta.ok) { return { ok: true } }
  throw new Error('token inválido ou expirado')
}

async function leLembretes (token: Token): Promise<Array<Lembrete>> {
  let resposta = await executaGET('/qryLeiaLembretes', { token })
  if (resposta.ok) { return resposta.lembretes }
  throw new Error('token inválido ou expirado')
}

async function apagaLembrete (token: Token, idLembrete: string): Promise<{| ok: true|}> {
  let resposta = await executaDELETE('/cmdApagueLembrete', { idLembrete, token })
  if (resposta.ok) { return { ok: true } }
  throw new Error('token inválido ou expirado')
}

function executaPOST (caminho, dados) {
  return executaPOSTOUDELETE('POST', caminho, dados)
}

function executaDELETE (caminho, dados) {
  return executaPOSTOUDELETE('DELETE', caminho, dados)
}

function executaPOSTOUDELETE (metodo, caminho, dados) {
  const params = {
    method: metodo,
    headers: {
      'content-type': 'application/json'
    },
    body: JSON.stringify(dados)
  }

  return window.fetch(caminho, params)
    .then(resposta => {
      if (!resposta.ok) { throw new Error('Falha na comunicação com servidor') }
      return resposta
    })
    .then(resposta => resposta.json())
}

function executaGET (caminho, dados) {
  const params = {
    method: 'GET',
    headers: {
      'content-type': 'application/json'
    }
  }
  const corpo = JSON.stringify(dados)
  return window.fetch(`${caminho}?dados=${corpo}`, params)
    .then(resposta => {
      if (!resposta.ok) { throw new Error('Falha na comunicação com servidor') }
      return resposta
    })
    .then(resposta => resposta.json())
}

export { fazLogin, fazCadastro, publicaLembrete, leLembretes, apagaLembrete }
