//@flow

import React, { useReducer, useEffect } from 'react'

import {Panel} from 'primereact/panel'
import {InputMask} from 'primereact/inputmask'
import {Button} from 'primereact/button'
import {Toast} from 'primereact/toast'
import {Card} from 'primereact/card'

import servicos from '../servicos'
import util_masks, { limpaPlaca } from './util_masks'
import MostraVeiculos from './MostraVeiculos.jsx'
import { useMsgsToast } from '../hooks/hooks'

import type {VeiculoComProprietario} from '../tipos_flow'


type Props = {| cancelar: void => void |}

type Situacao = 'EDITANDO' | 'PESQUISANDO' | 'MOSTRANDO'

type Estado = {|
  situacao: Situacao,
  placa: string,
  placaDefinida: boolean,
  veiculoComProprietario: VeiculoComProprietario | void,
  msgSucesso: string | void,
  msgAviso: string | void,
  msgErro: string | void
|}

type Acao = 
    {| type: 'REGISTRE_PLACA_DEFINIDA' |}
  | {| type: 'ARMAZENE_PLACA', placa: string |}
  | {| type: 'PESQUISE_VEICULO' |}
  | {| type: 'REGISTRE_VEICULO_CADASTRADO', veiculoComProprietario: VeiculoComProprietario |}
  | {| type: 'REGISTRE_ERRO_AO_PESQUISAR', msg: string |}



const estadoInicial: Estado = {
  situacao: 'EDITANDO',
  placa: '',
  placaDefinida: false,
  veiculoComProprietario: undefined,
  msgSucesso: undefined,
  msgAviso: undefined,
  msgErro: undefined
}


function reducer(estado: Estado, acao: Acao): Estado {
  switch (acao.type) {
  case 'PESQUISE_VEICULO':
    return {
      ...estado, 
      situacao: 'PESQUISANDO',
      veiculoComProprietario: undefined,
      msgSucesso: undefined, 
      msgAviso: 'Pesquisando...',
      msgErro: undefined
    }

  case 'REGISTRE_PLACA_DEFINIDA':
    return {...estado, placaDefinida: true}

  case 'ARMAZENE_PLACA':
    return estado.placa === acao.placa
      ? estado
      : {...estadoInicial, placa: acao.placa}

  case 'REGISTRE_VEICULO_CADASTRADO':
    return {
      ...estado, 
      veiculoComProprietario: acao.veiculoComProprietario, 
      situacao: 'MOSTRANDO', 
      placaDefinida: false, 
      msgSucesso: 'Veículo encontrado!',
      msgAviso: undefined,
      msgErro: undefined
    }

  case 'REGISTRE_ERRO_AO_PESQUISAR':
    return {
      ...estado, 
      situacao: 'EDITANDO', 
      veiculoComProprietario: undefined,
      placaDefinida: false,
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

  useEffect(()=> {
    if (estado.situacao === 'PESQUISANDO') {
      const placaSemMask = limpaPlaca(estado.placa)
      const prom: Promise<VeiculoComProprietario> = servicos.pesquiseVeiculoComProprietario(placaSemMask)
  
      prom
        .then((veiculoComProprietario) => {
          if (veiculoComProprietario !== null) {
            dispatch({type: 'REGISTRE_VEICULO_CADASTRADO', veiculoComProprietario})
          } else {
            throw new Error(`Não existe veículo com placa ${estado.placa}`)
          }
        })
        .catch((erro) => {
          dispatch({type: 'REGISTRE_ERRO_AO_PESQUISAR', msg: erro.message})
        })

    }
  }, [estado.situacao, estado.placa])

  return [ estado, dispatch ]
}

function PesquisaVeiculo (props: Props): React$Element<'div'> {
  const [ estado, dispatch ] = useModelo()
  const toastEl = useMsgsToast(estado)

  function onSubmit(ev) {
    ev.preventDefault() // evita envio de requisição ao servidor
    dispatch({type: 'PESQUISE_VEICULO'})
  }

  let conteudo
  switch (estado.situacao) {
  case 'PESQUISANDO':
    conteudo = 
    <Panel header='Pesquisando Veículo'>
      <p>Pesquisando veículo com placa {estado.placa}</p>
    </Panel>
    break
  case 'MOSTRANDO': {
    if (estado.veiculoComProprietario !== undefined) { // true sempre
      const p = estado.veiculoComProprietario.proprietario
      const v = estado.veiculoComProprietario.veiculo
      const titulo = `Proprietário CPF ${p.cpf} Nome: ${p.nome}`
      conteudo =
        <Panel header={titulo}>
          <MostraVeiculos
            cpf={p.cpf}
            ocultavel={false}
            veiculos={[v]}/>
        </Panel>
    }
    break
  }
  }

  return (
    <Panel header='Pesquisar Veículo'>
      <Toast ref={toastEl}/>
      <Card>
        <form onSubmit={onSubmit}>
          <p>
              Placa :
            <br/>
            <InputMask
              value={estado.placa}
              onComplete={() => dispatch({type: 'REGISTRE_PLACA_DEFINIDA'})}
              onChange={ev => dispatch({type: 'ARMAZENE_PLACA', placa: ev.value})}
              mask={util_masks.placaMask}
              unmask={false}
              size={util_masks.placaMask.length}/>
          </p>
          <Button
            label='Pesquisar'
            className='p-button-success'
            type='submit'
            disabled={!estado.placaDefinida}/>

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

export default PesquisaVeiculo
