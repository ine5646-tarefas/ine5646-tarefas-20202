//@flow

import React, { useEffect, useReducer } from 'react'

import {Panel} from 'primereact/panel'
import {InputMask} from 'primereact/inputmask'
import {InputText} from 'primereact/inputtext'
import {Button} from 'primereact/button'
import {Toast} from 'primereact/toast'

import servicos from '../servicos'
import util_masks, {limpaCPF} from './util_masks'
import { useMsgsToast } from '../hooks/hooks'


type Props = {| cancelar: void => void |}

type Estado = {|
  cadastrando: boolean,
  cpf: string,
  cpfDefinido: boolean,
  nome: string,
  msgSucesso: string | void,
  msgAviso: string | void,
  msgErro: string | void
|}

type Acao =
    {| type: 'REGISTRE_CADASTROU' |}
  | {| type: 'REGISTRE_NAO_CADASTROU', msg: string |}
  | {| type: 'CADASTRE' |}
  | {| type: 'REGISTRE_CPF_DEFINIDO' |}
  | {| type: 'ARMAZENE_CPF', cpf: string |}
  | {| type: 'ARMAZENE_NOME', nome: string |}


const estadoInicial: Estado = {
  cadastrando: false,
  cpf: '',
  cpfDefinido: false,
  nome: '',
  msgSucesso: undefined,
  msgAviso: undefined,
  msgErro: undefined
}

function reducer(estado: Estado, acao: Acao): Estado {
  switch (acao.type) {

  case 'REGISTRE_CADASTROU':
    return {
      ...estadoInicial, 
      msgSucesso: `Proprietário com CPF ${estado.cpf} cadastrado com sucesso!`,
      msgAviso: undefined,
      msgErro: undefined,
    }

  case 'REGISTRE_NAO_CADASTROU':
    return {
      ...estado,
      msgSucesso: undefined,
      msgAviso: undefined, 
      msgErro: acao.msg, 
      cadastrando: false, 
      cpfDefinido: false
    }

  case 'CADASTRE': 
    return {
      ...estado, 
      cadastrando: true,
      msgSucesso: undefined, 
      msgAviso: 'Cadastrando proprietário...',
      msgErro: undefined,
    }

  case 'REGISTRE_CPF_DEFINIDO':
    return {...estado, cpfDefinido: true}

  case 'ARMAZENE_CPF': 
    return estado.cpf === acao.cpf 
      ? estado
      : {
        ...estado, 
        cpf: acao.cpf, 
        cpfDefinido: false, 
        msgSucesso: undefined, 
        msgAviso: undefined, 
        msgErro: undefined
      }
    
  case 'ARMAZENE_NOME': 
    return (acao.nome.startsWith(' ') || acao.nome.endsWith('  '))
      ? {
        ...estado,
        msgSucesso: undefined, 
        msgAviso: 'Nome não pode iniciar ou terminar com espaço em branco',
        msgErro: undefined,
      }
      : {...estado, nome: acao.nome, msgAviso: undefined, msgSucesso: undefined, msgErro: undefined}


  default:
    throw new Error(`ERRO: tipo da ação não definida: ${acao.tipo}`)
  }
}

function useModelo() {
  
  const [estado, dispatch] = useReducer(reducer, estadoInicial)

  
  useEffect(() => {
    if (estado.cadastrando) {
      const cpfSemMask = limpaCPF(estado.cpf)
      const prom = servicos.cadastreProprietario(cpfSemMask, estado.nome.trim())
      prom
        .then((cadastrou) => {
          if (!cadastrou)
            throw new Error('Proprietário já cadastrado')
          dispatch({type: 'REGISTRE_CADASTROU'})
        })
        .catch((erro) => {
          dispatch({type: 'REGISTRE_NAO_CADASTROU', msg: erro.message})
        })
    }
  }, [estado.cadastrando, estado.cpf, estado.nome])

  return [ estado, dispatch ]
}

function CadastraProprietario (props: Props): React$Element<'div'> {
  const [ estado, dispatch ] = useModelo()

  const toastEl = useMsgsToast(estado)

  function naoPodeCadastrar() {
    return !estado.cpfDefinido || estado.nome.length === 0 || estado.nome.trim() === ''
  }

  function onSubmit(ev) {
    ev.preventDefault()
    dispatch({type: 'CADASTRE'})
  }

  return (
    <Panel header='Cadastrar Proprietário'>
      <Toast ref={toastEl}/>
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
        <p>
          Nome :
          <br/>
          <InputText
            type='text'
            value={estado.nome}
            onChange={ev => dispatch({type: 'ARMAZENE_NOME', nome: ev.target.value})}
            size='30'/>
        </p>
        <Button
          label='Cadastrar'
          className='p-button-success'
          type='submit'
          disabled={naoPodeCadastrar()}/>
        <Button
          label='Cancelar'
          className='p-button-danger'
          onClick={props.cancelar}/>
      </form>
    </Panel>
  )
}

export default CadastraProprietario
