//@flow
import React, {useEffect, useReducer} from 'react'
import jwt_decode from 'jwt-decode'

import Login from './Login.jsx'
import PublicaLembrete from './PublicaLembrete.jsx'
import MostraLembretes from './MostraLembretes.jsx'

import 'bulma/css/bulma.min.css'

import type {Token, TokenDecodificado} from '../tipos_flow'

type Estado = {|
  token: Token | void,
  tokenDecodificado: TokenDecodificado | void
|}

type Acao = 
    {| type: 'REGISTRE_TOKEN', token: Token, tokenDecodificado: TokenDecodificado |}
  | {| type: 'RECEBA_NOVO_TOKEN', token: Token |}
  | {| type: 'REGISTRE_USUARIO_SAIU' |}

const estadoInicial: Estado = {
  token: undefined,
  tokenDecodificado: undefined
}

function reducer(estado: Estado, acao: Acao): Estado {
  switch (acao.type) {
  case 'REGISTRE_TOKEN':
    return {token: acao.token, tokenDecodificado: acao.tokenDecodificado}    
  
  case 'RECEBA_NOVO_TOKEN': 
    return {token: acao.token, tokenDecodificado: jwt_decode(acao.token)}
  
  case 'REGISTRE_USUARIO_SAIU':
    return estadoInicial

  default:
    throw new Error(`BUG: acao.type inválido: ${acao.type}`)
  }
}

function tokenValido(tokenDecodificado: TokenDecodificado): boolean {
  const agora: number = Date.now()
  const exp = tokenDecodificado.exp * 1000
  return agora < exp
}

function App (): React$Element<'div'> {
  const [estado, dispatch] = useReducer(reducer, estadoInicial)

  useEffect(() => {
    let token = window.localStorage.getItem('token')
    let tokenDecodificado

    if (token === null)
      token = undefined
    else {
      tokenDecodificado = jwt_decode(token)
      if (tokenValido(tokenDecodificado))
        dispatch({type: 'REGISTRE_TOKEN', token, tokenDecodificado})
      else
        window.localStorage.removeItem('token')
    }
  }, [])

  useEffect(() => {
    if (estado.token !== undefined) {
      window.localStorage.setItem('token', estado.token)
    }
    else {
      window.localStorage.removeItem('token')
    }
  }, [estado.token])


  return (
    <div className='container is-fluid'>
      <div className='message'>
        <div className='message-header'>
            UFSC - CTC - INE - INE5646 :: App lembretes
        </div>
        <div className='message-body'>
          <Login onToken={token => dispatch({type: 'RECEBA_NOVO_TOKEN', token})}
            onSaiu={() => dispatch({type: 'REGISTRE_USUARIO_SAIU'})}
            token={estado.token}
            tokenDecodificado={estado.tokenDecodificado}/>
          {
            estado.token &&
              <PublicaLembrete token={estado.token}
                onTokenInvalido={() => dispatch({type: 'REGISTRE_USUARIO_SAIU'})}/>
          }
          {
            estado.token &&
              <MostraLembretes token={estado.token}
                onTokenInvalido={() => dispatch({type: 'REGISTRE_USUARIO_SAIU'})}/>
          }
        </div>
      </div>
    </div>
  )
}

export default App
