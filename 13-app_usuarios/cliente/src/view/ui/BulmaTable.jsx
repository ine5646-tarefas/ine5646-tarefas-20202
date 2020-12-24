//@flow
import React from 'react'

type Props = {| head: Array<string>, data: [ any ] |}

const BulmaTable = (props: Props): React$Element<'table'> => {
  const cabecalho =
    props.head.map(cab => <th key={cab}>{cab}</th>)

  let l = 1 // linha

  const corpo =
    props.data.map(linha => {
      let c = 1 // coluna
      const cols = linha.map(col => <td key={c++}>{col}</td>)
      return <tr key={l++}>{cols}</tr>
    })
    
  return (
    <table className='table is-hoverable'>
      <thead>
        <tr>{cabecalho}</tr>
      </thead>
      <tbody>
        {corpo}
      </tbody>
    </table>
  )
}

export default BulmaTable
