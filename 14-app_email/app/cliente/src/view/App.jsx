// @flow
import React, {useReducer, useEffect} from 'react'
import jwt_decode from 'jwt-decode'
import 'bulma/css/bulma.min.css'

import NavBar from './NavBar.jsx'
import Login from './Login.jsx'
import EnviaEmail from './EnviaEmail.jsx'
import MostraEmailsEnviados from './MostraEmailsEnviados.jsx'
import RemoveUsuario from './RemoveUsuario.jsx'
import Aviso from './Aviso.jsx'

import {tokenExpirou} from '../model/util'

import {obtemConfiguracao} from '../model/servicos'

import type {OpcaoMenu} from './NavBar.jsx'

import type {TokenJWT, Configuracao} from '../tipos-flow'

import {stringToTokenJWT} from '../tipos-flow'

type Estado = {|
  servidorOk: boolean,
  configuracao: Configuracao | void,
  token: TokenJWT | void,
  tokenExpirado: boolean,
  executando: OpcaoMenu | void
|}

type Acao =
    {| type: 'REGISTRE_CONFIGURACAO', configuracao: Configuracao |}
  | {| type: 'REGISTRE_SEM_SERVIDOR' |}
  | {| type: 'REGISTRE_TOKEN', token: TokenJWT |}
  | {| type: 'USUARIO_REMOVIDO' |}
  | {| type: 'DESISTIU_DE_REMOVER'|}
  | {| type: 'EXECUTE_OPCAO', opcao: OpcaoMenu |}
  | {| type: 'TOKEN_EXPIROU' |}

type Dispatch = Acao => void
type Modelo = [Estado, Dispatch]


const estadoInicial: Estado = {
  servidorOk: true,
  configuracao: undefined,
  token: undefined,
  tokenExpirado: false,
  executando: undefined
}


function reducer(estado: Estado, acao: Acao): Estado {
  switch (acao.type) {
  case 'REGISTRE_CONFIGURACAO':
    return {...estado, configuracao: acao.configuracao}

  case 'REGISTRE_SEM_SERVIDOR':
    return {...estado, servidorOk: false}

  case 'EXECUTE_OPCAO': {
    switch (acao.opcao) {
    case 'SAIR':
      return {...estadoInicial, configuracao: estado.configuracao}

    case 'REMOVER_USUARIO':
      return {...estado, executando: 'REMOVER_USUARIO'}
      
    case 'ENVIAR_MSG':
      return {...estado, executando: 'ENVIAR_MSG'}

    case 'LER_MSGS':
      return {...estado, executando: 'LER_MSGS'}
      
    default:
      throw new Error(`Erro: Opção de menu não tratada: ${acao.opcao}`)
    }
  }

  case 'REGISTRE_TOKEN':
    return {...estado, token: acao.token, tokenExpirado: false}
  

  case 'TOKEN_EXPIROU':
    return {...estado, token: undefined, tokenExpirado: true, executando: undefined}
    
  case 'DESISTIU_DE_REMOVER':
    return {...estado, executando: undefined}

  case 'USUARIO_REMOVIDO':
    return {...estadoInicial, configuracao: estado.configuracao}

  default:
    throw new Error(`acao.type inválido: ${acao.type}`)
  }
}

function useModelo(): Modelo {

  const [estado, dispatch] = useReducer(reducer, estadoInicial)

  useEffect(() => {
    obtemConfiguracao()
      .then(r => r.ok 
        ? dispatch({type: 'REGISTRE_CONFIGURACAO', configuracao: r.configuracao})
        : dispatch({type: 'REGISTRE_SEM_SERVIDOR'})
      )
      .catch(() => dispatch({type: 'REGISTRE_SEM_SERVIDOR'}))
  }, [])

  useEffect(() => {
    if (estado.token !== undefined && tokenExpirou(estado.token)) {
      dispatch({type: 'TOKEN_EXPIROU'})
    }
  })
  return [estado, dispatch]
}


function App (): React$Element<'div'> {
  const [estado, dispatch] = useModelo()
  
  let exibir
  let identificacao
  const MAX_MSGS_LIDAS: number = estado.configuracao === undefined ? 0 : estado.configuracao.MAX_MSGS_LIDAS

  if (estado.servidorOk && estado.configuracao === undefined)
    exibir =<Aviso msg='Carregando. Aguarde...'/>
  else {
    if (!estado.servidorOk) {
      exibir = <Aviso msg='Sem comunicação com o servidor. Acesse novamente dentro de algum tempo.'/> 

    } else {
      if (estado.token === undefined) {
        if (estado.tokenExpirado)
          exibir = <div>
            <Aviso msg='Sessão expirada. Faça novo login.'/> 
            <button className='button is-warning' onClick={() => dispatch({type: 'USUARIO_REMOVIDO'})}>
          Login
            </button> 
          </div>
        else
          exibir =  <Login onToken={(token) => dispatch({type: 'REGISTRE_TOKEN', token})}/>
      } else {
        const {email, nome} = jwt_decode(estado.token)
        identificacao = <span className='tag is-danger'>{email} ({nome})</span>
        switch (estado.executando) {
        case undefined: {
          exibir = null
          break
        }
        case 'REMOVER_USUARIO': {
          exibir = <RemoveUsuario 
            token={estado.token || stringToTokenJWT('')} 
            onDesistiu={() => dispatch({type: 'DESISTIU_DE_REMOVER'})}
            onRemoveu={() => dispatch({type: 'USUARIO_REMOVIDO'})}/>
          break
        }
        case 'ENVIAR_MSG': {
          exibir = <EnviaEmail 
            token={estado.token || stringToTokenJWT('')} 
            onNovoToken={token => dispatch({type: 'REGISTRE_TOKEN', token})}
            onTokenExpirou={() => dispatch({type: 'TOKEN_EXPIROU'})}/>
          break
        }
        case 'LER_MSGS': {
          exibir =  <MostraEmailsEnviados 
            maxMsgsLidas={MAX_MSGS_LIDAS}
            token={estado.token || stringToTokenJWT('')}
            onNovoToken={token => dispatch({type: 'REGISTRE_TOKEN', token})}
            onTokenExpirou={() => dispatch({type: 'TOKEN_EXPIROU'})}/>
          break
        }
        }
      }
    }
  }

  return (
    <div className='container is-fluid'>
      <div className='message has-background-grey-light'>
        <div className='message-header'>
            UFSC - CTC - INE - INE5646 :: App Email {identificacao}
        </div>
        <div className='message-body'>
          { estado.token !== undefined &&
            <NavBar onOpcaoSelecionada= {(opcao: OpcaoMenu) => dispatch({type: 'EXECUTE_OPCAO', opcao})}/>
          }
          {exibir}
        </div>
      </div>
    </div>
  )
  
}

export default App
