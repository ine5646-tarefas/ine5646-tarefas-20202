//@flow

import React, { useState } from 'react'

import 'primereact/resources/themes/saga-blue/theme.css'
import 'primereact/resources/primereact.min.css'
import 'primeicons/primeicons.css'

import {Panel} from 'primereact/panel'

import BarraDeMenu from './BarraDeMenu.jsx'
import CadastraVeiculosEmMassa from './CadastraVeiculosEmMassa.jsx'
import CadastraMultasEmMassa from './CadastraMultasEmMassa.jsx'
import CadastraProprietariosEmMassa from './CadastraProprietariosEmMassa.jsx'
import CadastraProprietario from './CadastraProprietario.jsx'
import CadastraVeiculo from './CadastraVeiculo.jsx'
import CadastraMulta from './CadastraMulta.jsx'
import PesquisaProprietario from './PesquisaProprietario.jsx'
import PesquisaTodosProprietarios from './PesquisaTodosProprietarios.jsx'
import PesquisaMultasDeProprietario from './PesquisaMultasDeProprietario.jsx'
import PesquisaVeiculo from './PesquisaVeiculo.jsx'
import PesquisaMulta from './PesquisaMulta.jsx'

import type {ItemDoMenu} from './BarraDeMenu.jsx'

function useModelo(): [ ItemDoMenu, {| alteraItem: (ItemDoMenu) => void, cancelaItem: void => void |}] {
  const [executando: ItemDoMenu, setExecutando] = useState('NADA')

  function alteraItem (item) {
    setExecutando(item)
  }

  function cancelaItem () {
    setExecutando('NADA')
  }

  return [ executando, {alteraItem, cancelaItem} ]
}

function App (): React$Element<'div'> {
  const [executando: ItemDoMenu, {alteraItem, cancelaItem}] = useModelo()

  let conteudo
  
  switch (executando) {
  case 'NADA':
    conteudo = null
    break
  case 'PROPRIETARIO_CADASTRO':
    conteudo = <CadastraProprietario cancelar={cancelaItem}/>
    break
  case 'PROPRIETARIO_CADASTRO_EM_MASSA':
    conteudo = <CadastraProprietariosEmMassa cancelar={cancelaItem}/>
    break
  case 'VEICULO_CADASTRO':
    conteudo = <CadastraVeiculo cancelar={cancelaItem}/>
    break
  case 'VEICULO_CADASTRO_EM_MASSA':
    conteudo = <CadastraVeiculosEmMassa cancelar={cancelaItem}/>
    break
  case 'MULTA_CADASTRO':
    conteudo = <CadastraMulta cancelar={cancelaItem}/>
    break
  case 'MULTA_CADASTRO_EM_MASSA':
    conteudo = <CadastraMultasEmMassa cancelar={cancelaItem}/>
    break
  case 'PROPRIETARIO_PESQUISA':
    conteudo = <PesquisaProprietario cancelar={cancelaItem}/>
    break
  case 'PROPRIETARIO_PESQUISA_TODOS':
    conteudo = <PesquisaTodosProprietarios cancelar={cancelaItem}/>
    break
  case 'PROPRIETARIO_PESQUISA_MULTAS':
    conteudo = <PesquisaMultasDeProprietario cancelar={cancelaItem}/>
    break
  case 'VEICULO_PESQUISA':
    conteudo = <PesquisaVeiculo cancelar={cancelaItem}/>
    break
  case 'MULTA_PESQUISA':
    conteudo = <PesquisaMulta cancelar={cancelaItem}/>
    break
  default:
    conteudo = <h2>Opção {executando} ainda não implementada</h2>
  }

  return (
    <Panel header='UFSC - CTC - INE - INE5646 :: App Multas'>
      <BarraDeMenu itemSelecionado={alteraItem}/>
      {conteudo}
    </Panel>
  )
}

export default App
