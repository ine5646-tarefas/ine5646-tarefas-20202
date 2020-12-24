//@flow

import {SENHA_JWT, DURACAO_JWT} from './env'
import jwt from 'jsonwebtoken'
import type {Token, TokenDecodificado} from './tipos_flow'

function geraToken (login: string): Token {
  return jwt.sign({ login }, SENHA_JWT, { expiresIn: DURACAO_JWT })
}

function validaToken (token: Token): TokenDecodificado | null {
  try {
    const dados: TokenDecodificado = jwt.verify(token, SENHA_JWT)
    return dados
  } catch (e) {
    return null
  }
}

export { geraToken, validaToken }
