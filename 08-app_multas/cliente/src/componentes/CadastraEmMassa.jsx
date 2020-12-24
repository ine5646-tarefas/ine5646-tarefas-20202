//@flow

import React, {useEffect, useReducer} from 'react'

import {Panel} from 'primereact/panel'
import {InputTextarea} from 'primereact/inputtextarea'
import {Button} from 'primereact/button'
import {Card} from 'primereact/card'
import {Toast} from 'primereact/toast'

import servicos from '../servicos'
import {useMsgsToast} from '../hooks/hooks'

type TipoDeCadastro = 'proprietario' | 'veiculo' | 'multa'

type Estado = {|
  tipo: TipoDeCadastro,
  cadastrando: boolean,
  dados: string,
  msgErro: string | void,
  msgAviso: string | void,
  msgSucesso: string | void
|}

type Acao = 
    {| type: 'GUARDE_DADOS', dados: string |}
  | {| type: 'CADASTRE' |}
  | {| type: 'REGISTRE_DADOS', dados: string, msg: {|tipo: 'sucesso' | 'aviso', texto: string |} |}
  | {| type: 'REGISTRE_ERRO', msgErro: string |}

  

function reducer(estado: Estado, acao: Acao): Estado {
  switch (acao.type) {
  case 'GUARDE_DADOS':
    return {...estado, dados: acao.dados, cadastrando: false, msgSucesso: undefined, msgAviso: undefined, msgErro: undefined}
      
  case 'CADASTRE':{
    let msgAviso
    switch (estado.tipo) {
    case 'proprietario':
      msgAviso = 'Cadastrando proprietários...'
      break

    case 'veiculo':
      msgAviso = 'Cadastrando veículos...'
      break

    case 'multa':
      msgAviso = 'Cadastrando multas...'
      break
    }
    return {...estado, cadastrando: true, msgSucesso: undefined, msgAviso, msgErro: undefined}
  }

  case 'REGISTRE_DADOS':
    if (acao.msg.tipo === 'sucesso')
      return {...estado, dados: acao.dados, msgSucesso: acao.msg.texto, cadastrando: false}
    else
      return {...estado, dados: acao.dados, msgAviso: acao.msg.texto, cadastrando: false}

  case 'REGISTRE_ERRO':
    return {...estado, msgSucesso: undefined, msgAviso: undefined, msgErro: acao.msgErro, cadastrando: false}

  default:
    throw Error(`Ação inválida: ${acao.type}`)
  }
}

function useModelo(tipo: TipoDeCadastro) {

  const estadoInicial: Estado = {
    tipo,
    cadastrando: false,
    dados: '',
    msgErro: undefined,
    msgAviso: undefined,
    msgSucesso: undefined
  
  }

  const [estado, dispatch] = useReducer(reducer, estadoInicial)

  
  useEffect(() => {
    if (estado.cadastrando) 
      switch (tipo) {
      case 'proprietario':
        servicos
          .cadastreProprietariosEmMassa(estado.dados)
          .then((dadosInvalidos) => {
            const dados = dadosInvalidos.reduce((a,b) => `${a}${b}\n`, '')
            const msg = dados.length === 0 
              ? {tipo: 'sucesso', texto:'Todos proprietários cadastrados!'}
              : {tipo: 'aviso', texto: 'Problemas para cadastrar!'}
            dispatch({type: 'REGISTRE_DADOS', dados, msg})
          })
          .catch((erro) => {
            dispatch({type: 'REGISTRE_ERRO', msgErro: erro.message})
          })  
        break

      case 'veiculo':
        servicos
          .cadastreVeiculosEmMassa(estado.dados)
          .then((dadosInvalidos) => {
            const dados = dadosInvalidos.reduce((a,b) => `${a}${b}\n`, '')
            const msg = dados.length === 0 
              ? {tipo: 'sucesso', texto:'Todos veículos cadastrados!'}
              : {tipo: 'aviso', texto: 'Problemas para cadastrar!'}
            dispatch({type: 'REGISTRE_DADOS', dados, msg})
          })
          .catch((erro) => {
            dispatch({type: 'REGISTRE_ERRO', msgErro: erro.message})
          })
        break

      case 'multa':
        servicos
          .cadastreMultasEmMassa(estado.dados)
          .then((dadosInvalidos) => {
            const dados = dadosInvalidos.reduce((a,b) => `${a}${b}\n`, '')
            const msg = dados.length === 0 
              ? {tipo: 'sucesso', texto:'Toda as multas cadastradas!'}
              : {tipo: 'aviso', texto: 'Problemas para cadastrar!'}
            dispatch({type: 'REGISTRE_DADOS', dados, msg})
          })
          .catch((erro) => {
            dispatch({type: 'REGISTRE_ERRO', msgErro: erro.message})
          })  
        break

      default:
        dispatch({type: 'REGISTRE_ERRO', msgErro: `Bug!! Tipo ${tipo} inválido.`})
      }

  }, [estado.cadastrando, estado.dados, tipo])

  
  return [estado, dispatch]
}

type Props = {| 
  tipo: 'proprietario' | 'veiculo' | 'multa',
  orientacoes: {| titulo: string, subtitulo: string, exemplo: string |},
  cancelar: void => void
|}

function CadastraEmMassa (props: Props): React$Element<'div'> {
  const [ estado, dispatch ] = useModelo(props.tipo)
  const toastEl = useMsgsToast(estado)

  return (
    <Panel header={props.orientacoes.titulo}>
      <Toast ref={toastEl}/>
      <Card title='Instruções' subTitle={props.orientacoes.subtitulo}>
        <span>Exemplo: <br/>{props.orientacoes.exemplo}</span>
      </Card>
      <InputTextarea
        rows={10}
        cols={30}
        value={estado.dados}
        onChange={(ev) => dispatch({type: 'GUARDE_DADOS', dados: ev.target.value})}/>
      <br/>
      <Button
        label='Cadastrar'
        className='p-button-success'
        disabled={estado.dados === '' || estado.cadastrando}
        onClick={() => dispatch({type: 'CADASTRE'})}/>
      <Button
        label='Cancelar'
        className='p-button-danger'
        onClick={props.cancelar}/>
    </Panel>
  )
}

export default CadastraEmMassa
