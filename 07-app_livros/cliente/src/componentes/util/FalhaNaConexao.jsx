//@flow

import React from 'react'
import Button from '@material-ui/core/Button'

type Props = {|
  rotuloBotao: string,
  onCancele: void => void
|}

const FalhaNaConexao = (props: Props): React$Element<'div'> =>
  <div>
    <h3>Sem acesso ao banco de dados. Tente novamente mais tarde.</h3>
    <Button color='secondary' variant='contained' onClick={props.onCancele}>
      {props.rotuloBotao}
    </Button>
  </div>

export default FalhaNaConexao
