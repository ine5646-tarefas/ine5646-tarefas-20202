//@flow
import React, {useState} from 'react'

import {TabelaProdutosProcessados} from './TabelaProdutosProcessados.jsx'
import {PedidoProcessado} from '../modelos'

type Props = {| pedidosProcessados: Array<PedidoProcessado> |}


function MostraPedidosProcessados (props: Props): React$Element<'div'> | null{
  const [idSelecionado, setIdSelecionado] = useState(undefined)
  
  if (props.pedidosProcessados.length === 0) return null
  
  return (
    <div align='center'>
      <h3>Pedidos Processados</h3>
      <table className='table is-hoverable is-bordered is-striped'>
        <thead>
          <tr>
            <th>Id</th>
            <th>Total (em R$)</th>
            <th>Detalhes</th>
          </tr>
        </thead>
        <tbody>
          {props.pedidosProcessados.map(pp =>
            <tr key={pp.id}>
              <td>{pp.id}</td>
              <td>{pp.custo()}</td>
              <td><MostraPedidoProcessado
                pedidoProcessado={pp}
                idSelecionado={idSelecionado}
                onClick={() => setIdSelecionado(pp.id)}/>
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  )
  
}

type PropsMostraPP = {| 
  pedidoProcessado: PedidoProcessado ,
  idSelecionado: void | string,
  onClick: string => void
|}

const MostraPedidoProcessado = (props: PropsMostraPP) => {
  let conteudo

  if (props.pedidoProcessado.id !== props.idSelecionado)
    conteudo =
      <button className='button is-info'
        onClick={props.onClick}>
          Exibir
      </button>
  else {
    conteudo =
      <div>
        <TabelaProdutosProcessados produtosProcessados={props.pedidoProcessado.produtosProcessados}/>
      </div>
  }
  return conteudo
}

export default MostraPedidosProcessados
