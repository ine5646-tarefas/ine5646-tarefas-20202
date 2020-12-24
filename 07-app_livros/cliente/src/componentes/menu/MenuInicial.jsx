//@flow

import React from 'react'

import List from '@material-ui/core/List'
import ListItem from '@material-ui/core/ListItem'
import Drawer from '@material-ui/core/Drawer'

type Props = {|
  onCancele: void => void,
  onConecte: void => void,
  onSobre: void => void
|}


const MenuInicial = (props: Props): React$Element<'div'> => {

  return (
    <Drawer open={true} onClose={props.onCancele}>
      <List open={true}>
        <ListItem button onClick = {props.onConecte}>
          Conectar ao Banco de Dados...
        </ListItem>
            
        <ListItem button onClick = {props.onSobre}>
          Sobre...
        </ListItem>
      </List>
    </Drawer>
  )
}


export default MenuInicial
