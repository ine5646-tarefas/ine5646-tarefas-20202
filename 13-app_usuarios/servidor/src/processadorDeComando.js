//@flow
import {validaIdToken, cadastraUsuario} from './fbadmin'
import {registraEvento} from './registradorDeEvento'

import type {Comando, Evento, UId, PapelUsuario, RespostaComando} from './tipos_flow'

export function processaComando (comando: Comando): Promise<RespostaComando> {
  return validaIdToken(comando.idToken)
    .then(idTokenDecodificado => {
      switch (comando.type) {
      case 'RegistrarLogin':
        return cmdRegistrarLogin(idTokenDecodificado.uid)
      case 'RegistrarLogout':
        return cmdRegistrarLogout(idTokenDecodificado.uid)
      case 'CadastrarUsuario':
        return cmdCadastrarUsuario(idTokenDecodificado, comando.email, comando.papeis)
      default:
        return {ok: false, msg: `Comando ${comando} desconhecido`}
      }
    })
    .catch(erro => {
      return {ok: false, msg: erro.message}
    })
}

function cmdCadastrarUsuario (idTokenDecodificado, email: string, papeis: [PapelUsuario]) {
  return cadastraUsuario(idTokenDecodificado, email, papeis)
    .then(() => {
      const evento: Evento = {
        ev: 'UsuarioCadastrado',
        email,
        papeis,
        uid: idTokenDecodificado.uid}

      registraEvento(evento)
      return {ok: true}
    })
    .catch(erro => ({ok: false, msg: erro.message}))
}

function cmdRegistrarLogin (uid: UId) {
  registraEvento(({ev: 'LoginRegistrado', uid}: Evento))
  return {ok: true}
}

function cmdRegistrarLogout (uid: UId) {
  registraEvento(({ev: 'LogoutRegistrado', uid}: Evento))
  return {ok: true}
}
