// @flow
import {SENHA_JWT, DURACAO_TOKEN} from './env'
import jwt from 'jsonwebtoken'
import type {Token, TokenDecodificado} from './tipos'

function geraToken (login: string): Token {
  return jwt.sign({ login }, SENHA_JWT, { expiresIn: DURACAO_TOKEN })
}

function validaToken (token: Token): TokenDecodificado | null {
  try {
    const dados = jwt.verify(token, SENHA_JWT)
    return dados
  } catch (e) {
    return null
  }
}

export { geraToken, validaToken }
