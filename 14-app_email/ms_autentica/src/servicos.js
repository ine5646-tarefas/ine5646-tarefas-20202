//@flow

import crypto from 'crypto'
import jwt from 'jsonwebtoken'
import {v4 as uuidv4} from 'uuid'
import {ServiceBroker} from 'moleculer'
import type {ServiceBroker as TipoServiceBroker} from 'moleculer'

import {JWT_DURATION, JWT_PASSWORD, CRIPTO_SALT as SALT} from './env'

import {enviaEmail, validaEmail} from './carteiro'
import {insereNovoUsuario, atualizaUsuario, leUsuario, removeUsuario, leUsuarioComToken} from './banco'

import { tokenUUIDoString, emailToString, stringToTokenUUID } from './tipos-flow'

import type {
  UsuarioDB, 
  Email, 
  TokenUUID, TokenJWT, TokenJWTDecodificado, 
  CamposAlteraveisUsuarioDB,
  RespostaDeuNaoDeu,
  RespostaFazLogin, RespostaConfirmaTokenRedefinicao,
  RespostaPesquisaUsuario, RespostaRenovaToken} from './tipos-flow'


export async function fazLogin(email: Email, senha: string): Promise<RespostaFazLogin> {
    
  try {
    const usuario: ?UsuarioDB = await leUsuario(email)

    if (usuario === undefined || usuario === null)
      return {ok: false, motivo: `E-mail ${emailToString(email)} não cadastrado`}

    if (usuario.confirmado === false)
      return {ok: false, motivo: `E-mail ${emailToString(email)} ainda não confirmado. Acesse e-mail para confirmar.`}

    if (usuario.senha !== criptografa(senha))
      return {ok: false, motivo: 'Senha incorreta'}

    const token: TokenJWT = geraTokenJWT(usuario)
    return {ok: true, token}
  } catch (erro) {
    return {ok: false, motivo: `Erro ao acessar banco: ${erro.message}`}
  }
}


export async function removeUsuarioDoBanco(broker: TipoServiceBroker, token: TokenJWT): Promise<RespostaDeuNaoDeu> {
  try {
    const tokenDecodificado = decodificaJWT(token)
    if (tokenDecodificado === null)
      throw new Error('Token inválido ou expirado')
    await removeUsuario(tokenDecodificado.email)
    //
    broker.emit('usuario.removido', tokenDecodificado.email)
    //
    return {ok: true}
  } catch (erro) {
    return {ok: false, motivo: `Erro: ${erro.message}`}
  }
}


export async function cadastra(broker: TipoServiceBroker, origin: string, nomeApp: string,
  email: Email, nome: string, senha: string): Promise<RespostaDeuNaoDeu> {

  try {  
    let usuario: ?UsuarioDB = await leUsuario(email)

    // verifica se já existe usuário cadastrado com o email fornecido
    if (usuario !== null && usuario !== undefined) {
      if (usuario.confirmado)
        return {ok: false, motivo: `E-mail ${emailToString(email)} já cadastrado`}
      else {
        const tokenConfirmacao: TokenUUID = usuario.token !== undefined ? usuario.token : stringToTokenUUID('') // token sempre será diferente de undefined
        try {
          const tokenString: string = tokenUUIDoString(tokenConfirmacao)
          const link = `${origin}/confirma/${tokenString}`
          await enviaEmail(broker, email, `${nomeApp} :: confirme seu cadastro`, link)
          return {ok: true}
        } catch (erro) {
          return {ok: false, motivo: 'Não conseguiu enviar e-mail de confirmação.'}
        }
      }
    }

    // verifica a senha "é segura"
    if (senha.trim().length < 3)
      return {ok: false, motivo: 'Senha tem que ter pelo menos 3 caracteres.'}
  

    try {
      const valido = await validaEmail(broker, email)
      if (valido.ok === false)
        return valido
    } catch (erro) {
      return {ok: false, motivo: 'Não conseguiu acessar servidor de validação de email'}
    }

    // insere os dados do usuário no banco
    const tokenConfirmacao: TokenUUID = uuidv4()

    try {
      const senhaCriptografada =  criptografa(senha)
      await insereNovoUsuario(email, nome, senhaCriptografada, tokenConfirmacao)
    } catch (erro) {
      return {ok: false, motivo: `Erro ao acessar banco: ${erro.message}`}
    }
    try {
      const tc: string = tokenUUIDoString(tokenConfirmacao)
      const link = `${origin}/confirma/${tc}`
      await enviaEmail(broker, email, `${nomeApp} :: confirme seu cadastro`, link)
      return {ok: true} 
    } catch (erro) {
      return {ok: false, motivo: 'Erro ao enviar e-mail de confirmação. Cadastre novamente'}
    }
  } catch (erro) {
    return {ok: false, motivo: `Erro ao acessar banco: ${erro.message}`}
  }
}

export async function recuperaSenha(broker: ServiceBroker, origin: string, nomeApp: string, email: Email): Promise<RespostaDeuNaoDeu> {
  try {
    const usuario: ?UsuarioDB = await leUsuario(email)

    if (usuario === undefined || usuario === null)
      return {ok: false, motivo: `E-mail ${emailToString(email)} não cadastrado`}

    if (!usuario.confirmado)
      return {ok: false, motivo: 'Usuário ainda não confirmou cadastro.'}
      
    const tokenNovaSenha = uuidv4()

    try {
      const campos: CamposAlteraveisUsuarioDB = {token: tokenNovaSenha}
      atualizaUsuario(email, campos)
    } catch(erro) {
      return {ok: false, motivo: `Erro ao acessar banco: ${erro.message}`}
    }
    try {
      const link = `${origin}/redefineSenha/${tokenNovaSenha}`
      await enviaEmail(broker, email, `${nomeApp} :: redefinindo senha`, link)
      return {ok: true}
    } catch(erro) {
      return {ok: false, motivo: `Erro ao enviar e-mail: ${erro.message}`}
    }
  } catch (erro) {
    return {ok: false, motivo: `Erro ao acessar o banco: ${erro.message}`}
  }
}


export async function confirma(token: TokenUUID): Promise<RespostaDeuNaoDeu> {
  try {
    const usuario: ?UsuarioDB = await leUsuarioComToken(token)

    if (usuario === undefined || usuario === null)
      return {ok: false, motivo: 'Não há usuário com token informado.'}

    const campos: CamposAlteraveisUsuarioDB = {confirmado: true, token: undefined}
    await atualizaUsuario(usuario.email, campos)
    return {ok: true}
  }
  catch (erro) {
    return {ok: false, motivo: `Erro ao acessar banco: ${erro.message}`}
  }
}


export async function confirmaTokenRedefinicao(tokenNovaSenha: TokenUUID): Promise<RespostaConfirmaTokenRedefinicao> {
  try {
    const usuario: ?UsuarioDB = await leUsuarioComToken(tokenNovaSenha)

    if (usuario === undefined || usuario === null)
      return {ok: false, motivo: 'Não há usuário com token informado.'}
    const novoToken = uuidv4()
    const campos: CamposAlteraveisUsuarioDB = {token: novoToken}
    atualizaUsuario(usuario.email, campos)
    return {ok: true, token: novoToken}
  }
  catch (erro) {
    return {ok: false, motivo: `Erro ao acessar o banco: ${erro.message}`}
  }
}

export async function alteraSenha(tokenNovaSenha: TokenUUID, senha: string): Promise<RespostaDeuNaoDeu> {
  try {
    const usuario: ?UsuarioDB = await leUsuarioComToken(tokenNovaSenha)

    if (usuario === undefined || usuario === null)
      return {ok: false, motivo: 'Não há usuário com este token'}

    const senhaCriptografada =  criptografa(senha)

    const campos: CamposAlteraveisUsuarioDB = {senha: senhaCriptografada, token: undefined}
    atualizaUsuario(usuario.email, campos)
    return {ok: true}
  }
  catch (erro) {
    return {ok: false, motivo: `Erro ao alterar a senha: ${erro.message}`}
  }
}


export async function pesquisaUsuario(token: TokenJWT, email: Email): Promise<RespostaPesquisaUsuario> {
  try {
    if (decodificaJWT(token) === null)
      return {ok: false, motivo: 'Token JWT inválido ou expirado'}

    const usuario: ?UsuarioDB = await leUsuario(email)

    if (usuario === undefined || usuario === null)
      return {ok: false, motivo: `E-mail ${emailToString(email)} não cadastrado`}
  
    if (usuario.confirmado === false)
      return {ok: false, motivo: `E-mail ${emailToString(email)} ainda não confirmado`}

    return {ok: true, nome: usuario.nome}

  } catch(erro) {
    return {ok: false, motivo: erro.message}
  }
}

export async function renovaToken(token: TokenJWT): Promise<RespostaRenovaToken> {
  try {
    const dados: TokenJWTDecodificado | null = decodificaJWT(token)
    if (dados == null)
      return null
    else {
      const dadosToken = {email: dados.email, nome: dados.nome}
      return jwt.sign(dadosToken, JWT_PASSWORD, {expiresIn: JWT_DURATION})
    }
  } catch (erro) {
    return null
  }
}

function criptografa(senha: string) {
  return crypto.pbkdf2Sync(senha, SALT, 1000, 64, 'sha512').toString('hex')
}

function geraTokenJWT(usuario: UsuarioDB): TokenJWT {
  const dadosToken = {
    email: usuario.email,
    nome: usuario.nome
  }

  return jwt.sign(dadosToken, JWT_PASSWORD, {expiresIn: JWT_DURATION})
}

export function decodificaJWT(token: TokenJWT): TokenJWTDecodificado | null {
  try {
    const dados: TokenJWTDecodificado = jwt.verify(token, JWT_PASSWORD)
    return dados
  } catch (e) {
    return null
  }
}