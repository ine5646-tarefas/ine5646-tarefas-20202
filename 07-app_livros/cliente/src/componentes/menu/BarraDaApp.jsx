//@flow

import React from 'react'
import Grid from '@material-ui/core/Grid'
import AppBar from '@material-ui/core/AppBar'
import Toolbar from '@material-ui/core/Toolbar'
import IconButton from '@material-ui/core/IconButton'
import MenuIcon from '@material-ui/icons/Menu'
import Typography from '@material-ui/core/Typography'

import IconeConexao from '../util/IconeConexao.jsx'

type Props = {|
  toggleMenu: void => void,
  mostrarIconeMenu: boolean,
  conectado: boolean
|}

const BarraDaApp = (props: Props): React$Element<'div'> => (
  <AppBar>
    <Toolbar>
      <Grid container alignItems='center' justify='space-between'>
        <Grid item>
          <IconButton color='inherit' onClick={props.toggleMenu} disabled={!props.mostrarIconeMenu} >
            <MenuIcon />
          </IconButton>
        </Grid>
        <Grid item>
          <Typography variant='h6' color='inherit' gutterBottom>
            UFSC - CTC - INE - INE5646 :: App Livros
          </Typography>
        </Grid>
        <Grid item>
          <IconeConexao conectado={props.conectado}/>
        </Grid>
      </Grid>
    </Toolbar>
  </AppBar>

)

export default BarraDaApp
