//@flow

import {useReducer, useEffect} from 'react'
import type {Login, MensagemRecebida, MensagemEnviada, Leilao, Lance, Oferta} from './tipos'

import {useWS} from './useWS'

type QueroGeral =
  {| fazer: 'NADA' |}
| {| fazer: 'SAIR_DO_SISTEMA' |}
| {| fazer: 'ENTRAR_NO_SISTEMA', login: Login |}
| {| fazer: 'AGUARDAR_RESULTADO_DE_LOGIN', login: Login |}

type QueroMeuLeilao = 
  {| fazer: 'NADA' |}
| {| fazer: 'ABRIR_LEILAO', vendedor: Login, nomeProduto: string, precoMinimo: number |}
| {| fazer: 'FECHAR_LEILAO', vendedor: Login |}
| {| fazer: 'REMOVER_LEILAO', vendedor: Login |}


type QueroOutroLeilao = 
  {| fazer: 'NADA' |}
| {| fazer: 'ENVIAR_LANCE', lance: Lance |}
| {| fazer: 'PARTICIPAR_DE_LEILAO', vendedor: Login |}
| {| fazer: 'ABANDONAR_LEILAO', vendedor: Login |}

export type SituacaoMeuLeilao = 
{| sit: 'inicial' |} | 
{| sit: 'definindo' |} |
{| sit: 'leiloando', leilao: Leilao |} | 
{| sit: 'final', leilao: Leilao |}

type Estado = {|
  leiloes: Array<Leilao>,
  situacaoMeuLeilao: SituacaoMeuLeilao,
  optOutroLeilao: void | Leilao,
  optUsuario: void | Login,
  queroGeral: QueroGeral,
  queroMeuLeilao: QueroMeuLeilao,
  queroOutroLeilao: QueroOutroLeilao,
  optMsgLogin: void | string,
  loginNaoAceito: boolean,
  usuarios: Array<Login>
|}

type Acao = 
  {| type: 'QUERO_FAZER_NADA_MEU_LEILAO' |}
| {| type: 'QUERO_FAZER_NADA_OUTRO_LEILAO' |}
| {| type: 'QUERO_SAIR_DO_SISTEMA' |}
| {| type: 'QUERO_ENTRAR_NO_SISTEMA', login: Login |}
| {| type: 'QUERO_AGUARDAR_RESULTADO_DE_LOGIN', login: Login |}
| {| type: 'QUERO_DEFINIR_MEU_LEILAO' |}
| {| type: 'QUERO_DESISTIR_DO_MEU_LEILAO' |}
| {| type: 'QUERO_ABRIR_MEU_LEILAO', nomeProduto: string, precoMinimo: number |}
| {| type: 'QUERO_FECHAR_MEU_LEILAO' |}
| {| type: 'QUERO_REMOVER_MEU_LEILAO' |}
| {| type: 'QUERO_PARTICIPAR_DE_LEILAO', vendedor: Login |}
| {| type: 'QUERO_SAIR_DE_OUTRO_LEILAO' |}
| {| type: 'QUERO_ENVIAR_LANCE', lance: Lance |}
| {| type: 'QUERO_ABANDONAR_LEILAO'|}
| {| type: 'REGISTRE_USUARIOS_ONLINE', usuarios: Array<Login> |}
| {| type: 'REGISTRE_USUARIO_ENTROU', usuario: Login |}
| {| type: 'REGISTRE_USUARIO_SAIU', usuario: Login |}
| {| type: 'REGISTRE_LOGIN_ACEITO' |}
| {| type: 'REGISTRE_LOGIN_NAO_ACEITO' |}
| {| type: 'REGISTRE_ESTADO_INICIAL' |}
| {| type: 'REGISTRE_LEILAO_ABERTO', leilao: Leilao |}
| {| type: 'REGISTRE_LEILAO_FECHADO', leilao: Leilao |}
| {| type: 'REGISTRE_LEILOES_ABERTOS', leiloes: Array<Leilao> |}
| {| type: 'REGISTRE_ENTROU_EM_LEILAO', leilao: Leilao |}
| {| type: 'REGISTRE_NOVO_USUARIO_EM_LEILAO', comprador: Login, vendedor: Login |}
| {| type: 'REGISTRE_LANCE_ACEITO', lance: Lance |}
| {| type: 'REGISTRE_LEILAO_ABANDONADO', comprador: Login, vendedor: Login |}


const estadoInicial: Estado = {
  queroGeral: {fazer: 'NADA'},
  queroMeuLeilao: {fazer: 'NADA'},
  queroOutroLeilao: {fazer: 'NADA'},
  leiloes: [],
  situacaoMeuLeilao: {sit: 'inicial'},
  optOutroLeilao: undefined,
  optUsuario: undefined,
  optMsgLogin: undefined,
  loginNaoAceito: false,
  usuarios: []
}

function reducer(estado: Estado, acao: Acao): Estado {
  switch (acao.type) {
  case 'QUERO_FAZER_NADA_MEU_LEILAO':
    return {...estado, queroMeuLeilao: {fazer: 'NADA'}}

  case 'QUERO_FAZER_NADA_OUTRO_LEILAO':
    return {...estado, queroOutroLeilao: {fazer: 'NADA'}}

  case 'QUERO_SAIR_DO_SISTEMA':
    return {...estado, queroGeral: {fazer: 'SAIR_DO_SISTEMA'}}

  case 'QUERO_ENTRAR_NO_SISTEMA':
    return {
      ...estado, 
      queroGeral: {fazer: 'ENTRAR_NO_SISTEMA', login: acao.login }, 
      optMsgLogin: 'Fazendo login...'
    }

  case 'QUERO_AGUARDAR_RESULTADO_DE_LOGIN':
    return {...estado, queroGeral: {fazer: 'AGUARDAR_RESULTADO_DE_LOGIN', login: acao.login}}

  case 'QUERO_DEFINIR_MEU_LEILAO':
    return {...estado, situacaoMeuLeilao: {sit: 'definindo'}}

  case 'QUERO_DESISTIR_DO_MEU_LEILAO': 
    return {...estado, situacaoMeuLeilao: {sit: 'inicial'}}

  case 'QUERO_ABRIR_MEU_LEILAO': 
    if (estado.optUsuario !== undefined)
      return {
        ...estado, 
        queroMeuLeilao: {
          fazer: 'ABRIR_LEILAO', 
          vendedor: estado.optUsuario, 
          nomeProduto: acao.nomeProduto, 
          precoMinimo: acao.precoMinimo
        }
      }
    else {
      console.error('Erro', estado)
      return estado
    }
  
  case 'QUERO_FECHAR_MEU_LEILAO':
    if (estado.situacaoMeuLeilao.sit === 'leiloando')
      return {
        ...estado, 
        queroMeuLeilao: {fazer: 'FECHAR_LEILAO', vendedor: estado.situacaoMeuLeilao.leilao.vendedor}
      }
    else {
      console.error('Erro', estado)
      return estado
    }

  case 'QUERO_REMOVER_MEU_LEILAO':
    if (estado.situacaoMeuLeilao.sit === 'final')
      return {
        ...estado, 
        situacaoMeuLeilao: {sit: 'inicial'}, 
        queroMeuLeilao: {
          fazer: 'REMOVER_LEILAO', 
          vendedor: estado.situacaoMeuLeilao.leilao.vendedor
        }
      }
    else {
      console.error('Erro', estado)
      return estado
    }

  case 'QUERO_ABANDONAR_LEILAO': {
    if (estado.optOutroLeilao !== undefined) {
      return {
        ...estado,
        optOutroLeilao: undefined, 
        queroOutroLeilao: {
          fazer: 'ABANDONAR_LEILAO', 
          vendedor: estado.optOutroLeilao.vendedor
        }
      }
    }
    else {
      console.warn('Ação incoerente', estado, acao)
      return estado
    }
  }

  case 'REGISTRE_USUARIOS_ONLINE':
    return {...estado, usuarios: acao.usuarios}

  case 'REGISTRE_USUARIO_ENTROU':
    return {...estado, usuarios: [...estado.usuarios, acao.usuario]}
            
  case 'REGISTRE_USUARIO_SAIU':
    return {...estado, usuarios: estado.usuarios.filter(u => u !== acao.usuario)}
          
  case 'REGISTRE_LOGIN_ACEITO':
    if (estado.queroGeral.fazer === 'AGUARDAR_RESULTADO_DE_LOGIN')
      return {...estado, loginNaoAceito: false, optUsuario: estado.queroGeral.login, queroGeral: {fazer: 'NADA'}}
    else
      return {...estado, optMsgLogin: 'Erro no sistema: 01'}

  case 'REGISTRE_LOGIN_NAO_ACEITO':
    return {...estado, optMsgLogin: 'Login já utilizado', loginNaoAceito: true, queroGeral: {fazer: 'NADA'}}

  case 'REGISTRE_ESTADO_INICIAL':
    return estadoInicial

  case 'REGISTRE_LEILAO_ABERTO': {
    if (acao.leilao.vendedor === estado.optUsuario)
      return {...estado, situacaoMeuLeilao: {sit: 'leiloando', leilao: acao.leilao}}
    else
      return {...estado, leiloes: [...estado.leiloes, acao.leilao]}
  }

  case 'REGISTRE_LEILAO_FECHADO': {
    if (acao.leilao.vendedor === estado.optUsuario)
      return {...estado, situacaoMeuLeilao: {sit: 'final', leilao: acao.leilao}}
    else {
      let optOutroLeilao = estado.optOutroLeilao
      if (estado.optOutroLeilao !== undefined && estado.optOutroLeilao.vendedor === acao.leilao.vendedor)
        optOutroLeilao = acao.leilao
      const leiloes = estado.leiloes.filter(l => l.vendedor !== acao.leilao.vendedor)
      return {...estado, optOutroLeilao, leiloes}
    }
  }

  case 'QUERO_PARTICIPAR_DE_LEILAO':
    return {...estado, queroOutroLeilao: {fazer: 'PARTICIPAR_DE_LEILAO', vendedor: acao.vendedor}}

  case 'QUERO_ENVIAR_LANCE': 
    return {...estado, queroOutroLeilao: {fazer: 'ENVIAR_LANCE', lance: acao.lance}}

  case 'QUERO_SAIR_DE_OUTRO_LEILAO':
    return {...estado, optOutroLeilao: undefined}

  case 'REGISTRE_LEILOES_ABERTOS':
    return {...estado, leiloes: acao.leiloes}

  case 'REGISTRE_ENTROU_EM_LEILAO':
    return {...estado, optOutroLeilao: acao.leilao}
    

  case 'REGISTRE_NOVO_USUARIO_EM_LEILAO':
    // há três casos: 
    // 1) não estou leiloando nem participando de leilão
    // 2) estou leiloando
    // 3) estou participando do leilão

    // caso 1
    if (estado.situacaoMeuLeilao.sit !== 'leiloando' && estado.optOutroLeilao === undefined)
      return estado
    else // caso 2
    if (estado.situacaoMeuLeilao.sit === 'leiloando' && estado.situacaoMeuLeilao.leilao.vendedor === acao.vendedor) {
      const participantes = [...estado.situacaoMeuLeilao.leilao.participantes, acao.comprador]
      const leilao = {...estado.situacaoMeuLeilao.leilao, participantes}
      return {...estado, situacaoMeuLeilao: {...estado.situacaoMeuLeilao, leilao}}
    } else {
      // caso 3
      if (estado.optOutroLeilao !== undefined && estado.optOutroLeilao.vendedor === acao.vendedor) {
        const participantes = [...estado.optOutroLeilao.participantes, acao.comprador]
        const optOutroLeilao: Leilao = {...estado.optOutroLeilao, participantes}
        return {...estado, optOutroLeilao}
      } else {
        console.error('acao inconsistente', estado, acao)
        return estado
      }
    }

  case 'REGISTRE_LANCE_ACEITO':
    // há dois casos: 
    // 1) a mensagem chegou para quem está leiloando o produto
    // 2) a mensagem chegou para quem está participando do leilão do produto

    // caso 1
    if (estado.situacaoMeuLeilao.sit === 'leiloando' && acao.lance.vendedor === estado.optUsuario) {
      const produto = {
        ...estado.situacaoMeuLeilao.leilao.produto, 
        melhorOferta: {valor: acao.lance.valor, comprador: acao.lance.comprador}
      }

      const leilao = {...estado.situacaoMeuLeilao.leilao, produto}
      return {...estado, situacaoMeuLeilao: {...estado.situacaoMeuLeilao, leilao}}
    } else {
      // caso 2
      if (estado.optOutroLeilao !== undefined && estado.optOutroLeilao.vendedor === acao.lance.vendedor) {
        const melhorOferta: Oferta = {
          comprador: acao.lance.comprador,
          valor: acao.lance.valor
        }
        const optOutroLeilao: Leilao = {
          ...estado.optOutroLeilao,
          produto: {...estado.optOutroLeilao.produto, melhorOferta}
        }
        return {...estado, optOutroLeilao}
      } else {
        console.error('acao inconsistente', estado, acao)
        return estado
      }
    }
        
  case 'REGISTRE_LEILAO_ABANDONADO': {
    // há três casos:
    // 1) sou o cara que criou o leilao que foi abandonado por outro cara
    // 2) sou o cara que também está no leilão que foi abandonado por outro cara
    // 3) não deveria ter recebido esta mensagem

    // caso 1
    if (estado.situacaoMeuLeilao.sit === 'leiloando' && estado.situacaoMeuLeilao.leilao.vendedor === acao.vendedor) {
      const l: Leilao = {...estado.situacaoMeuLeilao.leilao}
      l.participantes = l.participantes.filter( p => p !== acao.comprador)
      const situacao: SituacaoMeuLeilao = {sit: 'leiloando', leilao: l}
      return {...estado, situacaoMeuLeilao: situacao}
    }
    else {
      // caso 2
      if (estado.optOutroLeilao !== undefined && estado.optOutroLeilao.vendedor === acao.vendedor) {
        const l: Leilao = {...estado.optOutroLeilao}
        l.participantes = l.participantes.filter( p => p !== acao.comprador)
        return {...estado, optOutroLeilao: l}
      }
      // caso 3
      console.warn('Não deveria ter recebido', estado, acao)
      return estado
    }
  }

  default:
    console.warn('acao nao tratada', acao)
    break
  }
  return estado
}

export default function useRedux(): [Estado, Acao => void] {
  const [estado, dispatch] = useReducer<Estado, Acao>(reducer, estadoInicial)
  const protocolo: 'ws:' | 'wss:' = window.location.protocol === 'http:' ? 'ws:' : 'wss:'
  const urlServidorWS = `${protocolo}//${window.location.host}/conecta`

  const [evtConexao: EventoConexao, evtMsg: EventoMsg, cws: ComandosWS] = 
    useWS({endereco: urlServidorWS, protocolo: 'p1'})


  useEffect(() => {
    if (evtMsg !== undefined) {
      const msg: MensagemRecebida = JSON.parse(evtMsg)
      switch (msg.type) {
      case 'USUARIOS_ONLINE':        
        dispatch({type: 'REGISTRE_USUARIOS_ONLINE', usuarios: msg.usuarios})
        break

      case 'USUARIO_ENTROU':
        dispatch({type: 'REGISTRE_USUARIO_ENTROU', usuario: msg.login})
        break

      case 'USUARIO_SAIU':
        dispatch({type: 'REGISTRE_USUARIO_SAIU', usuario: msg.login})
        break

      case 'NOVO_USUARIO_EM_LEILAO': 
        dispatch({type: 'REGISTRE_NOVO_USUARIO_EM_LEILAO', vendedor: msg.vendedor, comprador: msg.comprador})
        break
            
      case 'LANCE_ACEITO':
        dispatch({type: 'REGISTRE_LANCE_ACEITO', lance: msg.lance})
        break

      case 'LEILAO_ABERTO': 
        dispatch({type: 'REGISTRE_LEILAO_ABERTO', leilao: msg.leilao})
        break

      case 'LEILAO_FECHADO': 
        dispatch({type: 'REGISTRE_LEILAO_FECHADO', leilao: msg.leilao})
        break
        
      case 'LEILOES_ABERTOS':
        dispatch({type: 'REGISTRE_LEILOES_ABERTOS', leiloes: msg.leiloes})
        break

      case 'ENTROU_EM_LEILAO':
        dispatch({type: 'REGISTRE_ENTROU_EM_LEILAO', leilao: msg.leilao})
        break
      
      case 'LEILAO_ABANDONADO':
        dispatch({type: 'REGISTRE_LEILAO_ABANDONADO', comprador: msg.comprador, vendedor: msg.vendedor})
        break
      default: 
        console.error('Mensagem recebida e não tratada', msg)
      }
    }

  }, [evtMsg])

  //
  // efeito: processar evento de conexão enviado pelo servidor
  //  
  useEffect(() => {
    if (evtConexao !== 'NADA') {
      switch (evtConexao) {
      case 'CONECTOU' : {
        dispatch({type: 'REGISTRE_LOGIN_ACEITO'})
        break
      }
      case 'ERRO' : {
        dispatch({type: 'REGISTRE_LOGIN_NAO_ACEITO'})
        break
      }
      case 'FECHOU' : {
        if (!estado.loginNaoAceito)
          dispatch({type: 'REGISTRE_ESTADO_INICIAL'})
        break
      }
      }
    }
  }, [evtConexao, estado.loginNaoAceito])



  // executar efeitos gerais
  useEffect(() => {
    if (estado.queroGeral.fazer !== 'NADA') {
      switch (estado.queroGeral.fazer) {
      case 'SAIR_DO_SISTEMA':
        cws.fechaConexao()
        break

      case 'ENTRAR_NO_SISTEMA': {
        const login: Login = estado.queroGeral.login
        cws.conecta(login)
        dispatch({type: 'QUERO_AGUARDAR_RESULTADO_DE_LOGIN', login})
        break
      }
      }
    }
  }, [cws, estado.queroGeral.fazer, estado.queroGeral])


  // executar efeitos do meu leilao
  useEffect(() => {
    if (estado.queroMeuLeilao.fazer !== 'NADA') {
      switch (estado.queroMeuLeilao.fazer) {
      case 'ABRIR_LEILAO': {
        const msg: MensagemEnviada = {
          type: 'ABRIR_LEILAO',
          vendedor: estado.queroMeuLeilao.vendedor,
          produto: {
            nome: estado.queroMeuLeilao.nomeProduto,
            precoMinimo: estado.queroMeuLeilao.precoMinimo,
          }
        }
        cws.enviaMsg(JSON.stringify(msg))
        dispatch({type: 'QUERO_FAZER_NADA_MEU_LEILAO'})
        break
      }

      case 'FECHAR_LEILAO': {
        const msg: MensagemEnviada = {
          type: 'FECHAR_LEILAO',
          vendedor: estado.queroMeuLeilao.vendedor
        }
        cws.enviaMsg(JSON.stringify(msg))
        dispatch({type: 'QUERO_FAZER_NADA_MEU_LEILAO'})
        break
      }

      case 'REMOVER_LEILAO': {
        const msg: MensagemEnviada = {
          type: 'REMOVER_LEILAO',
          vendedor: estado.queroMeuLeilao.vendedor
        }
        cws.enviaMsg(JSON.stringify(msg))
        dispatch({type: 'QUERO_FAZER_NADA_MEU_LEILAO'})
        break
      }
      }
    }
  }, [cws, estado.queroMeuLeilao.fazer, estado.queroMeuLeilao])


  // executar efeitos para outro leilão (aquele que estou participando)
  useEffect(() => {
    if (estado.queroOutroLeilao.fazer !== 'NADA') {
      switch (estado.queroOutroLeilao.fazer) {
      case 'ENVIAR_LANCE': {
        const msg: MensagemEnviada = {
          type: 'ENVIAR_LANCE',
          lance: estado.queroOutroLeilao.lance
        }
        cws.enviaMsg(JSON.stringify(msg))
        dispatch({type: 'QUERO_FAZER_NADA_OUTRO_LEILAO'})
        break
      }

      case 'PARTICIPAR_DE_LEILAO': {
        const msg: MensagemEnviada = {
          type: 'PARTICIPAR_DE_LEILAO',
          vendedor: estado.queroOutroLeilao.vendedor
        }
        cws.enviaMsg(JSON.stringify(msg))
        dispatch({type: 'QUERO_FAZER_NADA_OUTRO_LEILAO'})
        break
      }

      case 'ABANDONAR_LEILAO': {
        const msg: MensagemEnviada = {
          type: 'ABANDONAR_LEILAO',
          vendedor: estado.queroOutroLeilao.vendedor
        }
        cws.enviaMsg(JSON.stringify(msg))
        dispatch({type: 'QUERO_FAZER_NADA_OUTRO_LEILAO'})
        break
      }

      default: {
        console.warn('queroOutroLeilao não tratado', estado.queroOutroLeilao)
      }
      }
    }
  }, [cws, estado.queroOutroLeilao.fazer, estado.queroOutroLeilao])

  return [estado, dispatch]
}