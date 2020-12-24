//@flow

import React, { useState } from 'react'
import Tabs from '@material-ui/core/Tabs'
import Tab from '@material-ui/core/Tab'

import PesquisaTodos from './PesquisaTodos.jsx'
import PesquisaPorId from './PesquisaPorId.jsx'
import PesquisaPorTitulo from './PesquisaPorTitulo.jsx'


type Props = {|
  onCancele: void => void
|}

function TabsPesquisa (props: Props): React$Element<'div'> {
  const [tab, setTab] = useState('todos')
 
  return (
    <div>
      <Tabs value={tab} onChange={(ev, tab) => setTab(tab)} variant="fullWidth">

        <Tab label='Todos' value='todos'/>

        <Tab label='Por Id' value='id'/>

        <Tab label='Por Título' value='titulo'/>
      </Tabs>
      {tab === 'todos' && <PesquisaTodos onCancele={props.onCancele}/>}
      {tab === 'id' && <PesquisaPorId onCancele={props.onCancele}/>}
      {tab === 'titulo' && <PesquisaPorTitulo onCancele={props.onCancele}/>}
    </div>
  )
}


export default TabsPesquisa
