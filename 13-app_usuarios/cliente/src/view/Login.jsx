//@flow
import firebaseObj from 'firebase/app'
import 'firebase/auth'

import React, {useReducer, useEffect} from 'react'

import BulmaInput from './ui/BulmaInput.jsx'
import BulmaButton from './ui/BulmaButton.jsx'
import BulmaMessage from './ui/BulmaMessage.jsx'
import BulmaNotification from './ui/BulmaNotification.jsx'

import {enviaComando, enviaConsulta} from '../model/servicos'
import {validaEmail, msgErroSignInWithEmailAndPassword} from './util'

import type {IdTokenResult, Config, Firebase} from '../tipos_flow'

type Props = {| 
  optIdTokenResult: void | IdTokenResult,
  onUserIn: IdTokenResult => void, 
  onUserOut: void => void,
  onPapeisPossiveis: Array<string> => void
|}

type Estado = {|
  optFirebase: void | Firebase,
  email: string,
  senha: string,
  optMsg: void | string,
  fazendoLogin: boolean,
  fazendoLogout: boolean,
  enviandoSenhaPorEmail: boolean
|}

type Acao = 
    {| type: 'REGISTRE_CONFIGURACAO', config: Config, onChangeUserStatus: any => void |}
  | {| type: 'ARMAZENE_EMAIL', email: string |}
  | {| type: 'ARMAZENE_SENHA', senha: string |}

  | {| type: 'FACA_LOGIN' |}
  | {| type: 'REGISTRE_LOGIN_CONCLUIDO' |}
  | {| type: 'REGISTRE_ERRO_NO_LOGIN', code: string |}

  | {| type: 'FACA_LOGOUT' |}
  | {| type: 'REGISTRE_LOGOUT_CONCLUIDO' |}
  | {| type: 'REGISTRE_ERRO_NO_LOGOUT', msg: string |}

  | {| type: 'ENVIE_SENHA_POR_EMAIL' |}
  | {| type: 'REGISTRE_SENHA_ENVIADA' |}
  | {| type: 'REGISTRE_ERRO_AO_ENVIAR_SENHA', msg: string |}

 
const estadoInicial: Estado = {
  optFirebase: undefined,
  email: '',
  senha: '',
  optMsg: undefined,
  fazendoLogin: false,
  fazendoLogout: false,
  enviandoSenhaPorEmail: false
}
  
function reducer(estado: Estado, acao: Acao): Estado {
  switch (acao.type) {
  case 'REGISTRE_CONFIGURACAO': {
    firebaseObj.initializeApp(acao.config.firebaseConfig)
    firebaseObj.auth().onAuthStateChanged(acao.onChangeUserStatus)
    return {...estado, optFirebase: firebaseObj}
  }
  
  case 'ARMAZENE_EMAIL':
    return {...estado, email: acao.email, optMsg: undefined}

  case 'ARMAZENE_SENHA':
    return {...estado, senha: acao.senha, optMsg: undefined}
  
    
  case 'FACA_LOGIN':
    return {...estado, fazendoLogin: true, optMsg: 'Fazendo login...'}

  case 'REGISTRE_LOGIN_CONCLUIDO':
    return {...estado, fazendoLogin: false, optMsg: undefined}
        
  case 'REGISTRE_ERRO_NO_LOGIN': 
    return {...estado, fazendoLogin: false, optMsg: msgErroSignInWithEmailAndPassword(acao.code)}
  
  
  case 'FACA_LOGOUT':
    return {...estado, fazendoLogout: true, optMsg: 'Fazendo logout...'}

  case 'REGISTRE_LOGOUT_CONCLUIDO':
    return {...estadoInicial, optFirebase: estado.optFirebase}
    
  case 'REGISTRE_ERRO_NO_LOGOUT':
    return {...estado, fazendoLogout: false, optMsg: acao.msg}
                
  
  case 'ENVIE_SENHA_POR_EMAIL':
    return {...estado, enviandoSenhaPorEmail: true, optMsg: 'Enviando senha para seu e-mail...'}

  case 'REGISTRE_SENHA_ENVIADA':
    return {...estado, enviandoSenhaPorEmail: false, optMsg: 'A nova senha foi enviada para o seu e-mail'}
                
  case 'REGISTRE_ERRO_AO_ENVIAR_SENHA':
    return {...estado, enviandoSenhaPorEmail: false, optMsg: acao.msg}


  default:
    throw new Error(`BUG: acao.type inválido: ${acao.type}`)
  }
}
 
function useModelo(props: Props) {

  const [estado, dispatch] = useReducer(reducer, estadoInicial)

  // Efeito para obter configuracao
  useEffect(() => {
    // firebase detectou mudança no estado do usuário logado
    function mudouStatusDoUsuario(novoUsuario) {
      let idTokenResultDoUsuario
      if (novoUsuario) {
        novoUsuario.getIdTokenResult(true)
          .then(idTokenResult => {
            idTokenResultDoUsuario = idTokenResult
            return enviaComando('RegistrarLogin', {idToken: idTokenResult.token})
          })
          .then(resposta => {
            if (resposta.ok) {
              dispatch({type: 'REGISTRE_LOGIN_CONCLUIDO'})
              props.onUserIn(idTokenResultDoUsuario)
            }
            else {
              estado.optFirebase !== undefined && estado.optFirebase.auth().signOut()
            }
          })
          .catch(erro => dispatch({type: 'REGISTRE_ERRO_NO_LOGIN', code: erro.message}))
      } else {
        dispatch({type: 'REGISTRE_LOGOUT_CONCLUIDO'})
        props.onUserOut()
      }
    }

    if (estado.optFirebase === undefined) {   
      enviaConsulta('PesquisaConfig')
        .then(config => {
          dispatch({type: 'REGISTRE_CONFIGURACAO', config, onChangeUserStatus: mudouStatusDoUsuario})
          props.onPapeisPossiveis(config.papeisPossiveis)
        })
    }
  })

  // Efeito para fazer login
  useEffect(() => {
    if (estado.fazendoLogin) {
      estado.optFirebase !== undefined && estado.optFirebase.auth()
        .signInWithEmailAndPassword(estado.email, estado.senha)
        .catch(erro => dispatch({type: 'REGISTRE_ERRO_NO_LOGIN', code: erro.code})) 
    }
  })


  // Efeito para fazer logout
  useEffect(() => {
    if (estado.fazendoLogout) {
      // Obs: props.idTokenResulta nunca será undefined nesse momento. Testei apenas para enganar o flow 
      const idToken = props.optIdTokenResult !== undefined ? props.optIdTokenResult.token : '' 
      enviaComando('RegistrarLogout', {idToken})
        .then(resposta => {
          if (resposta.ok && estado.optFirebase !== undefined)
            estado.optFirebase.auth().signOut()
          // .then(() => dispatch({type: 'REGISTRE_LOGOUT_CONCLUIDO'}))
          // .catch (erro =>  dispatch({type: 'REGISTRE_ERRO_NO_LOGOUT', msg: erro.message}))
          else
            dispatch({type: 'REGISTRE_ERRO_NO_LOGOUT', msg: resposta.msg})
        })
        .catch(erro =>  dispatch({type: 'REGISTRE_ERRO_NO_LOGOUT', msg: erro.message}))
    }
  })


  // Efeito para enviar e-mail
  useEffect(() => {
    if (estado.enviandoSenhaPorEmail) {
      estado.optFirebase !== undefined && estado.optFirebase.auth().sendPasswordResetEmail(estado.email)
        .then(() => dispatch({type: 'REGISTRE_SENHA_ENVIADA'}))
        .catch(erro => dispatch({type: 'REGISTRE_ERRO_AO_ENVIAR_SENHA', msg: erro.message}))
    }
  })

  return [estado, dispatch]
}

//
//
// *************************************
//
//

function Login (props: Props): React$Element<'div'> {

  const [estado, dispatch] = useModelo(props)

  let conteudo
  let titulo

  if (props.optIdTokenResult) {
    titulo = props.optIdTokenResult.claims.email
    conteudo = 
      <div>
        <BulmaButton color='is-black' disabled={false}
          onClick={() => dispatch({type: 'FACA_LOGOUT'})}
          label='Sair'/>
      </div>
  }
  else {
    titulo = 'Usuário'
    conteudo = 
      <div>
        <BulmaInput 
          label='E-mail'
          value={estado.email} 
          isPassword={false} 
          onChange={(email) => dispatch({type: 'ARMAZENE_EMAIL', email})}/>
        <BulmaInput 
          label='Senha' 
          value={estado.senha}
          isPassword={true} 
          onChange={(senha) => dispatch({type: 'ARMAZENE_SENHA', senha})}/>

        <p>
          <BulmaButton
            color='is-primary'
            onClick={() => dispatch({type: 'FACA_LOGIN'})}
            label='Login'
            disabled={estado.senha.length === 0 || !validaEmail(estado.email)}/>
          <BulmaButton
            color='is-info'
            onClick={() => dispatch({type: 'ENVIE_SENHA_POR_EMAIL'})}
            label='Esqueci a senha'
            disabled={!validaEmail(estado.email)}/>
        </p>
      </div>
  }
  
  const notificacao = estado.optMsg === undefined
    ? null
    : <BulmaNotification color='is-warning' message={estado.optMsg}/>

  return (
    <div className='box'>
      <BulmaMessage color='is-primary' title={titulo}>
        {conteudo}
        {notificacao}
      </BulmaMessage>
    </div>
  )
}


export default Login
