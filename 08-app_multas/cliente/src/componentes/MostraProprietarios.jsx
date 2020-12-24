//@flow

import React from 'react'

import {DataTable} from 'primereact/datatable'
import {Column} from 'primereact/column'

import MostraVeiculos from './MostraVeiculos.jsx'

import type {Proprietario} from '../tipos_flow'

type Props = {| proprietarios: Array<Proprietario> |}

function MostraProprietarios (props: Props): React$Element<'div'> {

  return (
    <div>
      <DataTable value={props.proprietarios} autoLayout={true} resizableColumns={true}>
        <Column field='cpf' header='CPF'/>
        <Column field='nome' header='Nome'/>
        <Column
          header='Veículos'
          body={(p) => <MostraVeiculos veiculos={undefined} cpf={p.cpf} ocultavel={true}/>}/>
      </DataTable>

    </div>
  )
}

export default MostraProprietarios