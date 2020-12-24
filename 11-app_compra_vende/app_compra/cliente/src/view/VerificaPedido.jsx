//@flow
import React, {useReducer, useEffect} from 'react'
import {buscaPedidosProcessados} from '../servicos'
import {PedidoProcessado} from '../modelos'

import MostraPedidosProcessados from './MostraPedidosProcessados.jsx'

type Estado = {|
  email: string, 
  pedidosProcessados: Array<PedidoProcessado>,
  msg: void | string,
  buscando: boolean
|}

type Acao =
    {| type: 'ARMAZENE_EMAIL', email: string |}
  | {| type: 'REGISTRE_BUSCANDO_PEDIDOS_PROCESSADOS' |}
  | {| type: 'REGISTRE_ERRO_AO_BUSCAR', msg: string |}
  | {| type: 'REGISTRE_PEDIDOS_ENCONTRADOS', 
       pedidosProcessados: Array<PedidoProcessado>, msg: string |}

type Dispatch = Acao => void

type Modelo = [Estado, Dispatch]


const estadoInicial: Estado = {
  email: '',
  pedidosProcessados: [],
  msg: undefined,
  buscando: false
}

function reducer(estado: Estado, acao: Acao): Estado {
  switch (acao.type) {
  case 'ARMAZENE_EMAIL':
    return {...estadoInicial, email: acao.email}

  case 'REGISTRE_BUSCANDO_PEDIDOS_PROCESSADOS':
    return {...estado, buscando: true, pedidosProcessados: [], msg: 'Buscando pedidos...'}

  case 'REGISTRE_PEDIDOS_ENCONTRADOS':
    return {...estado, buscando: false, pedidosProcessados: acao.pedidosProcessados, msg: acao.msg}

  case 'REGISTRE_ERRO_AO_BUSCAR':
    return {...estado, buscando: false, msg: acao.msg}

  default:
    throw new Error(`BUG: acao.type inválido: ${acao.type}`)
  }
}

function useModelo(): Modelo {

  const [estado, dispatch] = useReducer(reducer, estadoInicial)

  useEffect(() => {
    if (estado.buscando) {
      buscaPedidosProcessados(estado.email)
        .then(resposta => {
          let msg
          let pedidosProcessados = []
          if (resposta.ok === false)
            msg = resposta.message
          else {
            if (resposta.pedidosProcessados.length === 0)
              msg = `Não há pedidos para ${estado.email}`
            else {
              pedidosProcessados = resposta.pedidosProcessados
                .map(pedidoProcessado => PedidoProcessado.fromJSON(pedidoProcessado))
              msg = `Foram encontrados ${resposta.pedidosProcessados.length} pedidos processados.`
            }
          }
          dispatch({type: 'REGISTRE_PEDIDOS_ENCONTRADOS', pedidosProcessados, msg})
        })
        .catch(erro => dispatch({type: 'REGISTRE_ERRO_AO_BUSCAR', msg: erro.message}))
    }
  }, [estado.buscando, estado.email])

  return [estado, dispatch]
}

function VerificaPedido (): React$Element<'div'> {
  const [estado, dispatch]: Modelo = useModelo()

  function busquePedidosProcessados(ev) {
    ev.preventDefault() // para não enviar requisição ao servidor
    dispatch({type: 'REGISTRE_BUSCANDO_PEDIDOS_PROCESSADOS'})
  }

  return (
    <div className='card'>
      <div className= 'card-header'>
        <div className='card-header-title has-background-grey-light'>
              Verifica Pedidos
        </div>
      </div>
      <div className='card-content'>
        <form>
          <div className='field'>
            <label className='label'>E-mail</label>
            <div className='control'>
              <input className='input is-primary' type='text'
                value={estado.email}
                onChange={(ev) => dispatch({type: 'ARMAZENE_EMAIL', email: ev.target.value})}/>
            </div>
          </div>

          <div className='field'>
            <div className='control'>
              <button className='button is-success'
                onClick={busquePedidosProcessados}
                disabled={estado.email.length === 0}>
                    Buscar Pedidos Já Processados
              </button>
            </div>
          </div>

          <div className='field'>
            <label className='label'>Msg:</label>
            <div className='control'>
              <h4 className='subtitle'>{estado.msg}</h4>
            </div>
          </div>

          <div className='field'>
            <div className='control'>
              <MostraPedidosProcessados pedidosProcessados={estado.pedidosProcessados}/>
            </div>
          </div>
        </form>
      </div>
    </div>
  )
}

export default VerificaPedido
