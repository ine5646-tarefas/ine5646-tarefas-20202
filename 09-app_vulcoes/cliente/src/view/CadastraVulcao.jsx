// @flow
import React, {useReducer, useEffect, useRef} from 'react'
import MsgModal from './MsgModal.jsx'
import type {Token, ImagemEmBase64, ImagemEmURL, VulcaoParaCadastro} from '../tipos'
import {cadastraVulcao} from '../servicos'
import processaImagem , {converteImagemEmBase64URL} from '../util_img'

type Props = {|
  token: Token,
  onTokenInvalido: () => void,
  limiteImagem: number
|}

type Estado = {|
  arquivo: any | void,
  imagem: ImagemEmBase64 | void,
  miniatura: ImagemEmBase64 | void,
  url: ImagemEmURL,
  lendoDeURL: boolean,
  pais: string,
  nome: string,
  cadastrando: boolean,
  msgErro: string | void,
  msgModal: string | void,
  erro: boolean
|}

type Acao = 
    {| type: 'ARMAZENE_ARQUIVO', arquivo: any |}
  | {| type: 'REGISTRE_LENDO_IMAGEM' |}
  | {| type: 'REGISTRE_PROCESSANDO_IMAGEM' |}
  | {| type: 'REGISTRE_IMAGEM_LIDA', imagem: ImagemEmBase64, miniatura: ImagemEmBase64 |}
  | {| type: 'REGISTRE_IMAGEM_MUITO_GRANDE', limite: number, tamanho: number |}
  | {| type: 'REGISTRE_ERRO_AO_PROCESSAR_IMAGEM', msg: string |}
  | {| type: 'ARMAZENE_URL_IMAGEM', url: string |}
  | {| type: 'LEIA_IMAGEM_DE_URL' |}
  | {| type: 'ARMAZENE_NOME', nome: string |}
  | {| type: 'ARMAZENE_PAIS', pais: string |}
  | {| type: 'CADASTRE_VULCAO' |}
  | {| type: 'REGISTRE_CADASTRO_COM_SUCESSO' |}
  | {| type: 'REGISTRE_ERRO_AO_CADASTRAR' |}
  | {| type: 'AVISE_CADASTRANDO' |}

type Dispatch = Acao => void
type Modelo = [Estado, Dispatch]

const estadoInicial: Estado = {
  arquivo: undefined,
  imagem: undefined,
  miniatura: undefined,
  url: '',
  lendoDeURL: false,
  nome: '',
  pais: '',
  cadastrando: false,
  msgErro: undefined,
  msgModal: undefined,
  erro: false
}


function reducer(estado: Estado, acao: Acao): Estado {
  switch (acao.type) {
  case 'ARMAZENE_NOME':
    return {...estado, nome: acao.nome}

  case 'ARMAZENE_PAIS':
    return {...estado, pais: acao.pais}

  case 'ARMAZENE_ARQUIVO':
    return {...estado, arquivo: acao.arquivo, lendoDeURL: false, url: ''}

  case 'REGISTRE_LENDO_IMAGEM':
    return {...estado, msgModal: 'Lendo imagem...'}

  case 'REGISTRE_PROCESSANDO_IMAGEM':
    return {...estado, msgModal: 'Processando imagem...'}

  case 'REGISTRE_IMAGEM_LIDA': {
    const url = estado.lendoDeURL ? estado.url : ''
    return {
      ...estado, 
      arquivo: undefined, 
      imagem: acao.imagem, 
      miniatura: acao.miniatura, 
      msgModal: undefined, 
      msgErro: undefined, 
      url,
      lendoDeURL: false
    }
  }

  case 'REGISTRE_IMAGEM_MUITO_GRANDE':
    return {
      ...estado, 
      imagem: undefined, 
      miniatura: undefined, 
      arquivo: undefined, 
      msgErro: `Tamanho da imagem (${acao.tamanho} bytes) maior que limite de ${acao.limite} bytes.`, 
      msgModal: undefined,
      lendoDeURL: false
    }

  case 'REGISTRE_ERRO_AO_PROCESSAR_IMAGEM':
    return {
      ...estado, 
      msgErro: acao.msg, 
      msgModal: undefined, 
      arquivo: undefined, 
      imagem: undefined, 
      miniatura: undefined,
      lendoDeURL: false
    }

  case 'ARMAZENE_URL_IMAGEM':
    return {
      ...estado, 
      url: acao.url, 
      lendoDeURL: false, 
      msgErro: undefined, 
      msgModal: undefined, 
      imagem: undefined, 
      miniatura: undefined, 
      arquivo: undefined
    }
    
  case 'LEIA_IMAGEM_DE_URL':
    return {...estado, lendoDeURL: true, msgModal: 'Processando imagem...', arquivo: undefined}

  case 'CADASTRE_VULCAO':
    return {...estado, cadastrando: true}

  case 'REGISTRE_CADASTRO_COM_SUCESSO':
    return estadoInicial

  case 'REGISTRE_ERRO_AO_CADASTRAR': {
    return {...estadoInicial, erro: true}
  }

  case 'AVISE_CADASTRANDO': 
    return {...estado, msgModal: 'Cadastrando...'}

  default:
    throw new Error(`BUG: acao.type inválido: ${acao.type}`)
  }
}

function useModelo(props: Props): Modelo {

  const onTokenInvalido = props.onTokenInvalido
  const [estado, dispatch] = useReducer(reducer, estadoInicial)

  useEffect(() => {
    if (estado.erro)
      onTokenInvalido()
  }, [estado.erro, onTokenInvalido])

  useEffect(() => {
    if (estado.arquivo) {
      const leitor = new window.FileReader()
      leitor.onloadstart = () => dispatch({type: 'REGISTRE_LENDO_IMAGEM'})
      leitor.onload = img => {
        dispatch({type: 'REGISTRE_PROCESSANDO_IMAGEM'})
        processaImagem(img.target.result)
          .then(({imagem, miniatura}) => {
            if (imagem.length <= props.limiteImagem)
              dispatch({type: 'REGISTRE_IMAGEM_LIDA', imagem, miniatura})
            else
              dispatch({type: 'REGISTRE_IMAGEM_MUITO_GRANDE', limite: props.limiteImagem, tamanho: imagem.length})
          })
          .catch(erro => dispatch({type: 'REGISTRE_ERRO_AO_PROCESSAR_IMAGEM', msg: erro.message}))
      }
      leitor.readAsDataURL(estado.arquivo)
    }
  }, [estado.arquivo, props.limiteImagem])


  useEffect(() => {
    if (estado.lendoDeURL) {
      converteImagemEmBase64URL(estado.url)
        .then(imagem => processaImagem(imagem))
        .then(({imagem, miniatura}) => {
          if (imagem.length <= props.limiteImagem)
            dispatch({type: 'REGISTRE_IMAGEM_LIDA', imagem, miniatura})
          else
            dispatch({type: 'REGISTRE_IMAGEM_MUITO_GRANDE', limite: props.limiteImagem, tamanho: imagem.length})
        })
        .catch(erro => dispatch({type: 'REGISTRE_ERRO_AO_PROCESSAR_IMAGEM', msg: erro.message}))    
    }
  }, [estado.lendoDeURL, estado.url, props.limiteImagem])


  useEffect(() => {
    if (estado.cadastrando) {
      //
      // obs: a expressão || '' abaixo é usada apenas para enganar o flow pois
      // estado.imagem pode ser do tipo string ou do tipo void enquanto que 
      // vulcao.imagem só pode ser do tipo string. Non entanto, quando estamos
      // cadastrando imagem e miniatura contêm dados do tipo string
      //
      const vulcao: VulcaoParaCadastro = {
        imagem: estado.imagem || '',
        miniatura: estado.miniatura || '',
        nome: estado.nome,
        pais: estado.pais
      }
      cadastraVulcao(vulcao, props.token)
        .then(() => dispatch({type: 'REGISTRE_CADASTRO_COM_SUCESSO'}))
        .catch(() => dispatch({type: 'REGISTRE_ERRO_AO_CADASTRAR'}))
    }
  }, [estado.cadastrando, estado.imagem, estado.miniatura, estado.nome, estado.pais, props.token])


  return [estado, dispatch]
}


function CadastraVulcao (props: Props): React$Element<'div'> {
  const arquivo = useRef<any>()
  const [estado, dispatch] = useModelo(props)


  function podeCadastrar() {
    return estado.imagem !== undefined 
      && estado.miniatura !== undefined
      && estado.nome !== ''
      && estado.pais !== '' 
      && !estado.cadastrando
  }

  return (
    <div className='message is-primary'>
      <div className='message-header'>Cadastrar Vulcão</div>
      <div className='message-body'>
        <div className='field'>
          <label className='label'>Imagem de Arquivo Local</label>
          <div className='control'>
            <input type='file'
              ref={arquivo}
              onChange={() => dispatch({type: 'ARMAZENE_ARQUIVO', arquivo: arquivo.current.files[0]})}
              style={{display: 'none'}}
            />
            <button className='button is-info' onClick={() => arquivo.current.click()}>
              Escolha Arquivo...
            </button>
          </div>
        </div>

        <div className='field'>
          <label className='label'>Imagem de URL</label>
          <div className='control'>
            <input className='input'
              type='text' value={estado.url}
              placeholder='URL da imagem'
              onChange={(ev) => dispatch({type: 'ARMAZENE_URL_IMAGEM', url: ev.target.value})}/>
            <button className='button is-info'
              disabled={estado.url.length ==0}
              onClick={() => dispatch({type: 'LEIA_IMAGEM_DE_URL'})}>
                Obter Imagem
            </button>
          </div>
        </div>

        <div className='field'>
          <label className='label'>Imagem</label>
          <div className='control'>
            <img src={estado.imagem}/>
          </div>
        </div>

        <div className='field'>
          <label className='label'>Nome</label>
          <div className='control'>
            <input className='input' type='text'
              placeholder='nome do vulcão'
              value={estado.nome}
              onChange={(ev) => dispatch({type: 'ARMAZENE_NOME', nome: ev.target.value})}/>
          </div>
        </div>
        <div className='field'>
          <label className='label'>País</label>
          <div className='control'>
            <input className='input' type='text'
              placeholder='país do vulcão'
              value={estado.pais}
              onChange={(ev) => dispatch({type: 'ARMAZENE_PAIS', pais: ev.target.value})}/>
          </div>
        </div>

        <button className='button is-success' 
          onClick={() => dispatch({type: 'CADASTRE_VULCAO'})} disabled={!podeCadastrar()} >
            Cadastrar
        </button>

        { estado.msgModal !== undefined && <MsgModal msg= {estado.msgModal}/> }
        {
          estado.msgErro !== undefined &&
            <div className='notification is-danger'>
              {estado.msgErro}
            </div>
        }
      </div>
    </div>
  )
}

export default CadastraVulcao
