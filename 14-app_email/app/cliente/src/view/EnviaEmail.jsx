//@flow

import React, {useReducer, useEffect} from 'react'

import {validaEmailPara, enviaEmailDePara} from '../model/servicos'

import {tokenExpirou} from '../model/util'

import type {Email, TokenJWT} from './../tipos-flow'

import {stringToEmail, tamanhoEmail} from './../tipos-flow'

import Aviso from './Aviso.jsx'
import TokenExpirando from './TokenExpirando.jsx'

type Estado = {|
  para: Email,
  nomePara: string | void,
  assunto: string,
  texto: string,
  enviando: boolean,
  msg: string | void,
  validandoPara: boolean
|}

type Acao =
    {| type: 'REGISTRE_PARA', para: Email |}
  | {| type: 'REGISTRE_ASSUNTO', assunto: string |}
  | {| type: 'REGISTRE_TEXTO', texto: string |}
  | {| type: 'ENVIE_EMAIL' |}
  | {| type: 'EMAIL_ENVIADO'|}
  | {| type: 'EMAIL_NAO_ENVIADO', motivo: string |}
  | {| type: 'VALIDE_PARA' |}
  | {| type: 'VALIDACAO_OK', nome: string |}
  | {| type: 'VALIDACAO_NOK', motivo: string |}

type Dispatch = Acao => void

const estadoInicial: Estado = {
  para: stringToEmail(''),
  nomePara: undefined,
  assunto: '',
  texto: '',
  enviando: false,
  msg: undefined,
  validandoPara: false
}

function reducer(estado: Estado, acao: Acao): Estado {
  switch (acao.type) {
  case 'REGISTRE_PARA':
    return {...estado, para: acao.para, nomePara: undefined}

  case 'REGISTRE_ASSUNTO':
    return {...estado, assunto: acao.assunto, msg: undefined}

  case 'REGISTRE_TEXTO':
    return {...estado, texto: acao.texto, msg: undefined}

  case 'ENVIE_EMAIL':
    return {...estado, enviando: true, msg: 'Enviando mensagem...'}

  case 'EMAIL_ENVIADO':
    return {...estadoInicial, msg: 'Mensagem enviada com sucesso.'}

  case 'EMAIL_NAO_ENVIADO':
    return {...estado, enviando: false, msg: acao.motivo}
    
  case 'VALIDE_PARA':
    return {...estado, validandoPara: true, nomePara: undefined, msg: 'Validando destinatário...'}

  case 'VALIDACAO_OK':
    return {...estado, validandoPara: false, nomePara: acao.nome, msg: undefined}
    
  case 'VALIDACAO_NOK':
    return {...estado, validandoPara: false, msg: acao.motivo}
  }

  return estado
}

function useModelo(token: TokenJWT, onNovoToken: TokenJWT => void, 
  onTokenExpirou: void => void): [Estado, Dispatch, void => boolean] {
  const [estado, dispatch] = useReducer(reducer, estadoInicial)

  useEffect(() => {
    if (!estado.validandoPara && !estado.enviando && tokenExpirou(token))
      onTokenExpirou()
  })

  useEffect(() => {
    if (estado.validandoPara) {
      validaEmailPara(token, estado.para)
        .then(r => {
          if (r.ok)
            dispatch({type: 'VALIDACAO_OK', nome: r.nome})
          else
            dispatch({type: 'VALIDACAO_NOK', motivo: r.motivo})
        })
        .catch(erro => dispatch({type: 'VALIDACAO_NOK', motivo: erro.message}))
    }
  })

  useEffect(() => {
    if (estado.enviando) {
      enviaEmailDePara(token, estado.para, estado.assunto, estado.texto)
        .then(r => {
          if (r.ok) {
            dispatch({type: 'EMAIL_ENVIADO'})
            onNovoToken((r.token))
          }
          else
            dispatch({type: 'EMAIL_NAO_ENVIADO', motivo: r.motivo})
        })
        .catch(erro => dispatch({type: 'EMAIL_NAO_ENVIADO', motivo: erro.message}))
    }
  })

  function naoPodeEnviar() {
    return estado.enviando || estado.validandoPara || estado.nomePara === undefined 
      || estado.assunto.trim().length === 0 || estado.texto.trim().length === 0
  }

  return [estado, dispatch, naoPodeEnviar]
}

type Props = {|
    token: TokenJWT,
    onNovoToken: TokenJWT => void,
    onTokenExpirou: void => void
|}

export default function EnviaEmail(props: Props): React$Element<'div'> {
  const [estado, dispatch, naoPodeEnviar] = useModelo(props.token, props.onNovoToken, props.onTokenExpirou)

  return <div className='message is-link'>
    <div className='message-header'>
        Enviar Mensagem por E-mail
    </div>
    <div className='message-body'>
      <TokenExpirando 
        token={props.token} 
        tempo={15} 
        onNovoToken={token => props.onNovoToken(token)}
        onTokenExpirou={() => props.onTokenExpirou()}/>
      <div className='field'>
        <label className= 'label'>Para</label>
      </div>
      <div className='field has-addons'>
        <div className='control'>
          <input 
            className='input' 
            type='text' 
            placeholder='e-mail do destinatário'
            value={estado.para} 
            onChange={ev => dispatch({type: 'REGISTRE_PARA', para: ev.target.value})}/>
        </div>
        {
          estado.nomePara !== undefined &&
          <div className='control'>
            {estado.nomePara}
          </div>
        }
        {
          estado.nomePara === undefined &&
          <div className='control'>
            <button
              disabled={estado.validandoPara || tamanhoEmail(estado.para) === 0}
              className='button is-primary'
              onClick={() => dispatch({type: 'VALIDE_PARA'})}>
              Verificar se válido
            </button>
          </div>
        }
      </div>

      <div className='field'>
        <label className='label'>Assunto</label>
        <div className='control'>
          <input 
            className='input' 
            type='text' 
            placeholder='assunto'
            value={estado.assunto} 
            onChange={ev => dispatch({type: 'REGISTRE_ASSUNTO', assunto: ev.target.value})}/>
        </div>
      </div>

      <div className='field'>
        <label className='label'>Mensagem</label>
        <div className='control'>
          <input 
            className='input' 
            type='text' 
            placeholder='mensagem'
            value={estado.texto} 
            onChange={ev => dispatch({type: 'REGISTRE_TEXTO', texto: ev.target.value})}/>
        </div>
      </div>
      <Aviso msg={estado.msg}/>  
      <div className='field'>
        <div className='control'>
          <button 
            className='button is-success'
            onClick={() => dispatch({type: 'ENVIE_EMAIL'})} 
            disabled={naoPodeEnviar()}>
              Enviar
          </button>
        </div>
      </div>

    </div>
  </div>
}