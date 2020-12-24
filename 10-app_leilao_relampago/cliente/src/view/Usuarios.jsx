//@flow
import React from 'react'

import type { Login} from '../model/tipos'

type Props = {|
  usuarios: Array<Login>
|}

export default function Usuarios({usuarios}: Props): React$Element<'div'> {

  let dados

  if (usuarios.length === 0)
    dados = 'Ninguém além de você'
  else
    dados = <ul style={{overflowY: 'scroll', maxHeight: '150px'}}>
      {
        usuarios.map((u,i) => <li key={i}>{u}</li>)
      }
    </ul>

  return <div className='message  is-warning'>
    <div className='message-header'>
      Usuários Online
    </div>
    <div className='message-body'>
      {dados}
    </div>
  </div>
}
