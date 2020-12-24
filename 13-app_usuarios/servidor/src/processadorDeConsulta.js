//@flow
import type {Consulta, PapelUsuario, RespostaConsulta} from './tipos_flow'

import {validaIdToken, obtemUsuarios, firebaseConfig} from './fbadmin'

export function processaConsulta (consulta: Consulta): Promise<RespostaConsulta> {
  if (consulta.type === 'PesquisaConfig')
    return Promise.resolve({ok: true, firebaseConfig, papeisPossiveis: obtemPapeisPossiveis()})

  return validaIdToken(consulta.idToken)
    .then(idTokenDecodificado => {
      switch (consulta.type) {
      case 'PesquisaUsuarios':
        return cstPesquisaUsuarios(idTokenDecodificado)
      default:
        throw new Error(`Consulta ${consulta.type} desconhecida`)
      }
    })
    .catch(erro => {
      return ({ok: false, msg: erro.message})
    })
}

// Melhor seria se papéis viessem de um banco de dados
function obtemPapeisPossiveis () {
  const p1: PapelUsuario = 'aluno'
  const p2: PapelUsuario = 'professor'

  return [p1, p2]
}

function cstPesquisaUsuarios (idTokenDecodificado) {
  return obtemUsuarios(idTokenDecodificado)
    .then(usuarios => ({ok: true, usuarios}))
}
