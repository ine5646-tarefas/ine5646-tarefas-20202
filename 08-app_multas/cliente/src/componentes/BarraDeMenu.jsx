//@flow

import React from 'react'
import {Menubar} from 'primereact/menubar'

export type ItemDoMenu = 
      'NADA'
    | 'PROPRIETARIO_CADASTRO'
    | 'PROPRIETARIO_CADASTRO_EM_MASSA'
    | 'PROPRIETARIO_PESQUISA'
    | 'PROPRIETARIO_PESQUISA_TODOS'
    | 'PROPRIETARIO_PESQUISA_MULTAS'
    | 'VEICULO_CADASTRO'
    | 'VEICULO_CADASTRO_EM_MASSA'
    | 'VEICULO_PESQUISA'
    | 'MULTA_CADASTRO'
    | 'MULTA_CADASTRO_EM_MASSA'
    | 'MULTA_PESQUISA'


type Props = {| 
  itemSelecionado: (item: ItemDoMenu) => void
|}

function BarraDeMenu (props: Props): React$Element<'div'> {

  const itens = [
    {
      label: 'Proprietário',
      items: [
        {
          label: 'Cadastrar...',
          command: () => { props.itemSelecionado('PROPRIETARIO_CADASTRO') }
        },
        {
          label: 'Cadastrar em massa...',
          command: () => { props.itemSelecionado('PROPRIETARIO_CADASTRO_EM_MASSA') }
        },
        {
          label: 'Pesquisar...',
          command: () => { props.itemSelecionado('PROPRIETARIO_PESQUISA') }
        },
        {
          label: 'Pesquisar Todos',
          command: () => { props.itemSelecionado('PROPRIETARIO_PESQUISA_TODOS') }
        },
        {
          label: 'Pesquisar Multas Por Veículo...',
          command: () => { props.itemSelecionado('PROPRIETARIO_PESQUISA_MULTAS')}
        }
      ]
    },

    {
      label: 'Veículo',
      items: [
        {
          label: 'Cadastrar...',
          command: () => { props.itemSelecionado('VEICULO_CADASTRO') }
        },
        {
          label: 'Cadastrar em massa...',
          command: () => { props.itemSelecionado('VEICULO_CADASTRO_EM_MASSA') }
        },
        {
          label: 'Pesquisar...',
          command: () => { props.itemSelecionado('VEICULO_PESQUISA') }
        }
      ]
    },

    {
      label: 'Multa',
      items: [
        {
          label: 'Cadastrar...',
          command: () => { props.itemSelecionado('MULTA_CADASTRO') }
        },
        {
          label: 'Cadastrar em massa...',
          command: () => { props.itemSelecionado('MULTA_CADASTRO_EM_MASSA') }
        },
        {
          label: 'Pesquisar...',
          command: () => { props.itemSelecionado('MULTA_PESQUISA') }
        }
      ]
    },
  ]

  return <Menubar model={itens}/>
}

export default BarraDeMenu