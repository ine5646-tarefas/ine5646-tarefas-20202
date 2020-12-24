//@flow

import React from 'react'
import Dialog from '@material-ui/core/Dialog'
import DialogTitle from '@material-ui/core/DialogTitle'
import DialogContent from '@material-ui/core/DialogContent'
import DialogActions from '@material-ui/core/DialogActions'
import Button from '@material-ui/core/Button'
import Typography from '@material-ui/core/Typography'


type Props = {| onClick: void => void |}

const Sobre = (props: Props): React$Element<'div'> => {
  
  return (
    <Dialog open={true}>
      <DialogTitle>
        Sobre
      </DialogTitle>
      <DialogContent>
        <Typography variant='h5'>
          Finalidade
        </Typography>
        <Typography>
            Esta aplicação permite que dados sobre livros sejam armazenados
            em um banco MongoDB.
        </Typography>
        <Typography variant='h5'>
          Tecnologias
        </Typography>
        <Typography>
            Bibliotecas utilizadas: Mongoose para acessar o banco e Material-UI
            para os componentes React.
        </Typography>
      </DialogContent>
      <DialogActions>
        <Button variant='outlined' color='primary' onClick={props.onClick}>
          Ok
        </Button>
      </DialogActions>
    </Dialog>
  )
}

export default Sobre
