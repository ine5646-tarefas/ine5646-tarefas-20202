//@flow

import React from 'react'
import Drawer from '@material-ui/core/Drawer'
import List from '@material-ui/core/List'
import ListItem from '@material-ui/core/ListItem'
import Divider from '@material-ui/core/Divider'

type Props = {|
  onCancele: void => void,
  onCadastre: void => void,
  onPesquise: void => void,
  onDesconecte: void => void,
  onSobre: void => void
|}


const MenuConectado = (props: Props): React$Element<'div'> => {
  
  return (
    <Drawer open={true} onClose={props.onCancele}>
      <List open={true}>
        <ListItem button onClick = {props.onCadastre}>
          Cadastrar livro...
        </ListItem>
        <ListItem button onClick = {props.onPesquise}>
          Pesquisar livro...
        </ListItem>
        <Divider/>
        <ListItem button onClick = {props.onDesconecte}>
          Desconectar do Banco de Dados
        </ListItem>
        <Divider/>
        <ListItem button onClick = {props.onSobre}>
          Sobre...
        </ListItem>
      </List>
    </Drawer>
  )
}


export default MenuConectado
