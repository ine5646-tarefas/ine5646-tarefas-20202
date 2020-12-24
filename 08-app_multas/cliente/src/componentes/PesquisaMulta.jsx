//@flow

import React, { useEffect, useReducer } from 'react'

import {DataTable} from 'primereact/datatable'
import {Column} from 'primereact/column'
import {Panel} from 'primereact/panel'
import {InputMask} from 'primereact/inputmask'
import {Button} from 'primereact/button'
import {Toast} from 'primereact/toast'
import {Card} from 'primereact/card'

import servicos from '../servicos'
import { useMsgsToast } from '../hooks/hooks'

import util_masks from './util_masks'

import type {Multa} from '../tipos_flow'


type PropsPesquisaMulta = {|
  cancelar: void => void
|}

type PropsExibeMulta = {|
  multa: Multa
|}

type Situacao = 'EDITANDO' | 'PESQUISANDO' | 'MOSTRANDO'

type Estado = {|
  situacao: Situacao,
  idMulta: string,
  idMultaDefinido: boolean,
  multa: Multa | void,
  msgSucesso: string | void,
  msgAviso: string | void,
  msgErro: string | void
|}

type Acao = 
    {| type: 'REGISTRE_DEFINIU_IDMULTA' |}
  | {| type: 'ARMAZENE_IDMULTA', idMulta: string |}
  | {| type: 'PESQUISE_MULTA' |}
  | {| type: 'REGISTRE_MULTA_ENCONTRADA', multa: Multa |}
  | {| type: 'REGISTRE_ERRO_AO_PESQUISAR_MULTA', msg: string |}



const estadoInicial: Estado = {
  situacao: 'EDITANDO',
  idMulta: '',
  idMultaDefinido: false,
  multa: undefined,
  msgSucesso: undefined,
  msgAviso: undefined,
  msgErro: undefined
}


function reducer(estado: Estado, acao: Acao): Estado {
  switch (acao.type) {
  case 'REGISTRE_DEFINIU_IDMULTA':
    return {...estado, idMultaDefinido: true}
  
  case 'ARMAZENE_IDMULTA': 
    return acao.idMulta === estado.idMulta
      ? estado
      : {...estadoInicial, idMulta: acao.idMulta}
  
  case 'PESQUISE_MULTA':
    return {
      ...estado, 
      situacao: 'PESQUISANDO',
      msgSucesso: undefined, 
      msgAviso: `Pesquisando multa com ID ${estado.idMulta}`,
      msgErro: undefined
    }

  case 'REGISTRE_MULTA_ENCONTRADA':
    return {
      ...estado, 
      multa: acao.multa, 
      situacao: 'MOSTRANDO', 
      msgSucesso: 'Multa encontrada!',
      msgAviso: undefined,
      msgErro: undefined
    }

  case 'REGISTRE_ERRO_AO_PESQUISAR_MULTA':
    return {
      ...estado, 
      idMultaDefinido: false, 
      multa: undefined,
      situacao: 'EDITANDO',
      msgSucesso: undefined,
      msgAviso: undefined, 
      msgErro: acao.msg,
    }

  default:
    throw new Error(`BUG: acao.type inválido: ${acao.type}`)
  }
}


function useModelo() {

  const [ estado, dispatch ] = useReducer(reducer, estadoInicial)

  useEffect(() => {
    if (estado.situacao === 'PESQUISANDO') {
      const prom = servicos.pesquiseMultaCompleta(estado.idMulta)
      prom
        .then((multa) => {
          if (multa !== null) {
            dispatch({type: 'REGISTRE_MULTA_ENCONTRADA', multa})
          } else {
            throw new Error(`Não existe multa com Id ${estado.idMulta}`)
          }
        })
        .catch((erro) => {
          dispatch({type: 'REGISTRE_ERRO_AO_PESQUISAR_MULTA', msg: erro.message})
        })
    }
  }, [estado.situacao, estado.idMulta])

  return [ estado, dispatch ]
}


function PesquisaMulta (props: PropsPesquisaMulta): React$Element<'div'> {
  const [ estado, dispatch ] = useModelo()
  const toastEl = useMsgsToast(estado)

  function onSubmit(ev) {
    ev.preventDefault() // evita envio de requisição ao servidor
  }

  const aMulta = estado.multa !== undefined ? <ExibeMulta multa={estado.multa}/> : undefined

  return (
    <Panel header='Pesquisar Multa'>
      <Toast ref={toastEl}/>
      <Card>
        <form onSubmit={onSubmit}>
          <p>
              Id :
            <br/>
            <InputMask
              value={estado.idMulta}
              onComplete={() => dispatch({type: 'REGISTRE_DEFINIU_IDMULTA'})}
              onChange={ev => dispatch({type: 'ARMAZENE_IDMULTA', idMulta: ev.value})}
              mask={util_masks.idMultaMask}
              unmask={false}
              size={util_masks.idMultaMask.length}/>
          </p>
          <Button
            label='Pesquisar'
            className='p-button-success'
            type='submit'
            disabled={!estado.idMultaDefinido || estado.multa !== undefined}/>

          <Button
            label='Cancelar'
            className='p-button-danger'
            onClick={props.cancelar}/>
        </form>
      </Card>
      <div>{aMulta}</div>
    </Panel>
  )
}

function ExibeMulta (props: PropsExibeMulta) {
  return (
    <DataTable value={[props.multa]} autoLayout={true}>
      <Column field='id' header='Id'/>
      <Column field='pontos' header='Pontos'/>
      <Column field='placa' header='Placa do Veículo'/>
      <Column field='cpf' header='CPF do Proprietário'/>
      <Column field='nome' header='Nome do Proprietário'/>
    </DataTable>
  )
}

export default PesquisaMulta
