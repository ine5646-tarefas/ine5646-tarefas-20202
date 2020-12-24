// @flow
import * as React from 'react'
import type {ConectadoComBanco} from '../tipos'

type Props = {|
  conectado: ConectadoComBanco
|}

const ConexaoComBanco = (props: Props): React$Element<'div'> | null => {
  let conteudo

  if (props.conectado)
    conteudo = null
  else {
    if (props.conectado === undefined)
      conteudo =
        <div className='notification is-warning'>
          verificando conexão com o banco...
        </div>
    else {
      conteudo =
        <div className='notification is-danger'>
          sem conexão com o banco de dados...
        </div>
    }
  }
  return conteudo
}

export default ConexaoComBanco
