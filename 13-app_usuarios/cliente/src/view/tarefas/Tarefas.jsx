//@flow

import React from 'react'
import TarefasAdmin from './admin/TarefasAdmin.jsx'
import BulmaNotification from '../ui/BulmaNotification.jsx'

import type {IdTokenResult} from '../../tipos_flow'

type Props = {| idTokenResult: IdTokenResult, papeisPossiveis: Array<string> |}

function Tarefas (props: Props): React$Element<'div'> {
  const tarefas = props.idTokenResult.claims.papeis.includes('admin')
    ? <TarefasAdmin idToken={props.idTokenResult.token} papeisPossiveis={props.papeisPossiveis}/>
    : <BulmaNotification color='is-info' message='Seja bem-vindo, usuário regular (que não tem papel de administrador).'/>

  return <div className='box'>{tarefas}</div>
}

export default Tarefas
