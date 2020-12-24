// @flow
import React, { useReducer, useEffect } from 'react'
import type { Token, TokenDecodificado } from '../tipos'

import * as s from '../servicos'

type Props = {|
  onToken: (Token) => void,
    onSaiu: () => void,
      token: Token | void,
        tokenDecodificado: TokenDecodificado | void
|}

type Estado = {|
  login: string,
    senha: string,
      confereSenha: string,
        novoUsuario: boolean,
          nomeBotao: string,
            msg: string | void,
              cadastrando_logando: boolean,
                token: Token | void,
                  saiu: boolean
                    |}

type Acao =
  {| type: 'ARMAZENE_LOGIN', login: string |}
  | {| type: 'ARMAZENE_SENHA', senha: string |}
  | {| type: 'ARMAZENE_CONFERE_SENHA', confereSenha: string |}
  | {| type: 'ARMAZENE_NOVO_USUARIO' |}
  | {| type: 'FACA_LOGIN_OU_CADASTRO' |}
  | {| type: 'FACA_LOGOUT' |}
  | {| type: 'REGISTRE_ENTROU', token: Token |}
  | {| type: 'REGISTRE_NAO_ENTROU', msg: string |}


type Dispatch = (Acao) => void

type Modelo = [Estado, Dispatch]


const estadoInicial: Estado = {
  login: '',
  senha: '',
  confereSenha: '',
  novoUsuario: false,
  nomeBotao: 'Entrar',
  msg: undefined,
  cadastrando_logando: false,
  token: undefined,
  saiu: false
}


function reducer(estado: Estado, acao: Acao): Estado {

  // verifica se os dados para login estão preenchidos corretamente
  function validaForm(estado: Estado): string | void {
    let msg = undefined
    if (estado.login === '')
      msg = 'Login não definido'
    else
    if (estado.novoUsuario)
      if (estado.senha === '')
        msg = 'Senha não definida'
      else
      if (estado.senha !== estado.confereSenha)
        msg = 'Senhas não são iguais'
    return msg
  }

  switch (acao.type) {
  case 'ARMAZENE_LOGIN':
    return { ...estadoInicial, login: acao.login }

  case 'ARMAZENE_SENHA':
    return { ...estado, senha: acao.senha, msg: undefined }

  case 'ARMAZENE_CONFERE_SENHA':
    return { ...estado, confereSenha: acao.confereSenha, msg: undefined }

  case 'ARMAZENE_NOVO_USUARIO': {
    const novoUsuario = !estado.novoUsuario
    const nomeBotao = novoUsuario ? 'Cadastrar Novo Usuário' : 'Entrar'
    return { ...estado, novoUsuario, nomeBotao, msg: undefined }
  }

  case 'FACA_LOGIN_OU_CADASTRO': {
    let msg = validaForm(estado)
    const cadastrando_logando = msg === undefined
    if (cadastrando_logando)
      msg = estado.novoUsuario ? 'Fazendo cadastro...' : 'Fazendo login...'
    return { ...estado, msg, cadastrando_logando }
  }

  case 'REGISTRE_ENTROU': {
    return { ...estado, cadastrando_logando: false, token: acao.token, msg: undefined }
  }

  case 'REGISTRE_NAO_ENTROU': {
    return { ...estado, cadastrando_logando: false, msg: acao.msg }
  }

  case 'FACA_LOGOUT': {
    return { ...estadoInicial, saiu: true }
  }

  default:
    throw new Error('tipo da acao invalido')
  }
}








function useModelo(props: Props): Modelo {

  const [estado, dispatch] = useReducer(reducer, estadoInicial)

  const onToken = props.onToken
  const onSaiu = props.onSaiu

  useEffect(() => {
    if (estado.token !== undefined) {
      onToken(estado.token)
    }
  }, [estado.token, onToken])

  useEffect(() => {
    if (estado.saiu)
      onSaiu()
  }, [estado.saiu, onSaiu])

  useEffect(() => {
    if (estado.cadastrando_logando)
      if (estado.novoUsuario)
        s.fazCadastro(estado.login, estado.senha)
          .then(token => dispatch({ type: 'REGISTRE_ENTROU', token }))
          .catch(erro => dispatch({ type: 'REGISTRE_NAO_ENTROU', msg: erro.message }))
      else
        s.fazLogin(estado.login, estado.senha)
          .then(token => dispatch({ type: 'REGISTRE_ENTROU', token }))
          .catch(erro => dispatch({ type: 'REGISTRE_NAO_ENTROU', msg: erro.message }))
  }, [estado.cadastrando_logando, estado.novoUsuario, estado.login, estado.senha])

  return [estado, dispatch]
}

function Login(props: Props): React$Element<'div'> {
  const [estado, dispatch] = useModelo(props)

  function naoPodeEntrar() {
    return estado.login === '' || estado.senha === '' || (estado.novoUsuario && estado.senha !== estado.confereSenha)
  }

  let conteudo
  if (props.token === undefined && props.tokenDecodificado === undefined) {
    conteudo =
      <div className='message is-link'>
        <div className='message-header'>Login</div>
        <div className='message-body'>

          <label className='checkbox'>
            <input type='checkbox'
              value={estado.novoUsuario}
              onChange={() => dispatch({ type: 'ARMAZENE_NOVO_USUARIO' })} />
            novo usuário
          </label>
          <div className='field'>
            <label className='label'>Login</label>
            <div className='control'>
              <input className='input' type='text'
                value={estado.login}
                onChange={(ev) => dispatch({ type: 'ARMAZENE_LOGIN', login: ev.target.value })} />
            </div>
          </div>
          <div className='field'>
            <label className='label'>Senha</label>
            <div className='control'>
              <input className='input' type='password'
                value={estado.senha}
                onChange={(ev) => dispatch({ type: 'ARMAZENE_SENHA', senha: ev.target.value })} />
            </div>
          </div>
          {
            estado.novoUsuario &&
            <div className='field'>
              <label className='label'>Repita Senha</label>
              <div className='control'>
                <input className='input' type='password'
                  value={estado.confereSenha}
                  onChange={
                    (ev) => dispatch({ type: 'ARMAZENE_CONFERE_SENHA', confereSenha: ev.target.value })
                  } />
              </div>
            </div>
          }
          <br />
          <button
            disabled={naoPodeEntrar()}
            className='button is-link'
            onClick={() => dispatch({ type: 'FACA_LOGIN_OU_CADASTRO' })}>
            {estado.nomeBotao}
          </button>
          {
            estado.msg &&
            <div className='notification is-warning'>{estado.msg}</div>
          }
        </div>
      </div>
  } else {
    if (props.tokenDecodificado === undefined)
      conteudo = <div>Erro de programação!!</div>
    else
      conteudo =
        <div className='message is-info'>
          <div className='message-header'>
            Usuário logado: {props.tokenDecodificado.login}
          </div>
          <div className='message-body'>
            <button className='button is-link' onClick={() => dispatch({ type: 'FACA_LOGOUT' })}>
              Sair
            </button>
          </div>
        </div>
  }

  return (
    <div>
      {conteudo}
    </div>
  )

}



export default Login