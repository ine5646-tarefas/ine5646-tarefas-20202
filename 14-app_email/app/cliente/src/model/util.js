//@flow
import type {TokenJWT} from '../tipos-flow'

import jwt_decode from 'jwt-decode'

export function tokenExpirou(token: TokenJWT): boolean {
  const agora = Date.now()
  const tokenExpiraEm = jwt_decode(token).exp * 1000

  return tokenExpiraEm <= agora
}

export function tokenExpiraraEm(token: TokenJWT, segundos: number): boolean {
  const agora = Date.now() + (segundos * 1000)
  const tokenExpiraEm = jwt_decode(token).exp * 1000

  return tokenExpiraEm <= agora
}