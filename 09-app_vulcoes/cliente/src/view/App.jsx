// @flow
import React, {useReducer, useEffect, useCallback} from 'react'
import jwt_decode from 'jwt-decode'

import type {Token, TokenDecodificado, ConectadoComBanco} from '../tipos'
import Login from './Login.jsx'
import CadastraVulcao from './CadastraVulcao.jsx'
import MostraVulcoes from './MostraVulcoes.jsx'
import ConexaoComBanco from './ConexaoComBanco.jsx'

import {leLimiteImagem, temConexaoComBanco} from '../servicos'

import 'bulma/css/bulma.min.css'

type Estado = {|
  token: Token  | void,
  tokenDecodificado: TokenDecodificado | void,
  limiteImagem: number,
  conectadoComBanco: ConectadoComBanco,
  saiu: boolean,
  novoToken: boolean
|}

type Acao =
    {| type: 'REGISTRE_LIMITE_IMAGEM', limite: number |}
  | {| type: 'REGISTRE_SE_CONECTADO_COM_BANCO', conectado: boolean |}
  | {| type: 'REGISTRE_TOKEN', token: Token | void |}
  | {| type: 'REGISTRE_NOVO_TOKEN', token: Token |}
  | {| type: 'REGISTRE_NOVO_TOKEN_SALVO' |}
  | {| type: 'REGISTRE_USUARIO_SAIU' |}


type Dispatch = Acao => void
type Modelo = [Estado, Dispatch]


const estadoInicial = {
  token: undefined,
  tokenDecodificado: undefined,
  limiteImagem: 5000,
  conectadoComBanco: undefined,
  saiu: false,
  novoToken: false
}


function reducer(estado: Estado, acao: Acao): Estado {
  switch (acao.type) {
  case 'REGISTRE_LIMITE_IMAGEM':
    return {...estado, limiteImagem: acao.limite}

  case 'REGISTRE_SE_CONECTADO_COM_BANCO':
    return {...estado, conectadoComBanco: acao.conectado}

  case 'REGISTRE_TOKEN': {
    const tokenDecodificado = acao.token !== undefined ? jwt_decode(acao.token) : undefined
    return {...estado, token: acao.token, tokenDecodificado, saiu: false}
  }

  case 'REGISTRE_NOVO_TOKEN': {
    const tokenDecodificado = jwt_decode(acao.token)
    return {...estado, token: acao.token, tokenDecodificado, saiu: false, novoToken: true}  
  }

  case 'REGISTRE_NOVO_TOKEN_SALVO':
    return {...estado, novoToken: false}

  case 'REGISTRE_USUARIO_SAIU': 
    return {...estado, token: undefined, tokenDecodificado: undefined, saiu: true}

  default:
    throw new Error(`acao.type inválido: ${acao.type}`)
  }
}

function tokenExpirou(tokenDecodificado: TokenDecodificado) {
  const agora: number = Date.now()
  const exp: number = tokenDecodificado.exp * 1000
  return agora >= exp
}

function useModelo(): Modelo {

  const [estado, dispatch] = useReducer(reducer, estadoInicial)

  useEffect(() => {
    if (estado.novoToken) {
      window.localStorage.setItem('token', estado.token)
      dispatch({type: 'REGISTRE_NOVO_TOKEN_SALVO'})
    }
  }, [estado.novoToken, estado.token])

  useEffect(() => {
    if (estado.saiu)
      window.localStorage.removeItem('token')
  }, [estado.saiu])

  useEffect(() => {
    let token = window.localStorage.getItem('token')

    if (token === null)
      token = undefined
    else {
      const tokenDecodificado: TokenDecodificado = jwt_decode(token)
      if (tokenExpirou(tokenDecodificado)) {
        token = undefined
        window.localStorage.removeItem('token')
      }
    }
    dispatch({type: 'REGISTRE_TOKEN', token})
  }, [])

  useEffect(() => {
    leLimiteImagem()
      .then(limite => dispatch({type: 'REGISTRE_LIMITE_IMAGEM', limite}))
      .catch(() => {
        // eslint-disable-next-line no-console
        console.warn('Não consegui obter limite das imagens do servidor. Usando valor 10000')
        dispatch({type: 'REGISTRE_LIMITE_IMAGEM', limite: 10000})
      })
    temConexaoComBanco()
      .then(resposta => dispatch({type: 'REGISTRE_SE_CONECTADO_COM_BANCO', conectado: resposta.ok}))
      .catch(() => dispatch({type: 'REGISTRE_SE_CONECTADO_COM_BANCO', conectado: false}))

  }, [])

  return [estado, dispatch]
}


function App (): React$Element<'div'> {
  const [estado, dispatch] = useModelo()
  
  const onToken = useCallback((token) => dispatch({type: 'REGISTRE_NOVO_TOKEN', token}), [dispatch])
  const onSaiu = useCallback(() => dispatch({type: 'REGISTRE_USUARIO_SAIU'}), [dispatch])

  return (
    <div className='container is-fluid'>
      <div className='message'>
        <div className='message-header'>
            UFSC - CTC - INE - INE5646 :: App vulcões
        </div>
        <div className='message-body'>
          <ConexaoComBanco conectado={estado.conectadoComBanco}/>
          {
            estado.conectadoComBanco &&
              <Login onToken={onToken}
                onSaiu={onSaiu}
                token={estado.token}
                tokenDecodificado={estado.tokenDecodificado}/>
          }
          {
            estado.token && estado.conectadoComBanco &&
              <div>
                <CadastraVulcao token={estado.token}
                  onTokenInvalido={() => dispatch({type: 'REGISTRE_USUARIO_SAIU'})}
                  limiteImagem={estado.limiteImagem}/>
                <MostraVulcoes token={estado.token}
                  onTokenInvalido={() => dispatch({type: 'REGISTRE_USUARIO_SAIU'})}/>
              </div>
          }
        </div>
      </div>
    </div>
  )
  
}

export default App
