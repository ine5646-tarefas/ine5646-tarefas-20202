//@flow
import React from 'react'
import {Pedido} from '../modelos'

type Props = {| 
  pedidos: Array<Pedido>,
  onSelecionado: any => void
|}

const TabelaPedidos = (props: Props): React$Element<'table'> => {
  return (
    <table className='table is-bordered is-striped is-hoverable'>
      <caption>Pedidos Aguardando Processamento</caption>
      <thead>
        <tr><th>Id</th><th>E-mail</th><th>Ação</th></tr>
      </thead>
      <tbody>
        {props.pedidos.map(p =>
          <tr key={p.id}>
            <td>{p.id}</td>
            <td>{p.email}</td>
            <td><button className='button is-primary'
              data-id-pedido={p.id}
              onClick={props.onSelecionado}>
                  Processar
            </button>
            </td>
          </tr>
        )}
      </tbody>
    </table>
  )
}

export default TabelaPedidos
