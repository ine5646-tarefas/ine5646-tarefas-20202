// @flow

//-----
// implementa serviços disponíveis no lado servidor
//-----
import type { Token, IdVulcao,
  VulcaoParaCadastro, Consulta, Comando, ImagemEmBase64, VulcaoMongo } from './tipos'

async function temConexaoComBanco(): Promise<{| ok: boolean |}> {
  return await executaGET('/qryTemConexaoComBanco')
}

async function leLimiteImagem(): Promise<number> {
  const resposta = await executaGET('/qryLeiaLimiteImagem')
  if (resposta.ok)
    return resposta.limiteImagem
  throw new Error(resposta.message)
}

async function fazCadastro(login: string, senha: string): Promise<Token> {
  const resposta = await executaPOST('/cmdFacaCadastro', {login, senha})
  if (resposta.ok)
    return resposta.token
  else
    throw new Error(resposta.message)
}

async function fazLogin(login: string, senha: string): Promise<Token> {
  const resposta = await executaPOST('/cmdFacaLogin', {login, senha})
  if (resposta.ok)
    return resposta.token
  else
    throw new Error(resposta.message)
}

async function cadastraVulcao(vulcao: VulcaoParaCadastro, token: Token): Promise<{| ok: true |}> {
  const resposta = await executaPOST('/cmdCadastreVulcao', {vulcao, token})
  if (resposta.ok)
    return {ok: true}
  throw new Error('token inválido ou expirado')
}

async function leVulcoes(token: Token): Promise<Array<VulcaoMongo>> {
  const resposta = await executaGET('/qryLeiaVulcoes', {token})
  if (resposta.ok)
    return resposta.vulcoes
  throw new Error('token inválido ou expirado')
}

async function apagaVulcao(token: Token, idVulcao: IdVulcao): Promise<{| ok: true |}> {
  const resposta = await executaDELETE('/cmdApagueVulcao', {idVulcao, token})
  if (resposta.ok)
    return {ok: true}
  throw new Error('token inválido ou expirado')
}

async function buscaImagemNoBanco(token: Token, idVulcao: IdVulcao): Promise<ImagemEmBase64> {
  const resposta = await executaGET('/qryLeiaImagemVulcao', {token, idVulcao})
  if (resposta.ok)
    return resposta.imagem
  throw new Error('tokne inválido ou expirado')
}

function executaPOST(caminho: Comando, dados) {
  return executaPOSTOUDELETE('POST', caminho, dados)
}

function executaDELETE(caminho: Comando, dados) {
  return executaPOSTOUDELETE('DELETE', caminho, dados)
}

function executaPOSTOUDELETE (metodo: 'POST' | 'DELETE',
  caminho: Comando, dados) {

  const params = {
    method: metodo,
    headers: {
      'content-type': 'application/json'
    },
    body: JSON.stringify(dados)
  }

  return window.fetch(caminho, params)
    .then(resposta => {
      if (!resposta.ok)
        throw new Error('Falha na comunicação com servidor')
      return resposta
    })
    .then(resposta => resposta.json())
}


function executaGET (caminho: Consulta, dados) {
  const params = {
    method: 'GET',
    headers: {
      'content-type': 'application/json'
    }
  }
  const corpo = dados === undefined ? '' : JSON.stringify(dados)
  return window.fetch(`${caminho}?dados=${corpo}`, params)
    .then(resposta => {
      if (!resposta.ok)
        throw new Error('Falha na comunicação com servidor')
      return resposta
    })
    .then(resposta => resposta.json())
}

export { fazLogin, fazCadastro, cadastraVulcao, leVulcoes, apagaVulcao,
  leLimiteImagem, buscaImagemNoBanco, temConexaoComBanco }
