//@flow
import React, { useReducer, useEffect } from 'react'

import { buscaTopArtistas } from '../controle/servicos'
import { MostraArtistas } from './MostraArtistas.jsx'
import {Artista} from '../modelo/Artista'

import type {RespostaPesquisa} from '../tipos_flow'

type Estado = {|
  processando: boolean,
  optArtistas: Array<Artista> | void,
  optHorarioAtualizacao: Date | void,
  optMsgErro: string | void  
|}

type Acao =
    {| type: 'PESQUISE_ARTISTAS' |}
  | {| type: 'REGISTRE_PESQUISA_CONCLUIDA', resposta: RespostaPesquisa |}
  | {| type: 'REGISTRE_ERRO_NA_PESQUISA', msg: string |}
    
type Dispatch = Acao => void

type Modelo = [ Estado, Dispatch ]

const estadoInicial: Estado = {
  processando: false,
  optArtistas: undefined,
  optHorarioAtualizacao: undefined,
  optMsgErro: undefined
}

function reducer(estado: Estado, acao: Acao): Estado {
  switch (acao.type) {
  case 'PESQUISE_ARTISTAS': 
    return {...estadoInicial, processando: true}
 
  case 'REGISTRE_PESQUISA_CONCLUIDA':
    return acao.resposta.ok
      ? { ...estado, 
        processando: false, 
        optArtistas: acao.resposta.artistas, 
        optHorarioAtualizacao: acao.resposta.horario,
        optMsgErro: undefined
      }
      : { ...estado,
        processando: false,
        optMsgErro: acao.resposta.msgErro
      }

  case 'REGISTRE_ERRO_NA_PESQUISA': 
    return {...estado, processando: false, optMsgErro: acao.msg}

  default:
    throw new Error(`Bug no programa: ação ${acao.tipo} inválida!`)
  }
}

function useModelo(): Modelo {
  
  const [estado, dispatch] = useReducer(reducer, estadoInicial)

  useEffect(() => {
    if (estado.processando) {
      buscaTopArtistas()
        .then(resposta => dispatch({type: 'REGISTRE_PESQUISA_CONCLUIDA', resposta}))
        .catch(erro => dispatch({type: 'REGISTRE_ERRO_NA_PESQUISA', msg: erro.message}))
    }
  }, [estado.processando])
  
  return [estado, dispatch]
}

const UI = (): React$Element<'div'> => {
  const [estado, dispatch] = useModelo()
  
  function montaArtistas(estado: Estado) {
    let osArtistas = null

    function verificaSemInternet(horarioAtualizacao) {
      const tempo_offline = 5000
      let semInternet = false
      if (horarioAtualizacao !== undefined) {
        const agora = Date.now()
        semInternet =  agora - horarioAtualizacao > tempo_offline
      }
      return semInternet
    }

    function montaAvisoSemInternet(dataAtualizacao) {
      const [dia, hora] = dataAtualizacao.toLocaleString().split(', ')
  
      return (
        <div className='message is-warning'>
          <div className='message-header'>Atenção: Sem conexão com a internet.
          </div>
          <div className='message-body'>
            Dados abaixo foram obtidos em {dia} às {hora.split(' ')[0]} hs.
          </div>
        </div>
      )
    }
  
    if (estado.optArtistas !== undefined) {
      const artistas: Array<Artista> = estado.optArtistas
      const semInternet = verificaSemInternet(estado.optHorarioAtualizacao)  
      const avisoDesatualizado = semInternet && estado.optHorarioAtualizacao
        ? montaAvisoSemInternet(new Date(estado.optHorarioAtualizacao)) 
        : null
  
      osArtistas = 
      <div className='message is-success'>
        <div className='message-header'>Artistas Top 10 Encontrados </div>
        <div className='message-body'>
          {avisoDesatualizado}
          <MostraArtistas artistas={artistas} comInternet={!semInternet}/>
        </div>
      </div>
    }
    return osArtistas
  }

  function montaMsgErro(estado: Estado) {
    return estado.optMsgErro === undefined 
      ? null 
      : (
        <div className='message is-danger'>
          <div className='message-header'>Erro</div>
          <div>{estado.optMsgErro}</div>
        </div>
      )
  }

  function montaBotao(estado: Estado) {
    const estiloBotao = estado.processando 
      ? 'button is-rounded is-link is-loading' 
      : 'button is-rounded is-info'

    return (
      <button disabled={estado.processando} 
        className={estiloBotao} 
        onClick={() => dispatch({type: 'PESQUISE_ARTISTAS'})}>
          Buscar Artistas Top 10
      </button>
    )
  }
    
  return (
    <div className='container is-fluid'>
      <div className='message is-dark'>
        <div className='message-header'>
          UFSC - CTC - INE - INE5646 :: App Músicas
        </div>
        <div className='message-body'>
          {montaMsgErro(estado)}
          {montaBotao(estado)}
          {montaArtistas(estado)}
        </div>
      </div>
    </div>
  )
}

export { UI }
