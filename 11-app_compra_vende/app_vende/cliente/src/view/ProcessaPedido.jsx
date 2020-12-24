//@flow
import React from 'react'

import {PedidoProcessado} from '../modelos'
import TabelaProdutoProcessado from './TabelaProdutoProcessado.jsx'

type Props = {| 
  pedidoProcessado: PedidoProcessado,
  alterePrecoUnitario: (nomeProduto: string, preco: number) => void,
  onPronto: void => void
|}

function ProcessaPedido (props: Props): React$Element<'div'> {
  
  function alterePrecoUnitario(ev) {
    // trunca, com arredondamento, o valor digitado em duas casas decimais
    const preco = parseFloat(parseFloat(ev.target.value).toFixed(2))
    if (isFinite(preco)) {
      let nomeDoProduto = ev.target.name
      props.alterePrecoUnitario(nomeDoProduto, preco)
    }
  }

  let pps = props.pedidoProcessado.produtosProcessados
  let conteudo =
    <div className='card has-background-light'>
      <div className='card-header'>
        <h3 className='card-header-title has-background-grey'>
          Pedido: {props.pedidoProcessado.id} - Usuário: {props.pedidoProcessado.email}
        </h3>
      </div>
      <div className='card-content'>
        <TabelaProdutoProcessado
          produtosProcessados={pps}
          onPrecoUnitarioAlterado={alterePrecoUnitario}
          pedidoProcessado={props.pedidoProcessado}/>
        <div>
          <button
            className='button is-success'
            onClick={() => props.onPronto()}>Enviar</button>
        </div>
      </div>
    </div>
    
  return conteudo
}

export default ProcessaPedido
