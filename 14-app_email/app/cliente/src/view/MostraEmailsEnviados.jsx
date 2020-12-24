//@flow
import React, {useEffect, useReducer} from 'react'

import Aviso from './Aviso.jsx'
import TokenExpirando from './TokenExpirando.jsx'
import { leEmailsEnviados } from '../model/servicos'

import {tokenExpirou} from '../model/util'


import type {TokenJWT, Mensagem} from '../tipos-flow'

import {emailToString} from '../tipos-flow'

type Estado = {|
  MAX_MSGS_LIDAS: number,
  qtd: number,
  mensagens: Array<Mensagem> | void,
  pesquisando: boolean,
  msg: string | void
|}

const estadoInicial: Estado = {
  MAX_MSGS_LIDAS: 5,
  qtd: 5,
  mensagens: undefined,
  pesquisando: false,
  msg: undefined
}

type Acao =
    {| type: 'ALTERE_QTD', s_qtd: string |}
  | {| type: 'LEIA_MENSAGENS' |}
  | {| type: 'MENSAGENS_RECEBIDAS', msgs: Array<Mensagem> |}
  | {| type: 'MENSAGENS_NAO_RECEBIDAS', motivo: string |}

function reducer(estado: Estado, acao: Acao): Estado {
  switch (acao.type) {
  case 'LEIA_MENSAGENS':
    return {...estado, mensagens: undefined, pesquisando: true, msg: 'Pesquisando...'}

  case 'ALTERE_QTD': {
    let qtd: number = acao.s_qtd.trim().length === 0 || isNaN(acao.s_qtd) ? 1 : parseInt(acao.s_qtd, 10)
    if (qtd < 1)
      qtd = 1
    if (qtd > estado.MAX_MSGS_LIDAS)
      qtd = estado.MAX_MSGS_LIDAS
    return {...estadoInicial, MAX_MSGS_LIDAS: estado.MAX_MSGS_LIDAS, qtd}
  }

  case 'MENSAGENS_RECEBIDAS':
    return {...estado, mensagens: acao.msgs, pesquisando: false, msg: undefined}

  case 'MENSAGENS_NAO_RECEBIDAS':
    return {...estado, mensagens: undefined, pesquisando: false, msg: acao.motivo}
    
  default:
    throw new Error(`Acao.type desconhecida: ${acao.type}`)
  }
}

type Dispatch = Acao => void

function useModelo(maxMsgsLidas: number, token: TokenJWT, 
  onNovoToken: TokenJWT => void, onTokenExpirou: void => void): [Estado, Dispatch] {
  const [estado, dispatch] = useReducer(reducer, {...estadoInicial, MAX_MSGS_LIDAS: maxMsgsLidas, qtd: maxMsgsLidas})


  useEffect(() => {
    if (!estado.pesquisando && tokenExpirou(token))
      onTokenExpirou()
  })
  
  useEffect(() => {
    if (tokenExpirou(token))
      onTokenExpirou()
    else
    if (estado.pesquisando )
      leEmailsEnviados(token, estado.qtd)
        .then(r => {
          if (r.ok) {
            dispatch({type: 'MENSAGENS_RECEBIDAS', msgs: r.emails})
            onNovoToken(r.token)
          }
          else
            dispatch({type: 'MENSAGENS_NAO_RECEBIDAS', motivo: r.motivo})
        })
        .catch(erro => dispatch({type: 'MENSAGENS_NAO_RECEBIDAS', motivo: erro.message}))
  })

  return [estado, dispatch]
}


type Props = {|
  maxMsgsLidas: number,
  token: TokenJWT,
  onNovoToken: TokenJWT => void,
  onTokenExpirou: void => void
|}

export default function MostraEmailsEnviados (props: Props): React$Element<'div'> {

  const [estado, dispatch] = useModelo(props.maxMsgsLidas, props.token, props.onNovoToken, props.onTokenExpirou)

  return <div className='message is-link'>

    <div className='message-header'>
      Ver Mensagens Já Enviadas
    </div>
    <div className='message-body'>
      <TokenExpirando 
        token={props.token} 
        tempo={15} 
        onNovoToken={token => props.onNovoToken(token)}
        onTokenExpirou={() => props.onTokenExpirou()}/>
      <div className= 'field'>
        <label className= 'label'>Quantidade (Máx. {props.maxMsgsLidas} )</label>
      </div>
      <div className='field has-addons'>
        <div className='control'>
          <input 
            className='input' 
            type='number'
            min={1}
            max={props.maxMsgsLidas} 
            placeholder='quantidade de mensagens'
            value={estado.qtd} 
            onChange={ev => dispatch({type: 'ALTERE_QTD', s_qtd: ev.target.value})}/>
        </div>
        <div className='control'>
          <button
            disabled={estado.pesquisando}
            className='button is-primary'
            onClick={() => dispatch({type: 'LEIA_MENSAGENS'})}>
              Obter
          </button>
        </div>
      </div>
      <Aviso msg={estado.msg}/>
      {
        estado.mensagens !== undefined &&
        estado.mensagens.length === 0 &&
        <div className='notification is-warning'>
          Você ainda não enviou mensagens para ninguém.
        </div>
      }
      {
        estado.mensagens !== undefined &&
        estado.mensagens.length > 0 &&
        <MostraMensagens mensagens={estado.mensagens}/>
      }

    </div>
  </div>
  
}

type PropsMostraMensagens = {|
  mensagens: Array<Mensagem>
|}

function MostraMensagens(props: PropsMostraMensagens) {

  return <table className='table'>
    <thead>
      <tr>
        <th>Data</th>
        <th>Para</th>
        <th>Assunto</th>
        <th>Mensagem</th>
      </tr>
    </thead>
    <tbody>
      {props.mensagens.map(msg => 
        <tr key={msg._id}>
          <td>{new Date(msg.quando).toLocaleString()}</td>
          <td>{emailToString(msg.para)}</td>
          <td>{msg.assunto}</td>
          <td>{msg.texto}</td>
        </tr>)}
    </tbody>
  </table>
}