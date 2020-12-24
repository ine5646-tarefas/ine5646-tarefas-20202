// @flow
import React, {useReducer, useEffect} from 'react'

import type {Token, VulcaoMongo, IdVulcao} from '../tipos'
import MsgModal from './MsgModal.jsx'

import { leVulcoes, apagaVulcao } from '../servicos'
import MostraVulcao from './MostraVulcao.jsx'

type Props = {|
  token: Token,
  onTokenInvalido: () => void
|}

type Estado = {|
  lendo: boolean,
  idVulcaoApagar: IdVulcao | void,
  vulcoes: Array<VulcaoMongo> | void,
  erro: boolean
|}

type Acao =
    {| type: 'APAGUE_VULCAO', id: IdVulcao |}
  | {| type: 'REGISTRE_VULCAO_APAGADO', vulcoesQueSobraram: Array<VulcaoMongo> |}
  | {| type: 'REGISTRE_ERRO_AO_APAGAR_VULCAO' |}
  | {| type: 'LEIA_VULCOES' |}
  | {| type: 'REGISTRE_VULCOES', vulcoes: Array<VulcaoMongo> |}
  | {| type: 'REGISTRE_ERRO_AO_LER_VULCOES' |}


type Dispatch = Acao => void

type Modelo = [Estado, Dispatch]

const estadoInicial: Estado = {
  vulcoes: undefined,
  lendo: false,
  idVulcaoApagar: undefined,
  erro: false
}

function reducer(estado: Estado, acao: Acao): Estado {
  switch (acao.type) {
  case 'APAGUE_VULCAO': {
    return {...estado, idVulcaoApagar: acao.id}
  }
  
  case 'REGISTRE_ERRO_AO_APAGAR_VULCAO': {
    return {...estadoInicial, erro: true}
  }

  case 'LEIA_VULCOES': 
    return {...estado, lendo: true}
  
  case 'REGISTRE_ERRO_AO_LER_VULCOES': {
    return {...estadoInicial, erro: true}
  }

  case 'REGISTRE_VULCOES':
    return {...estado, vulcoes: acao.vulcoes, lendo: false}

  case 'REGISTRE_VULCAO_APAGADO':
    return {...estado, idVulcaoApagar: undefined, vulcoes: acao.vulcoesQueSobraram}

  default:
    throw new Error(`BUG: acao.type inválido: ${acao.type}`)
  }
}


function useModelo({token, onTokenInvalido}: Props): Modelo {

  const [estado, dispatch] = useReducer(reducer, estadoInicial)

  useEffect(() => {
    if (estado.erro)
      onTokenInvalido()
  }, [estado.erro, onTokenInvalido])

  useEffect(() => {
    if (estado.lendo) {
      leVulcoes(token)
        .then(vulcoes => dispatch({type: 'REGISTRE_VULCOES', vulcoes}))
        .catch(() => dispatch({type: 'REGISTRE_ERRO_AO_LER_VULCOES'}))
    }
  }, [estado.lendo, token])

  useEffect(() => {
    if (estado.idVulcaoApagar !== undefined) { 
      apagaVulcao(token, estado.idVulcaoApagar)
        .then(() => {
          let vulcoes = estado.vulcoes === undefined ? [] : estado.vulcoes
          vulcoes = vulcoes.filter(vulc => vulc._id !== estado.idVulcaoApagar)
          dispatch({type: 'REGISTRE_VULCAO_APAGADO', vulcoesQueSobraram: vulcoes})
        })
        .catch(() => {
          dispatch({type: 'REGISTRE_ERRO_AO_APAGAR_VULCAO'})
        })
    }
  }, [estado.idVulcaoApagar, estado.vulcoes, token])

  return [estado, dispatch]
}

//
//
// ...............................
//
//

function MostraVulcoes (props: Props): React$Element<'div'> {
  const [estado, dispatch] = useModelo(props)

  return (
    <div className='message'>
      {
        estado.lendo &&
        <MsgModal msg={'Lendo vulcões...'} />
      }

      <div className='message-header'>Mostrar Vulcões
        <button 
          className='button is-info' 
          onClick={() => dispatch({type: 'LEIA_VULCOES'})}>
          Ler Vulcões
        </button>
      </div>
      {
        estado.vulcoes !== undefined &&
          <div>
            {estado.vulcoes.map(v =>
              <span key={v._id}>
                <MostraVulcao token={props.token}
                  id={v._id}
                  vulcao={v.vulcao}
                  onDelete={() => dispatch({type: 'APAGUE_VULCAO', id: v._id})}/>
              </span>)}
          </div>
      }
      {
        estado.vulcoes !== undefined &&
          estado.vulcoes.length == 0 &&
          <div className='notification is-warning'>
            Não há vulcões para este usuário.
          </div>
      }
    </div>
  )
}


export default MostraVulcoes
