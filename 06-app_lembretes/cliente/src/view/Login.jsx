//@flow
import React, {useReducer, useEffect} from 'react'

import * as s from '../servicos'

import type {Token, TokenDecodificado} from '../tipos_flow'

type Props = {| 
  onToken: (token: Token) => void,
  onSaiu: () => void,
  token: Token | void,
  tokenDecodificado: TokenDecodificado | void
|}

type Estado = {|
  login: string,
  senha: string,
  confereSenha: string,
  novoUsuario: boolean,
  nomeBotao: 'Entrar' | 'Cadastrar Novo Usuário',
  fazendo: 'nada' | 'login' | 'cadastro' |  'logout',
  msg: string | void  
|}

type Acao =
    {| type: 'REGISTRE_LOGIN', login: string |}
  | {| type: 'REGISTRE_SENHA', senha: string |}
  | {| type: 'REGISTRE_CONFERE_SENHA', confereSenha: string |}
  | {| type: 'REGISTRE_NOVO_USUARIO', novoUsuario: boolean |}
  | {| type: 'FACA_LOGOUT'|}
  | {| type: 'FACA_LOGIN_OU_CADASTRO' |}
  | {| type: 'REGISTRE_LOGIN_OK' |}
  | {| type: 'REGISTRE_LOGIN_NOK',  motivo: string |}
  | {| type: 'REGISTRE_CADASTRO_OK' |}
  | {| type: 'REGISTRE_CADASTRO_NOK',  motivo: string |}

const estadoInicial: Estado = {
  login: '',
  senha: '',
  confereSenha: '',
  novoUsuario: false,
  nomeBotao: 'Entrar',
  fazendo: 'nada',
  msg: undefined
}

function reducer(estado: Estado, acao: Acao): Estado {
  switch (acao.type) {
  case 'REGISTRE_LOGIN':
    return {...estado, login: acao.login, senha: '', confereSenha: '', msg: undefined}
  
  case 'REGISTRE_SENHA':
    return {...estado, senha: acao.senha, msg: undefined}

  case 'REGISTRE_CONFERE_SENHA':
    return {...estado, confereSenha: acao.confereSenha, msg: undefined}

  case 'REGISTRE_NOVO_USUARIO': {
    const nomeBotao = acao.novoUsuario ? 'Cadastrar Novo Usuário' : 'Entrar'
    return {...estado, novoUsuario: acao.novoUsuario, nomeBotao, msg: undefined}
  }
  
  case 'FACA_LOGOUT':
    return {...estadoInicial, fazendo: 'logout'}

  case 'FACA_LOGIN_OU_CADASTRO': {
    if (estado.login === '')
      return {...estado, msg: 'Login não definido.'}
    else if (estado.novoUsuario) {
      if (estado.senha === '' || estado.confereSenha === '')
        return {...estado, msg: 'Senha não definida.'}
      else if (estado.senha !== estado.confereSenha)
        return {...estado, msg: 'Senhas não são iguais.'}
      else {
        return {...estado, fazendo: 'cadastro', msg: 'Fazendo cadastro...'}
      }
    } else if (estado.senha === '')
      return {...estado, msg: 'Senha não definida'}
    else {
      return {...estado, fazendo: 'login', msg: 'Fazendo login...'}
    }
  }

  case 'REGISTRE_LOGIN_OK':
    return {...estado , msg: undefined, fazendo: 'nada'}

  case 'REGISTRE_LOGIN_NOK':
    return {...estado, msg: acao.motivo, fazendo: 'nada'}

  case 'REGISTRE_CADASTRO_OK':
    return {...estado , msg: undefined, fazendo: 'nada'}
    
  case 'REGISTRE_CADASTRO_NOK':
    return {...estado, msg: acao.motivo, fazendo: 'nada'}
    
  default:
    throw new Error(`BUG: acao.type inválido: ${acao.type}`)
  }
}


function Login (props: Props): React$Element<'div'> {
  const [estado, dispatch] = useReducer(reducer, estadoInicial)

  
  function login(ev) {
    dispatch({type: 'REGISTRE_LOGIN', login: ev.target.value})
  }

  function senha(ev) {
    dispatch({type: 'REGISTRE_SENHA', senha: ev.target.value})
  }

  function confereSenha(ev) {
    dispatch({type: 'REGISTRE_CONFERE_SENHA', confereSenha: ev.target.value})
  }

  function novoUsuario() {
    dispatch({type: 'REGISTRE_NOVO_USUARIO', novoUsuario: !estado.novoUsuario})
  }

  function facaLoginOuCadastro() {
    dispatch({type: 'FACA_LOGIN_OU_CADASTRO'})
  }

  function facaLogout() {
    dispatch({type: 'FACA_LOGOUT'})
  }

  const onToken = props.onToken
  const onSaiu = props.onSaiu

  useEffect(() => {
    switch (estado.fazendo) {
    case 'login':
      s.fazLogin(estado.login, estado.senha)
        .then(token => {
          dispatch({type: 'REGISTRE_LOGIN_OK'})
          onToken(token)
        })
        .catch(erro => dispatch({type: 'REGISTRE_LOGIN_NOK', motivo: erro.message}))
      break
    
    case 'cadastro':
      s.fazCadastro(estado.login, estado.senha)
        .then(token => {
          dispatch({type: 'REGISTRE_CADASTRO_OK'})
          onToken(token)
        })
        .catch(erro => dispatch({type: 'REGISTRE_CADASTRO_NOK', motivo: erro.message}))
      break

    case 'logout':
      onSaiu()
      break

    case 'nada':
      break

    default:
      break
    }
  
  }, [estado.fazendo, estado.login, estado.senha, onToken, onSaiu])


  // -----------------------

  let conteudo
  if (props.tokenDecodificado === undefined) {
    conteudo =
        <div className='message is-link'>
          <div className='message-header'>Login</div>
          <div className='message-body'>

            <label className='checkbox'>
              <input type='checkbox'
                value={estado.novoUsuario}
                onChange={novoUsuario}/>novo usuário
            </label>
            <div className='field'>
              <label className='label'>Login</label>
              <div className='control'>
                <input className='input' type='text'
                  value={estado.login} onChange={login}/>
              </div>
            </div>
            <div className='field'>
              <label className='label'>Senha</label>
              <div className='control'>
                <input className='input' type='password'
                  value={estado.senha}
                  onChange={senha}/>
              </div>
            </div>
            {
              estado.novoUsuario &&
            <div className='field'>
              <label className='label'>Repita Senha</label>
              <div className='control'>
                <input className='input' type='password'
                  value={estado.confereSenha}
                  onChange={confereSenha}/>
              </div>
            </div>
            }
            <br/>
            <button className='button is-link' onClick={facaLoginOuCadastro}>
              {estado.nomeBotao}
            </button>
            {
              estado.msg &&
            <div className='notification is-warning'>{estado.msg}</div>
            }
          </div>
        </div>
  } else {
    conteudo =
        <div className='message is-info'>
          <div className='message-header'>
            Usuário logado: {props.tokenDecodificado.login}
          </div>
          <div className='message-body'>
            <button className='button is-link' onClick={facaLogout}>Sair</button>
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
