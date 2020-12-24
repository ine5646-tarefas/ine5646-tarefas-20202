//@flow

import React from 'react'

import Button from '@material-ui/core/Button'
import Paper from '@material-ui/core/Paper'
import Card from '@material-ui/core/Card'
import CardActions from '@material-ui/core/CardActions'
import CardContent from '@material-ui/core/CardContent'
import TextField from '@material-ui/core/TextField'

import FalhaNaConexao from '../util/FalhaNaConexao.jsx'
import LivrosEncontrados from './LivrosEncontrados.jsx'
import servicos from '../../servicos'
import {useModeloPesquisa} from './hookPesquisa'

import type {Livro} from '../../tipos_flow'

type Props = {|
  onCancele: void => void
|}

function PesquisaPorId (props: Props): React$Element<'div' | 'span'> {
  const [estado, {armazenaDado, fazPesquisa}] = useModeloPesquisa(servicos.pesquisePorId)
  
  if (estado.falhaNaConexao)
    return (
      <span>
        <FalhaNaConexao
          rotuloBotao = 'Encerrar Pesquisa'
          onCancele = {props.onCancele}/>
      </span>
    )

  let livros: void | Array<Livro>

  if (estado.resposta !== undefined)
    if (estado.resposta === null)
      livros = ([]: Array<Livro>)
    else
    if (estado.resposta instanceof Array)
      livros = estado.resposta
    else
      livros = [estado.resposta]
  

  return (
    <Paper>
      <Card>
        <CardContent>
          <TextField
            fullWidth
            required
            error={estado.erroPreenchimento !== undefined}
            placeholder='digite o ID do livro'
            label='ID do Livro'
            helperText={estado.erroPreenchimento}
            value={estado.dado}
            onChange={(ev) => armazenaDado(ev.target.value)}/>
        </CardContent>

        <CardActions>
          <Button
            variant='contained'
            color='primary'
            onClick={() => fazPesquisa()}
            disabled={estado.dado === '' 
              || estado.pesquisando || estado.erroPreenchimento !== undefined}>
              Pesquisar
          </Button>
          <Button
            variant='contained'
            color='secondary'
            onClick={props.onCancele}
            disabled={estado.pesquisando}>
              Encerrar pesquisa
          </Button>
        </CardActions>
        <CardContent>
          {livros !== undefined && <LivrosEncontrados livros={livros}/>}
        </CardContent>
      </Card>
    </Paper>
  )
}

export default PesquisaPorId
