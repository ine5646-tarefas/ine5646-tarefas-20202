//@flow

import React from 'react'
import MenuConectado from './MenuConectado.jsx'
import MenuInicial from './MenuInicial.jsx'

type Props = {|
  conectado: boolean,
  cancele: void => void,
  onSobre: void => void,
  cadastre: void => void,
  pesquise: void => void,
  desconecte: void => void,
  conecte: void => void
|}


const MenuApp = (props: Props): React$Element<'span'> => {
  let menu

  if (props.conectado) {
    menu =
        <MenuConectado
          onCancele = {props.cancele}
          onCadastre = {props.cadastre}
          onPesquise = {props.pesquise}
          onDesconecte = {props.desconecte}
          onSobre = {props.onSobre} />
  } else {
    menu =
        <MenuInicial
          onCancele = {props.cancele}
          onConecte = {props.conecte}
          onSobre = {props.onSobre} />
  }

  return <span>{menu}</span>
}


export default MenuApp
