//@flow

import React, { useEffect, useReducer} from 'react'

import {Panel} from 'primereact/panel'
import {InputMask} from 'primereact/inputmask'
import {Button} from 'primereact/button'
import {Toast} from 'primereact/toast'

import servicos from '../servicos'
import util_masks, { limpaCPF, limpaPlaca } from './util_masks'
import { useMsgsToast } from '../hooks/hooks'


type Props = {| cancelar: void => void |}

type Situacao = 'DEFININDO_CPF' | 'PESQUISANDO_PROPRIETARIO' | 'EDITANDO_VEICULO' | 'CADASTRANDO_VEICULO'

type Estado = {|
  situacao: Situacao,
  cpf: string,
  cpfDefinido: boolean,
  nomeProprietario: string | void,
  placa: string,
  placaDefinida: boolean,
  ano: string,
  anoDefinido: boolean,
  msgSucesso: string | void,
  msgAviso: string | void,
  msgErro: string | void
|}

type Acao = 
    {| type: 'ARMAZENE_ANO', ano: string |}
  | {| type: 'REGISTRE_ANO_DEFINIDO' |}
  | {| type: 'ARMAZENE_PLACA', placa: string |}
  | {| type: 'REGISTRE_PLACA_DEFINIDA' |}
  | {| type: 'REGISTRE_CPF_DEFINIDO' |}
  | {| type: 'ARMAZENE_CPF', cpf: string |}
  | {| type: 'CADASTRE' |}
  | {| type: 'REGISTRE_PROPRIETARIO_NAO_CADASTRADO' |}
  | {| type: 'REGISTRE_PROPRIETARIO_CADASTRADO', nome: string |}
  | {| type: 'REGISTRE_ERRO_AO_PESQUISAR_PROPRIETARIO', msg: string |}
  | {| type: 'REGISTRE_VEICULO_CADASTRADO' |}
  | {| type: 'REGISTRE_VEICULO_NAO_CADASTRADO', msg: string |}



const estadoInicial: Estado = {
  situacao: 'DEFININDO_CPF',
  cpf: '',
  cpfDefinido: false,
  nomeProprietario: undefined,
  placa: '',
  placaDefinida: false,
  ano: '',
  anoDefinido: false,
  msgSucesso: undefined,
  msgAviso: undefined,
  msgErro: undefined
}

function reducer(estado: Estado, acao: Acao): Estado {
  switch (acao.type) {
  case 'ARMAZENE_ANO':
    return acao.ano === estado.ano
      ? estado
      : {
        ...estado, 
        ano: acao.ano, 
        anoDefinido: false, 
        msgSucesso: undefined, 
        msgAviso: undefined, 
        msgErro: undefined
      }

  case 'REGISTRE_ANO_DEFINIDO':
    return {...estado, anoDefinido: true, msgSucesso: undefined, msgAviso: undefined, msgErro: undefined}

  case 'REGISTRE_PLACA_DEFINIDA':
    return {...estado, placaDefinida: true}

  case 'ARMAZENE_PLACA': {
    const placaDigitada = acao.placa.toUpperCase()
    return placaDigitada === estado.placa
      ? estado
      : {
        ...estado, 
        placa: placaDigitada, 
        placaDefinida: false,
        msgSucesso: undefined,
        msgAviso: undefined,
        msgErro: undefined
      }
  }

  case 'ARMAZENE_CPF': {
    return acao.cpf === estado.cpf
      ? estado
      : {
        ...estado, 
        cpf: acao.cpf, 
        nomeProprietario: undefined, 
        cpfDefinido: false,
        placa: '',
        placaDefinida: false,
        ano: '',
        anoDefinido: false, 
        situacao: 'DEFININDO_CPF',
        msgSucesso: undefined,
        msgAviso: undefined,
        msgErro: undefined
      }    
  } 

  case 'REGISTRE_CPF_DEFINIDO': 
    return {
      ...estado, 
      cpfDefinido: true, 
      situacao: 'PESQUISANDO_PROPRIETARIO',
      msgSucesso: undefined,
      msgAviso: `Pesquisando proprietário com CPF ${estado.cpf}`,
      msgErro: undefined
    }

  case 'CADASTRE':
    return {
      ...estado, 
      situacao: 'CADASTRANDO_VEICULO',
      msgSucesso: undefined, 
      msgAviso: `Cadastrando veículo com placa ${estado.placa}`,
      msgErro: undefined
    }
  
  case 'REGISTRE_PROPRIETARIO_NAO_CADASTRADO':
    return {
      ...estado,
      msgSucesso: undefined, 
      msgAviso: undefined,
      msgErro: `CPF ${estado.cpf} não cadastrado.`, 
      cpfDefinido: false, 
      nomeProprietario: undefined, 
      situacao: 'DEFININDO_CPF'
    }

  case 'REGISTRE_PROPRIETARIO_CADASTRADO':
    return {
      ...estado, 
      nomeProprietario: acao.nome, 
      situacao: 'EDITANDO_VEICULO', 
      msgSucesso: 'Proprietário cadastrado',
      msgAviso: undefined,
      msgErro: undefined
    }

  case 'REGISTRE_ERRO_AO_PESQUISAR_PROPRIETARIO':
    return {
      ...estado, 
      msgSucesso: undefined, 
      msgAviso: undefined, 
      msgErro: acao.msg, 
      situacao: 'DEFININDO_CPF'
    }

  case 'REGISTRE_VEICULO_CADASTRADO':
    return {
      ...estadoInicial, 
      msgSucesso: 'Veículo cadastrado com sucesso!',
      msgAviso: undefined,
      msgErro: undefined,
      situacao: 'EDITANDO_VEICULO', cpf: estado.cpf, 
      cpfDefinido: true, 
      nomeProprietario: estado.nomeProprietario
    }

  case 'REGISTRE_VEICULO_NAO_CADASTRADO':
    return {
      ...estado, 
      placaDefinida: false, 
      msgSucesso: undefined,
      msgAviso: undefined,
      msgErro: acao.msg, 
      situacao: 'EDITANDO_VEICULO'
    }

  default:
    throw new Error(`Acao com tipo inválido: ${acao.type}`)
  }
}


function useModelo() {


  const [estado, dispatch] = useReducer(reducer, estadoInicial)
  
  useEffect(() => {
    switch (estado.situacao) {
    case 'PESQUISANDO_PROPRIETARIO': {
      const cpfSemMask = limpaCPF(estado.cpf)
      servicos
        .pesquiseProprietario(cpfSemMask)
        .then((proprietario) => {
          if (proprietario === null) {
            dispatch({type: 'REGISTRE_PROPRIETARIO_NAO_CADASTRADO'})
          } else {
            dispatch({type: 'REGISTRE_PROPRIETARIO_CADASTRADO', nome: proprietario.nome})
          }
        })
        .catch ((erro) => {
          dispatch({type: 'REGISTRE_ERRO_AO_PESQUISAR_PROPRIETARIO', msg: erro.message})
        })
      break
    }

    case 'CADASTRANDO_VEICULO': {
      const cpfSemMask = limpaCPF(estado.cpf)
      const placaSemMask = limpaPlaca(estado.placa)
      servicos
        .cadastreVeiculo(cpfSemMask, placaSemMask, parseInt(estado.ano))
        .then(({cadastrou, motivo}) => {
          if (!cadastrou)
            throw new Error(motivo)
          dispatch({type: 'REGISTRE_VEICULO_CADASTRADO'})
        })
        .catch((erro) => {
          dispatch({type: 'REGISTRE_VEICULO_NAO_CADASTRADO', msg: erro.message})
        })
      break
    }
    }
  }, [estado.situacao, estado.ano, estado.cpf, estado.placa])

 
  return [ estado, dispatch ]
}



function CadastraVeiculo (props: Props): React$Element<'div'> {

  const [ estado, dispatch ] = useModelo()

  const toastEl = useMsgsToast(estado)

  function onSubmit(ev) {
    ev.preventDefault() // evita envio de requisição ao servidor
    dispatch({type: 'CADASTRE'})
  }

  return (
    <Panel header='Cadastrar Veículo'>
      <Toast ref={toastEl}/> 
      <form onSubmit={onSubmit}>
        <p>
          CPF do Proprietário :
          <br/>
          <InputMask
            value={estado.cpf}
            onChange={ev => dispatch({type: 'ARMAZENE_CPF', cpf: ev.value})}
            onComplete={() => dispatch({type: 'REGISTRE_CPF_DEFINIDO'})}
            mask={util_masks.cpfMask}
            unmask={false}
            size={util_masks.cpfMask.length}/>
        </p>
        <p>
          Nome do Proprietário :
          <br/>
          <strong>{estado.nomeProprietario}</strong>
        </p>
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
        <p>
          Ano :
          <br/>
          <InputMask
            value={estado.ano}
            onComplete={() => dispatch({type: 'REGISTRE_ANO_DEFINIDO'})}
            onChange={ev => dispatch({type: 'ARMAZENE_ANO', ano: ev.value})}
            mask={util_masks.anoMask}
            unmask={false}
            size={util_masks.anoMask.length}/>
        </p>
        <Button
          label='Cadastrar'
          className='p-button-success'
          type='submit'
          disabled={!estado.cpfDefinido || estado.nomeProprietario === undefined 
                    || !estado.placaDefinida || !estado.anoDefinido}/>
        <Button
          label='Cancelar'
          className='p-button-danger'
          onClick={props.cancelar}/>
      </form>
    </Panel>
  )
}


export default CadastraVeiculo
