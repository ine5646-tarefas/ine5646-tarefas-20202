//@flow

import React from 'react'
import SvgIcon from '@material-ui/core/SvgIcon'
import Cloud from '@material-ui/icons/Cloud'
import CloudOff from '@material-ui/icons/CloudOff'

type Props = {| conectado: boolean |}

const IconeConexao = (props: Props): React$Element<'div'> => {
  const icone = props.conectado ? <Cloud /> : <CloudOff />

  return <SvgIcon>{icone}</SvgIcon>

}

export default IconeConexao
