//@flow

import React, {useReducer, useEffect} from 'react'

import {recuperaSenha, fazLogin, cadastra} from '../model/servicos'

import type {Email, TokenJWT} from '../tipos-flow'

import { stringToEmail, emailToString, tamanhoEmail } from '../tipos-flow'

import Aviso from './Aviso.jsx'

type Situacao = 'logando' | 'cadastrando' | 'recuperando'

type Estado = {|
  situacao: Situacao,
  novoUsuario: boolean,
  esqueciASenha: boolean,
  nome: string,
  email: Email,
  senha: string,
  confirmaSenha: string,
  executandoAcao: boolean,
  msg: string | void  
|}

type Acao =
    {| type: 'REGISTRE_EMAIL', email: Email |}
  | {| type: 'REGISTRE_NOME', nome: string |}
  | {| type: 'REGISTRE_SENHA', senha: string |}
  | {| type: 'REGISTRE_ESQUECI_A_SENHA' |}
  | {| type: 'REGISTRE_CONFIRMA_SENHA', confirmaSenha: string |}
  | {| type: 'EXECUTE_ACAO' |}
  | {| type: 'REGISTRE_NOVO_USUARIO' |}
  | {| type: 'EMAIL_ENVIADO' |}
  | {| type: 'REGISTRE_MSG', mensagem: string |}

type Dispatch = Acao => void

const estadoInicial: Estado = {
  situacao: 'logando',
  novoUsuario: false,
  esqueciASenha: false,
  email: stringToEmail(''),
  nome: '',
  senha: '',
  confirmaSenha: '',
  executandoAcao: false,
  msg: undefined
}

function reducer(estadoAtual: Estado, acao: Acao): Estado {
  switch (acao.type) {
  case 'REGISTRE_NOVO_USUARIO': {
    if (estadoAtual.novoUsuario === false)
      return {...estadoAtual, situacao: 'cadastrando', novoUsuario: true, msg: undefined}
    else
      return {...estadoAtual, situacao: 'logando', novoUsuario: false, msg: undefined}
  }

  case 'REGISTRE_ESQUECI_A_SENHA': {
    if (estadoAtual.esqueciASenha === false) {
      return {...estadoAtual, esqueciASenha: true, situacao: 'recuperando', msg: undefined}
    } else {
      return {...estadoAtual, esqueciASenha: false, situacao: 'logando', msg: undefined}
    }
  }

  case 'REGISTRE_EMAIL':
    return {...estadoAtual, email: acao.email, msg: undefined}
    
  case 'REGISTRE_NOME':
    return {...estadoAtual, nome: acao.nome, msg: undefined}
      
  case 'REGISTRE_SENHA':
    return {...estadoAtual, senha: acao.senha, msg: undefined}
        
  case 'REGISTRE_CONFIRMA_SENHA':
    return {...estadoAtual, confirmaSenha: acao.confirmaSenha, msg: undefined}
                
  case 'EXECUTE_ACAO':
    return {...estadoAtual, executandoAcao: true, msg: 'Aguarde...'}

  case 'EMAIL_ENVIADO':
    return {...estadoInicial, email: estadoAtual.email, msg: `Acesse e-mail ${emailToString(estadoAtual.email)} para recuperar a senha`}

  case 'REGISTRE_MSG':
    return {...estadoAtual, msg: acao.mensagem, executandoAcao: false}

  default:
    throw new Error(`acao.type inválido: ${acao.type}`)
  }
}

function useModelo(onToken: TokenJWT => void): [Estado, Dispatch] {
  const [estado, dispatch] = useReducer(reducer, estadoInicial)


  useEffect(() => {
    if (estado.executandoAcao) {
      switch (estado.situacao) {
      case 'recuperando': {
        recuperaSenha(estado.email)
          .then(resposta => {
            if (resposta.ok) {
              dispatch({type: 'EMAIL_ENVIADO'})
            } else {
              dispatch({type: 'REGISTRE_MSG', mensagem: resposta.motivo})
            }
          })
          .catch(erro => dispatch({type: 'REGISTRE_MSG', mensagem: erro.message}))
        break
      }

      case 'logando': {
        fazLogin(estado.email, estado.senha)
          .then(resposta => {
            if (resposta.ok) {
              dispatch({type: 'REGISTRE_MSG', mensagem: 'Login aceito.'})
              onToken(resposta.token)
            }
            else
              dispatch({type: 'REGISTRE_MSG', mensagem: resposta.motivo})
          })
          .catch(erro => dispatch({type: 'REGISTRE_MSG', mensagem: erro.message}))

        break
      }

      case 'cadastrando': {
        cadastra(estado.email, estado.nome, estado.senha)
          .then(resposta => {
            if (resposta.ok) {
              dispatch({type: 'REGISTRE_MSG', mensagem: `Acesse ${emailToString(estado.email)} para confirmar cadastro.`})
            }
            else
              dispatch({type: 'REGISTRE_MSG', mensagem: resposta.motivo})
          })
          .catch(erro => dispatch({type: 'REGISTRE_MSG', mensagem: erro.message}))

        break
      }
      }
    }
  }, [estado.executandoAcao, estado.situacao, estado.email, estado.nome, onToken, estado.senha])

  return [estado, dispatch]
}

type Props = {|
  onToken: TokenJWT => void,
|}

export default function Login(props: Props): React$Element<'div'> {
  const [estado, dispatch] = useModelo(props.onToken)

  function desabilitaAcao() {
    if (estado.executandoAcao)
      return true
      
    switch (estado.situacao) {
    case 'cadastrando': {
      if (tamanhoEmail(estado.email) === 0 || 
          estado.nome.trim() === '' || estado.senha.trim() === '' || estado.senha !== estado.confirmaSenha)
        return true
      return false
    }

    case 'logando': {
      if (tamanhoEmail(estado.email) === 0 || estado.senha.trim() === '')
        return true
      return false
    }

    case 'recuperando':
      if (tamanhoEmail(estado.email) === 0)
        return true
      return false
    }
  }

  let conteudo
  let nomeBotao

  switch (estado.situacao) {
  
  case 'logando': {
    conteudo = <Loga 
      novoUsuario={estado.novoUsuario}
      onChangeNovoUsuario={() => dispatch({type: 'REGISTRE_NOVO_USUARIO'})}
      email={estado.email}
      onChangeEmail={email => dispatch({type: 'REGISTRE_EMAIL', email})}
      senha={estado.senha}
      onChangeSenha={senha => dispatch({type: 'REGISTRE_SENHA', senha})}
      esqueciASenha={estado.esqueciASenha}
      onChangeEsqueciASenha={() => dispatch({type: 'REGISTRE_ESQUECI_A_SENHA'})}
    />
    nomeBotao = 'Fazer login'
    break
  }

  case 'cadastrando': {
    conteudo = <Cadastra 
      novoUsuario={estado.novoUsuario}
      onChangeNovoUsuario={() => dispatch({type: 'REGISTRE_NOVO_USUARIO'})}
      email={estado.email}
      onChangeEmail={email => dispatch({type: 'REGISTRE_EMAIL', email})}
      nome={estado.nome}
      onChangeNome={nome => dispatch({type: 'REGISTRE_NOME', nome})}
      senha={estado.senha}
      onChangeSenha={senha => dispatch({type: 'REGISTRE_SENHA', senha})}
      confirmaSenha={estado.confirmaSenha}
      onChangeConfirmaSenha={confirmaSenha => dispatch({type: 'REGISTRE_CONFIRMA_SENHA', confirmaSenha})}
    />
    nomeBotao = 'Cadastrar usuário'
    break
  }

  case 'recuperando': {
    conteudo = <Recupera 
      email={estado.email} 
      esqueciASenha={estado.esqueciASenha} 
      onChangeEmail={email => dispatch({type: 'REGISTRE_EMAIL', email})}
      onChangeEsqueciASenha={() => dispatch({type: 'REGISTRE_ESQUECI_A_SENHA'})} 
    />
    nomeBotao = 'Recuperar senha via e-mail'
    break
  }
  }

  return <div className='message is-info'>
    <div className='message-header'>
      Login
    </div>
    <div className='message-body'>
      {conteudo}

      <Aviso msg={estado.msg}/>
      
      <button 
        className='button is-primary'
        disabled={desabilitaAcao()} 
        onClick={() => dispatch({type: 'EXECUTE_ACAO'})}>
        {nomeBotao}
      </button>
    </div>
  </div>
}


type PropsRecupera = {|
  email: Email,
  esqueciASenha: boolean,
  onChangeEmail: Email => void,
  onChangeEsqueciASenha: () => void  
|}

function Recupera(props: PropsRecupera) {
  return <div className='field'>    
    <label className='label is-link'>
      Esqueci a senha
      <input 
        type='checkbox' 
        value={props.esqueciASenha} 
        checked={props.esqueciASenha} 
        onChange={() => props.onChangeEsqueciASenha()}/>    
    </label>
    <label className='label'>Seu e-mail</label>
    <input 
      className='input' 
      type='text' 
      value={props.email} 
      onChange={ev => props.onChangeEmail(ev.target.value)}/>
  </div>

}

type PropsCadastra = {|
  novoUsuario: boolean,
  onChangeNovoUsuario: () => void,
  email: Email,
  onChangeEmail: Email => void,
  nome: string,
  onChangeNome: string => void,
  senha: string,
  onChangeSenha: string => void,
  confirmaSenha: string,
  onChangeConfirmaSenha: string => void
|}

function Cadastra(props: PropsCadastra) {
  return <div className='field'>
    <label className='label'>
      Novo Usuário
      <input 
        type='checkbox' 
        value={props.novoUsuario}
        checked={props.novoUsuario}
        onChange={() => props.onChangeNovoUsuario()}/>  
    </label>
    <label className='label'>E-mail</label>
    <input 
      className='input' 
      type='text' value={props.email} 
      onChange={ev => props.onChangeEmail(ev.target.value)}/>
    <label className='label'>Nome</label>
    <input 
      className='input' 
      type='text' value={props.nome} 
      onChange={ev => props.onChangeNome(ev.target.value)}/>
    <label className='label'>Senha</label>
    <input 
      className='input' 
      type='password' 
      value={props.senha} 
      onChange={ev => props.onChangeSenha(ev.target.value)}/>
    <label className='label'>Confirma senha</label>
    <input 
      className='input' 
      type='password' 
      value={props.confirmaSenha} 
      onChange={ev => props.onChangeConfirmaSenha(ev.target.value)}/>
  </div>
}

type PropsLoga = {|
  novoUsuario: boolean,
  onChangeNovoUsuario: () => void,
  email: Email,
  onChangeEmail: Email => void,
  senha: string,
  onChangeSenha: string => void,
  esqueciASenha: boolean,
  onChangeEsqueciASenha: () => void
|}

function Loga(props: PropsLoga) {
  return <div className='field'>
    <label className='label'>
      Novo Usuário
      <input 
        type='checkbox' 
        value={props.novoUsuario} 
        checked={props.novoUsuario} 
        onChange={() => props.onChangeNovoUsuario()}/>  
    </label>
    <label className='label'>
      Esqueci a senha
      <input 
        type='checkbox' 
        value={props.esqueciASenha} 
        checked={props.esqueciASenha} 
        onChange={() => props.onChangeEsqueciASenha()}/>  
    </label>  
    <label className='label'>E-mail</label>
    <input 
      className='input'
      type='text' 
      value={props.email} 
      onChange={ev => props.onChangeEmail(ev.target.value)}/>
    <label className='label'>Senha</label>
    <input 
      className='input' 
      type='password' 
      value={props.senha} 
      onChange={ev => props.onChangeSenha(ev.target.value)}/>
  </div>
}