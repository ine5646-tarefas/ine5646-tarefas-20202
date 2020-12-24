//@flow

import React, { useReducer } from 'react'

import Card from '@material-ui/core/Card'
import CardContent from '@material-ui/core/CardContent'
import CardActions from '@material-ui/core/CardActions'
import TextField from '@material-ui/core/TextField'
import Button from '@material-ui/core/Button'

import type {LivroACadastrar} from '../../tipos_flow'

type Props = {|
  onCancele: void => void,
  onCadastre: LivroACadastrar => void
|}

type Acao = 
    {| type: 'ALTERE_TITULO', titulo: string |}
  | {| type: 'ALTERE_AUTOR', autor: string |}
  | {| type: 'ALTERE_PAGINAS', paginas: string |}

type Estado = {|
  titulo: string,
  erroTitulo: string | void,
  autor: string,
  erroAutor: string | void,
  paginas: string,
  erroPaginas: string | void
|}


const estadoInicial: Estado = {
  titulo: '',
  erroTitulo: undefined,
  autor: '',
  erroAutor: undefined,
  paginas: '',
  erroPaginas: undefined
}


function reducer(estado: Estado, acao: Acao): Estado {
  switch (acao.type) {
  case 'ALTERE_TITULO': {
    const erroTitulo = acao.titulo === '' ? 'Campo obrigatório' : undefined
    return {...estado, titulo: acao.titulo, erroTitulo}
  }

  case 'ALTERE_AUTOR': {
    const erroAutor = acao.autor === '' ? 'Campo obrigatório' : undefined
    return {...estado, autor: acao.autor, erroAutor}
  }
      
  case 'ALTERE_PAGINAS': {
    const erroPaginas = isNaN(acao.paginas) || parseInt(acao.paginas) < 1 
      ? 'Tem que ser número maior que zero' 
      : undefined
    return {...estado, paginas: acao.paginas, erroPaginas}
  }

  default:
    throw new Error(`BUG: acao.type inválido: ${acao.type}`)
  }
}

function useModelo() {

  const [estado, dispatch] = useReducer(reducer, estadoInicial)
  return [estado, dispatch]
}

function FormCadastro (props: Props): React$Element<'div'> {
  const [estado, dispatch] = useModelo()
  
  function podeCadastrar() {
    return estado.erroTitulo === undefined &&
      estado.erroAutor === undefined &&
      estado.erroPaginas === undefined &&
      estado.titulo !== '' &&
      estado.autor !== '' &&
      estado.paginas !== ''
  }

  function facaCadastro() {
    const dados: LivroACadastrar = {
      titulo: estado.titulo,
      autor: estado.autor,
      paginas: parseInt(estado.paginas)
    }
    props.onCadastre(dados)
  }


  return (
    <Card>
      <CardContent>
        <TextField
          required
          fullWidth
          error={estado.erroTitulo !== undefined}
          placeholder='digite o título'
          label='Título'
          helperText={estado.erroTitulo}
          onChange={ev => dispatch({type: 'ALTERE_TITULO', titulo: ev.target.value})}
          value={estado.titulo}/>
        <br/><br/>
        <TextField
          required
          fullWidth
          error={estado.erroAutor !== undefined}
          placeholder='digite o autor'
          label='Autor'
          helperText={estado.erroAutor}
          onChange={ev => dispatch({type: 'ALTERE_AUTOR', autor: ev.target.value})}
          value={estado.autor}/>
        <br/><br/>
        <TextField
          required
          fullWidth
          error={estado.erroPaginas !== undefined}
          placeholder='digite o número de páginas'
          label='Páginas'
          helperText={estado.erroPaginas}
          onChange={ev => dispatch({type: 'ALTERE_PAGINAS', paginas: ev.target.value})}
          value={estado.paginas}/>
      </CardContent>
      <CardActions>
        <Button
          variant='contained'
          color='primary' 
          disabled={!podeCadastrar()} 
          onClick={facaCadastro}>
            Cadastrar
        </Button>

        <Button
          variant='contained'
          color='secondary' 
          onClick={props.onCancele}>
            Cancelar
        </Button>
      </CardActions>
    </Card>
  )
}

export default FormCadastro
