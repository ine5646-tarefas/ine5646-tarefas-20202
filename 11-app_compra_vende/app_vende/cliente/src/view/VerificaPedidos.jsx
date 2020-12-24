//@flow
import React, {useReducer, useEffect} from 'react'
import {buscaPedidos, enviaPedidoProcessado} from '../servicos'
import ProcessaPedido from './ProcessaPedido.jsx'
import {Pedido, PedidoProcessado} from '../modelos'
import TabelaPedidos from './TabelaPedidos.jsx'

type Estado = {|
  msg: void | string,
  pedidos: Array<Pedido>,
  buscando: boolean,
  enviando: boolean,
  pedidoProcessado: void | PedidoProcessado
|}

type Acao = 
    {| type: 'BUSQUE_PEDIDOS' |}
  | {| type: 'PROCESSE_PEDIDOS_ENCONTRADOS', pedidos: Array<Pedido>, msg: string |}
  | {| type: 'REGISTRE_ERRO_AO_OBTER_PEDIDOS', msg: string |}
  | {| type: 'ENVIE_PEDIDO_PROCESSADO' |}
  | {| type: 'REGISTRE_PEDIDO_PROCESSADO_ENTREGUE' |}
  | {| type: 'REGISTRE_ERRO_AO_ENTREGAR_PEDIDO_PROCESSADO', msg: string |}
  | {| type: 'REGISTRE_PEDIDO_SELECIONADO', 
       pedidoProcessadoSelecionado: PedidoProcessado, 
       pedidosRestantes: Array<Pedido> |}
  | {| type: 'ALTERE_PRECO_UNITARIO', nomeProduto: string, preco: number |}
  | {| type: 'REGISTRE_BUG', mensagem: string |}

type Dispatch = Acao => void

type Modelo = [Estado, Dispatch]


const estadoInicial: Estado = {
  msg: undefined,
  pedidos: [],
  buscando: false,
  enviando: false,
  pedidoProcessado: undefined
}

function reducer(estado: Estado, acao: Acao): Estado {
  switch (acao.type) {
  case 'REGISTRE_BUG':
    return {...estadoInicial, msg: acao.mensagem}

  case 'BUSQUE_PEDIDOS':
    return {...estadoInicial, buscando: true, msg: 'Buscando pedidos...'}
  
  case 'REGISTRE_ERRO_AO_OBTER_PEDIDOS':
    return {...estadoInicial, buscando: false, msg: acao.msg}

  case 'PROCESSE_PEDIDOS_ENCONTRADOS':
    return {
      ...estado, 
      msg: acao.msg, 
      pedidos: acao.pedidos, 
      pedidoProcessado: undefined,
      buscando: false
    }

  case 'ENVIE_PEDIDO_PROCESSADO':
    return {
      ...estado, 
      enviando: true, 
      msg: 'Enviando pedido...'
    }

  case 'REGISTRE_PEDIDO_PROCESSADO_ENTREGUE':
    return {
      ...estado, 
      enviando: false, 
      msg: 'Pedido engregue.', 
      pedidoProcessado: undefined 
    }

  case 'REGISTRE_ERRO_AO_ENTREGAR_PEDIDO_PROCESSADO':
    return {...estado, enviando: false, msg: acao.msg}

  case 'REGISTRE_PEDIDO_SELECIONADO':
    return {
      ...estado,
      pedidoProcessado: acao.pedidoProcessadoSelecionado,
      pedidos: acao.pedidosRestantes,
      msg: undefined
    }

  case 'ALTERE_PRECO_UNITARIO': {
    if (estado.pedidoProcessado === undefined)
      return {...estado, msg: 'BUG: Ainda não há pedido selecionado.'}
      
    const produtoProcessado = estado.pedidoProcessado.getProdutoProcessadoPorNome(acao.nomeProduto)
    if (produtoProcessado === null)
      return {...estado, msg: `BUG: Nome do produto inválido: ${acao.nomeProduto}`}

    produtoProcessado.precoUnitario = acao.preco
    return {...estado, pedidoProcessado: estado.pedidoProcessado}
  }

  default:
    throw new Error(`BUG: acao.type inválida: ${acao.type}`)
  }
}

function useModelo(): Modelo {

  const [estado, dispatch] = useReducer(reducer, estadoInicial)

  useEffect(() => {
    if (estado.buscando) {
      buscaPedidos()
        .then(resposta => {
          let msg
          let pedidos = []
          if (resposta.ok === false)
            msg = resposta.message
          else {
            if (resposta.pedidos.length === 0)
              msg = 'Não há pedidos para análise'
            else {
              pedidos = resposta.pedidos.map(ped => Pedido.fromJSON(ped))
              msg = `Foram encontrados ${resposta.pedidos.length} pedidos.`
            }
          }
          dispatch({type: 'PROCESSE_PEDIDOS_ENCONTRADOS', pedidos, msg})
        })
        .catch(erro => dispatch({type: 'REGISTRE_ERRO_AO_OBTER_PEDIDOS', 
          msg: erro.message}))
    }
  }, [estado.buscando])

  useEffect(() => {
    if (estado.enviando) {
      if (estado.pedidoProcessado === undefined)
        dispatch({type: 'REGISTRE_BUG', mensagem: 'BUG: tentou enviar pedido processado sem haver pedido definido'})
      else
      enviaPedidoProcessado(estado.pedidoProcessado)
        .then(resposta => {
          if (resposta.ok)
            dispatch({type: 'REGISTRE_PEDIDO_PROCESSADO_ENTREGUE'})
          else {
            dispatch({type: 'REGISTRE_ERRO_AO_ENTREGAR_PEDIDO_PROCESSADO', 
              msg: resposta.message})
          }
        })
        .catch(erro => 
          dispatch({type: 'REGISTRE_ERRO_AO_ENTREGAR_PEDIDO_PROCESSADO', 
            msg: erro.message})
        )
    }
  }, [estado.enviando, estado.pedidoProcessado])

  return [estado, dispatch]
}

function VerificaPedidos (): React$Element<'div'> {
  const [estado, dispatch] = useModelo()
  

  function processePedido(ev) {
    let pedidoProcessadoSelecionado
    let pedidosRestantes = estado.pedidos.filter(ped => {
      if (ped.id === ev.target.dataset.idPedido) {
        pedidoProcessadoSelecionado = PedidoProcessado.fromPedido(ped)
        return false
      } else
        return true
    })
    if (pedidoProcessadoSelecionado === undefined)
      dispatch({type: 'REGISTRE_BUG', mensagem: 'Bug! Tentou selecionar pedido com id inexistente'})
    else
      dispatch({type: 'REGISTRE_PEDIDO_SELECIONADO', 
        pedidoProcessadoSelecionado, pedidosRestantes})
  }


  let tabelaComPedidos
  let processaPedido

  if (estado.pedidos.length === 0 || estado.pedidoProcessado !== undefined)
    tabelaComPedidos = null
  else {
    tabelaComPedidos =
      <div className="message is-info">
        <div className='message-header'>
          Pedidos Pendentes
        </div>
        <div className="message-body">
          <TabelaPedidos pedidos={estado.pedidos} onSelecionado={processePedido}/>
        </div>
      </div>
  }

  if (estado.pedidoProcessado !== undefined)
    processaPedido =
      <ProcessaPedido 
        pedidoProcessado={estado.pedidoProcessado}
        alterePrecoUnitario={(nomeProduto, preco) => dispatch({type: 'ALTERE_PRECO_UNITARIO', nomeProduto, preco})}
        onPronto={() => dispatch({type: 'ENVIE_PEDIDO_PROCESSADO'})}/>

  return (
    <div className='card'>
      <div className='card-header'>
        <div className='card-header-title has-background-grey-light'>
            Verifica Pedidos
        </div>
      </div>
      <div className='card-content'>
        <button
          className='button is-success'
          onClick={() => dispatch({type: 'BUSQUE_PEDIDOS'})}
          disabled={
            estado.buscando ||
            estado.pedidos.length > 0 || 
            estado.pedidoProcessado !== undefined}>
            Buscar Pedidos
        </button>
      </div>
      <div>
        <h4>
            Msg: {estado.msg}
        </h4>
      </div>
      <div>
        {tabelaComPedidos}
      </div>
      <div>
        {processaPedido}
      </div>

    </div>
  )

}

export default VerificaPedidos
