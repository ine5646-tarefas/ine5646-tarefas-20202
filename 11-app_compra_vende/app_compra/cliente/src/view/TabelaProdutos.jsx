//@flow
import React from 'react'
import {Produto} from '../modelos'

type Props = {|
  produtos: Array<Produto>,
  onRemove: string => void 
|}

const TabelaProdutos = (props: Props): React$Element<'table'> => {
  
  let produtos = props.produtos.map(p =>
    <tr key={p.nome}>
      <td>{p.nome}</td>
      <td>{p.quantidade}</td>
      <td>
        <button className='button is-danger is-small is-rounded'
          onClick={() => props.onRemove(p.nome)}>X</button>
      </td>
    </tr>)

  return (
    <table className='table is-striped is-hoverable is-bordered is-fullwidth'>
      <thead className='has-background-grey-lighter'>
        <tr>
          <th>Produto</th>
          <th>Quantidade</th>
          <th>Excluir</th>
        </tr>
      </thead>
      <tbody>
        {produtos}
      </tbody>
    </table>
  )
}

export {TabelaProdutos}
