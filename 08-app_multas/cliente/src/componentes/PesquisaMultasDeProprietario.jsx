//@flow

import React, { useEffect, useReducer } from 'react'

import {Panel} from 'primereact/panel'
import {InputMask} from 'primereact/inputmask'
import {Button} from 'primereact/button'
import {Toast} from 'primereact/toast'
import {Card} from 'primereact/card'
import {Chart} from 'primereact/chart'
import servicos from '../servicos'
import util_masks, { limpaCPF } from './util_masks'
import {useMsgsToast} from '../hooks/hooks'


import type {Proprietario, VeiculoComPontos} from '../tipos_flow'

type Props = {| cancelar: void => void |}


type Situacao = 'EDITANDO' | 'PESQUISANDO' | 'MOSTRANDO'

type Acao = 
    {| type: 'REGISTRE_CPF_DEFINIDO' |}
  | {| type: 'ARMAZENE_CPF', cpf: string |}
  | {| type: 'PESQUISE_MULTAS' |}
  | {| type: 'REGISTRE_PROPRIETARIO', proprietario: Proprietario, veiculos: Array<VeiculoComPontos> |}
  | {| type: 'REGISTRE_PROPRIETARIO_NAO_ENCONTRADO', msg: string |}

type Estado = {|
  situacao: Situacao,
  cpf: string,
  cpfDefinido: boolean,
  proprietario: Proprietario | void,
  veiculos: Array<VeiculoComPontos> | void,
  msgSucesso: string | void,
  msgAviso: string | void,
  msgErro: string | void
|}



const estadoInicial: Estado = {
  situacao: 'EDITANDO',
  cpf: '',
  cpfDefinido: false,
  proprietario: undefined,
  veiculos: undefined,
  msgErro: undefined,
  msgAviso: undefined,
  msgSucesso: undefined
}

function reducer(estado: Estado, acao: Acao): Estado {
  switch (acao.type) {
  case 'REGISTRE_CPF_DEFINIDO':
    return {...estado, cpfDefinido: true}

  case 'ARMAZENE_CPF':
    return acao.cpf === estado.cpf
      ? estado
      : {...estadoInicial, cpf: acao.cpf}
      
  case 'PESQUISE_MULTAS': {
    return {
      ...estado,
      situacao: 'PESQUISANDO', 
      proprietario: undefined, 
      veiculos: undefined, 
      msgSucesso: undefined,
      msgAviso: `Pesquisando multas de CPF ${estado.cpf}`,
      msgErro: undefined
    }
  }

  case 'REGISTRE_PROPRIETARIO':
    return {
      ...estado, 
      proprietario: acao.proprietario, 
      cpfDefinido: false,
      veiculos: acao.veiculos, 
      situacao: 'MOSTRANDO', 
      msgSucesso: 'Proprietário encontrado!',
      msgAviso: undefined,
      msgErro: undefined
    }

  case 'REGISTRE_PROPRIETARIO_NAO_ENCONTRADO':
    return {
      ...estado, 
      situacao: 'EDITANDO', 
      cpfDefinido: false,
      msgSucesso: undefined,
      msgAviso: undefined, 
      msgErro: acao.msg
    }

  default:
    throw new Error(`BUG: acao.type inválido: ${acao.type}`)
  }
}

function useModelo() {

  const [estado, dispatch] = useReducer(reducer, estadoInicial)

  useEffect(() => {
    if (estado.situacao === 'PESQUISANDO') {
      let cpfSemMask = limpaCPF(estado.cpf)
      const prom = servicos.pesquiseMultasDeProprietario(cpfSemMask)
      prom
        .then(({proprietario, veiculos}) => {
          if (proprietario !== null) {
            dispatch({type: 'REGISTRE_PROPRIETARIO', proprietario, veiculos})
          } else {
            throw new Error(`Não há proprietário com CPF ${estado.cpf}`)
          }
        })
        .catch((erro) => {
          dispatch({type: 'REGISTRE_PROPRIETARIO_NAO_ENCONTRADO', msg: erro.message})
        })
    }
  }, [estado.situacao, estado.cpf])
  
  return [ estado, dispatch ]
}

function PesquisaMultasDeProprietario (props: Props): React$Element<'div'> {
  const [ estado, dispatch ] = useModelo()
  const toastEl = useMsgsToast(estado)

  function onSubmit(ev) {
    ev.preventDefault() // evita envio de requisição ao servidor
    dispatch({type: 'PESQUISE_MULTAS'})
  }

  function montaGrafico(proprietario: Proprietario, veiculos: Array<VeiculoComPontos>) {
    const placas = veiculos.map(v => v.placa)
    const pontos = veiculos.map(v => v.pontos)
    const dados = {
      labels: placas,
      datasets: [
        {
          label: 'Pontuação do Veículo',
          data: pontos,
          fill: false,
          backgroundColor: 'orange'
        }
      ]
    }
    const opcoes = {
      title: {
        display: true,
        text: `Proprietário: ${proprietario.nome} CPF: ${proprietario.cpf}`
      }
    }
    
    return <Chart type='bar' data={dados} options={opcoes}/>
  }

  let conteudo

  switch (estado.situacao) {
  case 'PESQUISANDO':
    conteudo = 
      <Panel header='Pesquisando'>
        <p>Pesquisando multas ...</p>
      </Panel>
    break
  case 'MOSTRANDO':
    // com certeza estado.veiculos !== undefined e estado.proprietario !== undefined
    // if abaixo apenas para "enganar" o flow
    if (estado.veiculos !== undefined && estado.proprietario !== undefined) {
      if (estado.veiculos.length > 0) 
        conteudo = montaGrafico(estado.proprietario, estado.veiculos)
      else {
        conteudo = 
          <Panel header='Multas de Proprietário'>
            <p>
              O proprietário {estado.proprietario.nome}, com 
              CPF {estado.proprietario.cpf}, não possui veículos.
            </p>
          </Panel>
      }
    }
    break  
  }
  
  return (
    <Panel header='Pesquisar Multas de Proprietário'>
      <Toast ref={toastEl}/>
      <Card>
        <form onSubmit={onSubmit}>
          <p>
            CPF :
            <br/>
            <InputMask
              value={estado.cpf}
              onComplete={() => dispatch({type: 'REGISTRE_CPF_DEFINIDO'})}
              onChange={ev => dispatch({type: 'ARMAZENE_CPF', cpf: ev.value})}
              mask={util_masks.cpfMask}
              unmask={false}
              size={util_masks.cpfMask.length}/>
          </p>
          <Button
            label='Pesquisar'
            className='p-button-success'
            type='submit'
            disabled={!estado.cpfDefinido || estado.situacao === 'PESQUISANDO'}/>

          <Button
            label='Cancelar'
            className='p-button-danger'
            onClick={props.cancelar}/>
        </form>
      </Card>
      <div>{conteudo}</div>
    </Panel>
  )
}

export default PesquisaMultasDeProprietario
