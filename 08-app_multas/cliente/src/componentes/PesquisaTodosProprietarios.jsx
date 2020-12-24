//@flow

import React, { useReducer, useEffect } from 'react'

import {Panel} from 'primereact/panel'
import {Button} from 'primereact/button'
import {Toast} from 'primereact/toast'
import {Card} from 'primereact/card'

import servicos from '../servicos'
import MostraProprietarios from './MostraProprietarios.jsx'
import {useMsgsToast} from '../hooks/hooks'


type Props = {| cancelar: void => void |}

type Situacao = 'INICIAL' | 'PESQUISANDO' | 'MOSTRANDO'

import type {Proprietario} from '../tipos_flow'

type Estado = {|
  situacao: Situacao,
  proprietarios: Array<Proprietario> | void,
  msgSucesso: string | void,
  msgAviso: string | void,
  msgErro: string | void
|}

type Acao = 
    {| type: 'PESQUISE' |}
  | {| type: 'REGISTRE_ERRO_AO_PESQUISAR', msg: string |}
  | {| type: 'REGISTRE_PROPRIETARIOS_ENCONTRADOS', proprietarios: Array<Proprietario> |}



const estadoInicial: Estado = {
  situacao: 'INICIAL',
  proprietarios: undefined,
  msgSucesso: undefined,
  msgAviso: undefined,
  msgErro: undefined
}


function reducer(estado: Estado, acao: Acao): Estado {
  switch (acao.type) {
  case 'PESQUISE':
    return {
      ...estadoInicial, 
      situacao: 'PESQUISANDO', 
      msgAviso: 'Obtendo proprietários...',
    }

  case 'REGISTRE_PROPRIETARIOS_ENCONTRADOS': {
    const msg = acao.proprietarios.length === 0 
      ? 'Não há proprietários cadastrados' 
      : `Encontrado(s) ${acao.proprietarios.length} proprietários`
    return {
      ...estado, 
      proprietarios: acao.proprietarios, 
      situacao: 'MOSTRANDO', 
      msgSucesso: msg,
      msgAviso: undefined,
      msgErro: undefined
    }
  }
    
  case 'REGISTRE_ERRO_AO_PESQUISAR':
    return {...estadoInicial, msgErro: acao.msg}

  default:
    throw new Error(`BUG: acao.type inválido: ${acao.type}`)
  }
}

function useModelo() {

  const [estado, dispatch] = useReducer(reducer, estadoInicial)

  
  
  useEffect(() => {
    if (estado.situacao === 'PESQUISANDO') {
      const prom = servicos.pesquiseTodosProprietarios()
      prom
        .then(proprietarios => {
          dispatch({type: 'REGISTRE_PROPRIETARIOS_ENCONTRADOS', proprietarios})
        })
        .catch((erro) => {
          dispatch({type: 'REGISTRE_ERRO_AO_PESQUISAR', msg: erro.message})
        })
    }
  }, [estado.situacao])

  
  return [estado, dispatch]
}

function PesquisaTodosProprietarios (props: Props): React$Element<'div'> {
  const [ estado, dispatch ] = useModelo()
  const toastEl = useMsgsToast(estado)

  let conteudo
  switch (estado.situacao) {
  case 'PESQUISANDO':
    conteudo = 
      <Panel header='Pesquisando'>
        <p>Pesquisando proprietários...</p>
      </Panel>
    break
  
  case 'MOSTRANDO':
    if (estado.proprietarios !== undefined)
      if (estado.proprietarios.length === 0)
        conteudo =
        <Panel header='Propritários Cadastrados'>
          <p>Ainda não há proprietários cadastrados.</p>
        </Panel>
      else
        conteudo = <MostraProprietarios proprietarios={estado.proprietarios}/>
    break
  }

  return (
    <Panel header='Pesquisar Todos Proprietários'>
      <Toast ref={toastEl}/>
      <Card>
        <Button
          label='Pesquisar'
          className='p-button-success'
          onClick={() => dispatch({type: 'PESQUISE'})}/>

        <Button
          label='Cancelar'
          className='p-button-danger'
          onClick={props.cancelar}/>
      </Card>
      <div>{conteudo}</div>
    </Panel>
  )
}

export default PesquisaTodosProprietarios