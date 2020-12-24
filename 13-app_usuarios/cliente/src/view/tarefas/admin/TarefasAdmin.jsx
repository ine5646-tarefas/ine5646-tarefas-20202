//@flow
import React, {useState} from 'react'

import MostrarUsuarios from './MostrarUsuarios.jsx'
import CadastrarUsuario from './CadastrarUsuario.jsx'
import BulmaNavbar, {BulmaNavbarItem} from '../../ui/BulmaNavbar.jsx'

import type { CorBulma } from '../../../tipos_flow'

type PropsBarraDeMenu = {| onSelect: number => void |}

const BarraDeMenu = (props: PropsBarraDeMenu) => (
  <div>
    <BulmaNavbar color={('is-success': CorBulma)}>
      <BulmaNavbarItem name='Ações do Administrador...'>
        <p onClick={() => props.onSelect(1)}>Mostrar Usuarios</p>
        <p onClick={() => props.onSelect(2)}>Cadastrar Usuarios</p>
      </BulmaNavbarItem>
    </BulmaNavbar>

  </div>
)


type PropsTarefasAdmin = {| idToken: string, papeisPossiveis: Array<string> |}

function TarefasAdmin (props: PropsTarefasAdmin): React$Element<'div'> {
  const [idTarefa, setIdTarefa] = useState(0)
  let tarefa = null
  switch (idTarefa) {

  case 1:
    tarefa = <MostrarUsuarios idToken={props.idToken}/>
    break

  case 2:
    tarefa = <CadastrarUsuario idToken={props.idToken} papeisPossiveis={props.papeisPossiveis}/>
    break
  }

  return (
    <div>
      <BarraDeMenu onSelect={idTarefa => setIdTarefa(idTarefa)}/>
      {tarefa}
    </div>
  )
}

export default TarefasAdmin
