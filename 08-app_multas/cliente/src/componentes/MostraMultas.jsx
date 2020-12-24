//@flow

import React, { useEffect, useReducer } from 'react'

import {DataTable} from 'primereact/datatable'
import {Column} from 'primereact/column'
import {Button} from 'primereact/button'

import servicos from '../servicos'

import type {Veiculo, MultaSimplificada} from '../tipos_flow'


type Props = {| veiculo: Veiculo |}

type Acao = 
    {| type: 'MOSTRE_MULTAS' |}
  | {| type: 'OCULTE_MULTAS' |}
  | {| type: 'REGISTRE_MULTAS_ENCONTRADAS', multas: Array<MultaSimplificada> |}
  | {| type: 'REGISTRE_ERRO_AO_PESQUISAR_MULTAS', msg: string |}

type Estado = {|
  mostrando: boolean,
  multas: Array<MultaSimplificada> | void,
  msg: string | void
|}


const estadoInicial: Estado = {
  mostrando: false,
  multas: undefined,
  msg: undefined
}

function reducer(estado: Estado, acao: Acao): Estado {
  switch (acao.type) {
  case 'MOSTRE_MULTAS':
    return {...estado, mostrando: true, msg: 'Pesquisando multas...'}

  case 'OCULTE_MULTAS':
    return estadoInicial

  case 'REGISTRE_MULTAS_ENCONTRADAS':
    return {...estado, multas: acao.multas, msg: undefined}

  case 'REGISTRE_ERRO_AO_PESQUISAR_MULTAS':
    return {...estado, msg: acao.msg}

  default:
    throw new Error(`Tipo da ação inválido: ${acao.type}`)
  }
}

function useModelo(placa: string) {

  
  const [estado, dispatch] = useReducer(reducer, estadoInicial)

  useEffect(() => {
    if (estado.mostrando) {
      const prom = servicos.pesquiseMultasDeVeiculo(placa)
      prom
        .then((multas) => {
          dispatch({type: 'REGISTRE_MULTAS_ENCONTRADAS', multas})
        })
        .catch((erro) => {
          dispatch({type: 'REGISTRE_ERRO_AO_PESQUISAR_MULTAS', msg: erro.message})
        })
    }
  }, [estado.mostrando, placa])

  return [ estado, dispatch ]
}


function MostraMultas (props: Props): React$Element<'div' | 'p'> {
  const [ estado, dispatch ] = useModelo(props.veiculo.placa)

  let conteudo
  if (estado.msg !== undefined)
    conteudo = <p>{estado.msg}</p>
  else
  if (estado.multas === undefined)
    conteudo = <Button label='Ver' onClick={() => dispatch({type: 'MOSTRE_MULTAS'})}/>
  else {
    if (estado.multas.length === 0)
      conteudo = <p>Não há!</p>
    else {
      conteudo = <div>
        <DataTable value={estado.multas} autoLayout={true}>
          <Column field='id' header='ID'/>
          <Column field='pontos' header='Pontos'/>
        </DataTable>
        <Button label='Fechar' onClick={() => dispatch({type: 'OCULTE_MULTAS'})}/>
      </div>
    }
  }

  return conteudo
}

export default MostraMultas