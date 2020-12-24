//@flow

import React, { useEffect, useReducer } from 'react'

import {Panel} from 'primereact/panel'
import {InputMask} from 'primereact/inputmask'
import {Button} from 'primereact/button'
import {Toast} from 'primereact/toast'
import {Card} from 'primereact/card'

import servicos from '../servicos'
import util_masks, { limpaCPF } from './util_masks'
import MostraProprietarios from './MostraProprietarios.jsx'
import { useMsgsToast } from '../hooks/hooks'

import type {Proprietario} from '../tipos_flow'

type Props = {| cancelar: void => void |}

type Situacao = 'EDITANDO' | 'PESQUISANDO' | 'MOSTRANDO'

type Estado = {|
  situacao: Situacao,
  cpf: string,
  cpfDefinido: boolean,
  proprietario: Proprietario | void,
  msgSucesso: string | void,
  msgAviso: string | void,
  msgErro: string | void
|}

type Acao = 
    {| type: 'REGISTRE_CPF_DEFINIDO' |}
  | {| type: 'ARMAZENE_CPF', cpf: string |}
  | {| type: 'PESQUISE_PROPRIETARIO' |}
  | {| type: 'REGISTRE_PROPRIETARIO_ENCONTRADO', proprietario: Proprietario  |}
  | {| type: 'REGISTRE_PROPRIETARIO_NAO_ENCONTRADO', msg: string |}



const estadoInicial: Estado = {
  situacao: 'EDITANDO',
  cpf: '',
  cpfDefinido: false,
  proprietario: undefined,
  msgErro: undefined,
  msgAviso: undefined,
  msgSucesso: undefined
}

function reducer(estado: Estado, acao: Acao): Estado {
  switch (acao.type) {
  case 'PESQUISE_PROPRIETARIO':
    return {...estado, situacao: 'PESQUISANDO', msgAviso: `Pesquisando proprietário com CPF ${estado.cpf}`}

  case 'REGISTRE_CPF_DEFINIDO':
    return {...estado, cpfDefinido: true}

  case 'ARMAZENE_CPF':
    return acao.cpf === estado.cpf ? estado : {...estadoInicial, cpf: acao.cpf}

  case 'REGISTRE_PROPRIETARIO_ENCONTRADO':
    return {...estado, proprietario: acao.proprietario, situacao: 'MOSTRANDO', msgSucesso: 'Proprietário encontrado!'}

  case 'REGISTRE_PROPRIETARIO_NAO_ENCONTRADO':
    return {...estado, situacao: 'EDITANDO', proprietario: undefined, cpfDefinido: false, msgErro: acao.msg}

  default:
    throw new Error(`BUG: acao.type indefinido : ${acao.type}`)
  }
}


function useModelo() {
  const [estado, dispatch] = useReducer(reducer, estadoInicial)

  useEffect(() => {
    if (estado.situacao === 'PESQUISANDO') {
      const cpfSemMask = limpaCPF(estado.cpf)
      const prom = servicos.pesquiseProprietario(cpfSemMask)

      prom
        .then((proprietario) => {
          if (proprietario !== null) {
            dispatch({type: 'REGISTRE_PROPRIETARIO_ENCONTRADO', proprietario})
          } else {
            throw new Error(`Não existe proprietário com CPF ${estado.cpf}`)
          }
        })
        .catch((erro) => {
          dispatch({type: 'REGISTRE_PROPRIETARIO_NAO_ENCONTRADO', msg: erro.message})
        })
    }
  }, [estado.situacao, estado.cpf])


  return [ estado, dispatch ]
}

function PesquisaProprietario (props: Props): React$Element<'div'> {
  const [ estado, dispatch ] = useModelo()
  const toastEl = useMsgsToast(estado)

  function onSubmit(ev) {
    ev.preventDefault() // evita envio de requisição ao servidor
    dispatch({type: 'PESQUISE_PROPRIETARIO'})
  }

  let conteudo
  switch (estado.situacao) {
  case 'PESQUISANDO':
    conteudo = <Panel header='Pesquisando Proprietário'>
      <p>Pesquisando proprietário com CPF {estado.cpf}</p>
    </Panel>
    break

  case 'MOSTRANDO':
    if (estado.proprietario !== undefined) // com certeza true
      conteudo = <MostraProprietarios proprietarios={[estado.proprietario]}/>
    break
  }

  return (
    <Panel header='Pesquisar Proprietário'>
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
            disabled={!estado.cpfDefinido}/>

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

export default PesquisaProprietario