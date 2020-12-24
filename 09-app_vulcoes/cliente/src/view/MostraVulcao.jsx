// @flow
import React, {useReducer, useEffect} from 'react'
import type {Token, IdVulcao, Vulcao, ImagemEmBase64} from '../tipos'
import { buscaImagemNoBanco } from '../servicos'
import MsgModal from './MsgModal.jsx'

type Props = {|
    token: Token,
    id: IdVulcao,
    vulcao: Vulcao,
    onDelete: (SyntheticEvent<HTMLButtonElement>) => void
|}

type Estado = {|
  vulcao: Vulcao,
  textoBotao: string,
  imagem: ImagemEmBase64 | void,
  mostrando: boolean,
  lendo: boolean
|}

type Acao =
    {| type: 'EXIBA_OU_OCULTE_IMAGEM' |}
  | {| type: 'REGISTRE_IMAGEM_LIDA', imagem: ImagemEmBase64|}
  | {| type: 'REGISTRE_ERRO_AO_LER_IMAGEM' |}

type Dispatch = Acao => void

type Modelo = [Estado, Dispatch]

function obtemTexto(vulcao: Vulcao) {
  return `${vulcao.nome} - ${vulcao.pais}`
}

function defineEstadoInicial(vulcao: Vulcao): Estado {

  const estadoInicial: Estado = {
    vulcao,
    mostrando: false,
    lendo: false,
    textoBotao: obtemTexto(vulcao),
    imagem: undefined
  }

  return estadoInicial
}

function reducer(estado: Estado, acao: Acao): Estado {
  switch (acao.type) {
  case 'EXIBA_OU_OCULTE_IMAGEM': {
    let novoEstado
    if (estado.mostrando)
      novoEstado = {...estado, mostrando: false, textoBotao: obtemTexto(estado.vulcao)}
    else 
    if (estado.imagem !== undefined) 
      novoEstado = {...estado, mostrando: true, textoBotao: 'Ocultar' }
    else
      novoEstado = {...estado, lendo: true}
    return novoEstado
  }

  case 'REGISTRE_IMAGEM_LIDA':
    return {
      ...estado, 
      mostrando: true, 
      lendo: false, 
      textoBotao: 'Ocultar', 
      imagem: acao.imagem
    }

  case 'REGISTRE_ERRO_AO_LER_IMAGEM':
    return {
      ...estado, 
      mostrando: true, 
      lendo: false, 
      imagem: estado.vulcao.miniatura, 
      textoBotao: 'Ocultar miniatura'
    }

  default:
    throw new Error(`BUG: acao.type invalido: ${acao.type}`)
  }
}


function useModelo(props: Props): Modelo {

  const [estado, dispatch] = useReducer(reducer, props.vulcao, defineEstadoInicial)


  useEffect(() => {
    if (estado.lendo) {
      buscaImagemNoBanco(props.token, props.id)
        .then(imagem => dispatch({type: 'REGISTRE_IMAGEM_LIDA', imagem}))
        .catch(() => dispatch({type: 'REGISTRE_ERRO_AO_LER_IMAGEM'}))
    }
  }, [estado.lendo, props.token, props.id])

  return [estado, dispatch]
}

function MostraVulcao (props: Props): React$Element<'div' | 'span'>{
  const [estado, dispatch] = useModelo(props)


  if (estado.lendo)
    return <span> <MsgModal msg={`lendo ${props.vulcao.nome} -- ${props.vulcao.pais} ...`}/></span>

  let conteudo

  if (estado.mostrando) {
    conteudo =
        <div className='notification is-info'>
          <div className='title'>
            {props.vulcao.nome} - {props.vulcao.pais}
          </div>
          <img src={estado.imagem}/>
          <button className='button is-link'
            onClick={() => dispatch({type: 'EXIBA_OU_OCULTE_IMAGEM'})}>
            {estado.textoBotao}
          </button>
          <button className='button is-danger'
            data-id={props.id}
            onClick={props.onDelete}>
            Apagar
          </button>
        </div>
  } else {
    conteudo =
          <div>
            <button className='button is-link is-rounded'
              onClick={() => dispatch({type: 'EXIBA_OU_OCULTE_IMAGEM'})}>
              {estado.textoBotao}
            </button>
            <img src={props.vulcao.miniatura}
              onClick={() => dispatch({type: 'EXIBA_OU_OCULTE_IMAGEM'})}/>
          </div>
  }
  return (
    <div>
      {conteudo}
    </div>
  )
}

export default MostraVulcao
