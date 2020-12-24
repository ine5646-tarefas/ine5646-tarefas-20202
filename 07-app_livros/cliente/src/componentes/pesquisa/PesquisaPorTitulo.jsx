//@flow

import React from 'react'

import Button from '@material-ui/core/Button'
import Paper from '@material-ui/core/Paper'
import Card from '@material-ui/core/Card'
import CardContent from '@material-ui/core/CardContent'
import CardActions from '@material-ui/core/CardActions'
import TextField from '@material-ui/core/TextField'

import LivrosEncontrados from './LivrosEncontrados.jsx'
import servicos from '../../servicos'
import FalhaNaConexao from '../util/FalhaNaConexao.jsx'
import {useModeloPesquisa} from './hookPesquisa'

import type {Livro} from '../../tipos_flow'

type Props = {|
  onCancele: void => void
|}

function PesquisaPorTitulo (props: Props): React$Element<'div' | 'span'> {
  const [estado, {armazenaDado, fazPesquisa}] = useModeloPesquisa(servicos.pesquisePorTitulo)
  
  function naoPodePesquisar() {
    return estado.dado === '' || estado.pesquisando || estado.erroPreenchimento !== undefined
  }

  if (estado.falhaNaConexao)
    return (
      <span>
        <FalhaNaConexao rotuloBotao= 'Encerrar Pesquisa' onCancele= {props.onCancele}/>
      </span>
    )
    
  let livros: void | Array<Livro>
  
  if (estado.resposta !== undefined) {
    if (estado.resposta === null)
      livros = []
    else
    if (estado.resposta instanceof Array)
      livros = estado.resposta
  }


  return (
    <Paper>
      <Card>
        <CardContent>
          <TextField
            fullWidth
            required
            placeholder='digite todo ou parte do título'
            label='Título do Livro'
            error={estado.erroPreenchimento !== undefined}
            helperText={estado.erroPreenchimento}
            value={estado.dado}
            onChange={(ev) => armazenaDado(ev.target.value)}/>
        </CardContent>

        <CardActions>
          <Button
            variant='contained'
            color='primary'
            onClick={() => fazPesquisa()}
            disabled={naoPodePesquisar()}>
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
          {livros !== undefined && <p>Encontrados {livros.length} livros!</p>}
        </CardContent>
      </Card>
    </Paper>
  )
}

export default PesquisaPorTitulo
