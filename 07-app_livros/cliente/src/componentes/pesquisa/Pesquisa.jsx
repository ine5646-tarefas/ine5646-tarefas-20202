//@flow

import React from 'react'
import Paper from '@material-ui/core/Paper'
import Card from '@material-ui/core/Card'
import CardHeader from '@material-ui/core/CardHeader'
import CardContent from '@material-ui/core/CardContent'

import TabsPesquisa from './TabsPesquisa.jsx'

type Props = {|
  onCancele: void => void
|}

const Pesquisa = (props: Props): React$Element<'div'> => 
  (
    <Paper>
      <Card>
        <CardHeader title='Pesquisar Livro'/>
        <CardContent>
          <TabsPesquisa onCancele={props.onCancele}/>
        </CardContent>
      </Card>
    </Paper>
  )

export default Pesquisa
