//@flow

import React, {  useEffect, useReducer } from 'react'

import {DataTable} from 'primereact/datatable'
import {Column} from 'primereact/column'
import {Button} from 'primereact/button'
import {Toast} from 'primereact/toast'

import MostraMultas from './MostraMultas.jsx'

import servicos from '../servicos'
import { useMsgsToast } from '../hooks/hooks'

import type {Veiculo} from '../tipos_flow'


type Props = {|
  cpf: string ,
  veiculos: Array<Veiculo> | void,
  ocultavel: boolean

|}

type Situacao = 'MOSTRANDO' | 'NAO_MOSTRANDO' | 'PESQUISANDO'

type Acao = 
    {| type: 'ALTERNE_MOSTRAR' |}
  | {| type: 'REGISTRE_VEICULOS_ENCONTRADOS', veiculos: Array<Veiculo> |}
  | {| type: 'REGISTRE_ERRO_AO_PESQUISAR_VEICULOS', msg: string |}

type Estado = {|
  situacao: Situacao | void,
  veiculos: Array<Veiculo> | void,
  msgSucesso: string | void,
  msgAviso: string | void,
  msgErro: string | void
|}


function reducer(estado: Estado, acao: Acao): Estado {
  switch (acao.type) {
  case 'ALTERNE_MOSTRAR': 
    return estado.situacao === 'MOSTRANDO'
      ? {...estado, situacao: 'NAO_MOSTRANDO', veiculos: undefined}
      : {...estado, situacao: 'PESQUISANDO', msgSucesso: undefined, msgAviso: 'Pesquisando veículos...', msgErro: undefined}


  case 'REGISTRE_VEICULOS_ENCONTRADOS':
    return {...estado, veiculos: acao.veiculos, situacao: 'MOSTRANDO', msgSucesso: undefined, msgAviso: undefined, msgErro: undefined}

  case 'REGISTRE_ERRO_AO_PESQUISAR_VEICULOS':
    return {...estado, veiculos: undefined, msgSucesso: undefined, msgAviso: undefined, msgErro: acao.msg, situacao: 'NAO_MOSTRANDO'}

  default:
    throw new Error(`ERRO: acao.type inválido: ${acao.type}`)
  }
}

function useModelo(veiculos: Array<Veiculo> | void, cpf: string) {


  const estadoInicial: Estado = {
    situacao: veiculos === undefined ? 'NAO_MOSTRANDO': 'MOSTRANDO',
    veiculos,
    msgSucesso: undefined,
    msgAviso: undefined,
    msgErro: undefined
  }

  const [estado, dispatch] = useReducer(reducer, estadoInicial)

  
  useEffect(() => {
    if (estado.situacao === 'PESQUISANDO') {
      servicos.pesquiseVeiculosDoProprietario(cpf)
        .then((veiculos) => {
          dispatch({type: 'REGISTRE_VEICULOS_ENCONTRADOS', veiculos})
        })
        .catch((erro) => {
          dispatch({type: 'REGISTRE_ERRO_AO_PESQUISAR_VEICULOS', msg: erro.message})
        })
    }
  }, [estado.situacao, cpf])


  return [ estado, dispatch ]
}

function MostraVeiculos (props: Props): React$Element<'div'> {
  const [ estado, dispatch ] = useModelo(props.veiculos, props.cpf)
  const toastEl = useMsgsToast(estado)

  let conteudo
  switch (estado.situacao) {
  case 'NAO_MOSTRANDO':
    conteudo = <Button label='Mostrar' onClick={() => dispatch({type: 'ALTERNE_MOSTRAR'})}/>
    break

  case 'PESQUISANDO':
    conteudo = <p>pesquisando...</p>
    break

  case 'MOSTRANDO': {
    if (estado.veiculos !== undefined && estado.veiculos.length === 0)
      conteudo = <h4>Não possui</h4>
    else {
      let btOcultar

      if (props.ocultavel)
        btOcultar = <Button label='Ocultar' onClick={() => dispatch({type: 'ALTERNE_MOSTRAR'})}/>
      conteudo = 
        <div>
          <DataTable value={estado.veiculos} autoLayout={true}>
            <Column field='placa' header='Placa'/>
            <Column field='ano' header='Ano'/>
            <Column
              header='Multas'
              body={(v) => (<MostraMultas veiculo={v}/>)}/>
          </DataTable>
          {btOcultar}
        </div>
    }
  }
    break

  default:
    conteudo = <h2>Bug! estado.situacao inválido: ${estado.situacao}</h2>
  }
  return (
    <div>
      <Toast ref={toastEl}/>
      {conteudo}
    </div>
  )
}

export default MostraVeiculos