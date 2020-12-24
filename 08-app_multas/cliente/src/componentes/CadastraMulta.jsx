//@flow

import React, { useEffect, useReducer } from 'react'

import {Panel} from 'primereact/panel'
import {InputMask} from 'primereact/inputmask'
import {Button} from 'primereact/button'
import {Toast} from 'primereact/toast'

import servicos from '../servicos'
import util_masks, { limpaPlaca } from './util_masks'
import { useMsgsToast } from '../hooks/hooks'

type Props = {|
  cancelar: void => void
|}

type Situacao = 'DEFININDO_PLACA' | 'PESQUISANDO_VEICULO' | 'EDITANDO_MULTA' | 'CADASTRANDO_MULTA'

type Estado = {|
  situacao: Situacao,
  placa: string,
  placaDefinida: boolean,
  pontos: string,
  pontosDefinidos: boolean,
  msgSucesso: string | void,
  msgAviso: string | void,
  msgErro: string | void
|}

type Acao =
    {| type: 'CADASTRE_MULTA' |}
  | {| type: 'ARMAZENE_PLACA', placa: string |}
  | {| type: 'REGISTRE_PLACA_DEFINIDA' |}
  | {| type: 'ARMAZENE_PONTOS', pontos: string |}
  | {| type: 'REGISTRE_PONTOS_DEFINIDOS' |}
  | {| type: 'REGISTRE_MULTA_CADASTRADA', id: string |}
  | {| type: 'REGISTRE_ERRO_AO_CADASTRAR_MULTA', msg: string |}
  | {| type: 'REGISTRE_PLACA_CADASTRADA' |}
  | {| type: 'REGISTRE_PLACA_NAO_CADASTRADA' |}
  | {| type: 'REGISTRE_ERRO_AO_PESQUISAR_PLACA', msg: string |}



const estadoInicial: Estado = {
  situacao: 'DEFININDO_PLACA',
  placa: '',
  placaDefinida: false,
  pontos: '',
  pontosDefinidos: false,
  msgSucesso: undefined,
  msgAviso: undefined,
  msgErro: undefined
}



function reducer(estado: Estado, acao: Acao): Estado {
  switch (acao.type) {
  // ------------------------------------------
  // ações solicitadas diretamente pelo usuário
  // ------------------------------------------
  case 'CADASTRE_MULTA': 
    return {
      ...estado, 
      situacao: 'CADASTRANDO_MULTA',
      msgSucesso: undefined, 
      msgAviso: `Cadastrando multa do veículo ${estado.placa}`,
      msgErro: undefined
    }    

  case 'ARMAZENE_PLACA': {
    const novaPlaca = acao.placa.toUpperCase()
    return novaPlaca === estado.placa 
      ? estado 
      : {
        ...estado, 
        placa: novaPlaca, 
        placaDefinida: false, 
        situacao: 'DEFININDO_PLACA',
        msgSucesso: undefined,
        msgAviso: undefined,
        msgErro: undefined
      }      
  }

  case 'REGISTRE_PLACA_DEFINIDA':
    return {
      ...estado, 
      placaDefinida: true, 
      situacao: 'PESQUISANDO_VEICULO',
      msgSucesso: undefined, 
      msgAviso: `Pesquisando placa ${estado.placa}`,
      msgErro: undefined
    }

  case 'ARMAZENE_PONTOS':
    return estado.pontos === acao.pontos
      ? estado
      : {
        ...estado, 
        pontos: acao.pontos, 
        pontosDefinidos: false, 
        msgSucesso: undefined, 
        msgAviso: undefined, 
        msgErro: undefined
      }

  case 'REGISTRE_PONTOS_DEFINIDOS':
    return {...estado, pontosDefinidos: true}



    // --------------
    // ações internas
    // --------------    
  case 'REGISTRE_MULTA_CADASTRADA':
    return {...estadoInicial, msgSucesso: `Multa cadastrada com ID ${acao.id}`}

  case 'REGISTRE_ERRO_AO_CADASTRAR_MULTA':
    return {
      ...estado, 
      msgErro: acao.msg, 
      msgSucesso: undefined, 
      msgAviso: undefined, 
      situacao: 'DEFININDO_PLACA'
    }
  
  case 'REGISTRE_PLACA_NAO_CADASTRADA':
    return {
      ...estado,
      msgSucesso: undefined,
      msgAviso: undefined, 
      msgErro: `Placa ${estado.placa} não cadastrada!`, 
      placaDefinida: false, 
      situacao: 'DEFININDO_PLACA'
    }
    
  case 'REGISTRE_PLACA_CADASTRADA':
    return {
      ...estado,
      msgSucesso: undefined, 
      msgAviso: 'Placa cadastrada!',
      msgErro: undefined,
      situacao: 'EDITANDO_MULTA'
    }

  case 'REGISTRE_ERRO_AO_PESQUISAR_PLACA':
    return {
      ...estado,
      msgSucesso: undefined,
      msgAviso: undefined, 
      msgErro: acao.msg,
      placaDefinida: false, 
      situacao: 'DEFININDO_PLACA'
    }

  default:
    throw new Error(`Ação inválida: ${acao.type}`)
  }
}

function useModelo() {

  const [estado, dispatch] = useReducer(reducer, estadoInicial)

  useEffect(() => {
    switch (estado.situacao) {
    case 'PESQUISANDO_VEICULO':
      servicos
        .pesquiseVeiculo(limpaPlaca(estado.placa))
        .then((veiculo) => {
          const acao = veiculo === null 
            ? {type: 'REGISTRE_PLACA_NAO_CADASTRADA'} 
            : {type: 'REGISTRE_PLACA_CADASTRADA'}
          dispatch(acao)
        })
        .catch ((erro) => {
          dispatch({type: 'REGISTRE_ERRO_AO_PESQUISAR_PLACA', msg: erro.message})
        })
      break

    case 'CADASTRANDO_MULTA': {
      const placaSemMask = limpaPlaca(estado.placa)
      servicos
        .cadastreMulta(placaSemMask, parseInt(estado.pontos))
        .then(({id, motivo}) => {
          if (id === null)
            throw new Error(motivo)
          dispatch({type: 'REGISTRE_MULTA_CADASTRADA', id})
        })
        .catch((erro) => {
          dispatch({type: 'REGISTRE_ERRO_AO_CADASTRAR_MULTA', msg: erro.message})
        })
    }
    }
  }, [estado.situacao, estado.placa, estado.pontos])


 
  return [ estado,  dispatch ]
}

function  CadastraMulta (props: Props): React$Element<'div'> {
  const [ estado, dispatch ] = useModelo()

  const toastEl = useMsgsToast(estado)

  function onSubmit(ev) {
    ev.preventDefault()
    dispatch({type: 'CADASTRE_MULTA'})
  }

  return (
    <Panel header='Cadastrar Multa'>
      <Toast ref={toastEl}/>
      <form onSubmit={onSubmit}>
        <p>
          Placa :
          <br/>
          <InputMask
            value={estado.placa}
            placeholder={util_masks.placaMask}
            onChange={ev => dispatch({type: 'ARMAZENE_PLACA', placa: ev.value})}
            onComplete={() => dispatch({type: 'REGISTRE_PLACA_DEFINIDA'})}
            mask={util_masks.placaMask}
            unmask={false}
            size={util_masks.placaMask.length}/>
        </p>
        <p>
          Pontos :
          <br/>
          <InputMask
            value={estado.pontos}
            onChange={ev => dispatch({type: 'ARMAZENE_PONTOS', pontos: ev.value})}
            onComplete={() => dispatch({type: 'REGISTRE_PONTOS_DEFINIDOS'})}
            mask={util_masks.pontosMask}
            unmask={false}
            size={util_masks.pontosMask.length}/>
        </p>
        <Button
          label='Cadastrar'
          className='p-button-success'
          type='submit'
          disabled={!estado.placaDefinida || !estado.pontosDefinidos}/>
        <Button
          label='Cancelar'
          className='p-button-danger'
          onClick={props.cancelar}/>
      </form>
    </Panel>
  )
}


export default CadastraMulta
