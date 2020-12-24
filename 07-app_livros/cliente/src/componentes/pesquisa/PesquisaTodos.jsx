//@flow

import React, {useReducer, useEffect} from 'react'
import Button from '@material-ui/core/Button'
import Paper from '@material-ui/core/Paper'
import Card from '@material-ui/core/Card'
import CardContent from '@material-ui/core/CardContent'
import CardActions from '@material-ui/core/CardActions'

import LivrosEncontrados from './LivrosEncontrados.jsx'
import servicos from '../../servicos'
import FalhaNaConexao from '../util/FalhaNaConexao.jsx'

import type {Livro} from '../../tipos_flow'

type Props = {|
  onCancele: void => void
|}

type Acao = 
    {|type: 'PESQUISE_LIVROS' |}
  | {|type: 'OBTENHA_LIVROS' |}
  | {|type: 'REGISTRE_LIVROS_ENCONTRADOS', livros: Array<Livro> |}
  | {|type: 'REGISTRE_FALHA_NA_CONEXAO' |}

type Estado = {|
  pesquisando: boolean,
  livros: Array<Livro> | void,
  falhaNaConexao: boolean
|}

function useModelo() {


  const estadoInicial: Estado = {
    pesquisando: false,
    livros: undefined,
    falhaNaConexao: false
  }

  
  function reducer(estado: Estado, acao: Acao): Estado {
    switch (acao.type) {


    case 'PESQUISE_LIVROS':
      return {...estado, pesquisando: true, livros: undefined}

    case 'REGISTRE_LIVROS_ENCONTRADOS':
      return {...estadoInicial, livros: acao.livros}

    case 'REGISTRE_FALHA_NA_CONEXAO':
      return {...estado, pesquisando: false, falhaNaConexao: true}

    default:
      throw new Error(`ERRO: acao.type não definido: ${acao.type}`)
    }
  }
  const [estado, dispatch] = useReducer(reducer, estadoInicial)

  useEffect(() => {
    if (estado.pesquisando === true) {
      servicos.pesquiseTodos()
        .then(livros => dispatch({type: 'REGISTRE_LIVROS_ENCONTRADOS', livros}))
        .catch(() => dispatch({type: 'REGISTRE_FALHA_NA_CONEXAO'}))  
    }
  }, [estado.pesquisando])
  
  return [estado, dispatch]
}

function PesquisaTodos (props: Props): React$Element<'div' | 'span'> {
  const [estado, dispatch] = useModelo()

  
  if (estado.falhaNaConexao)
    return (
      <span>
        <FalhaNaConexao
          rotuloBotao = 'Encerrar Pesquisa'
          onCancele = {props.onCancele}/>
      </span>
    )


  return (
    <Paper>
      <Card>
        <CardActions>
          <Button
            variant='contained'
            color='primary'
            onClick={() => dispatch({type: 'PESQUISE_LIVROS'})}
            disabled={estado.pesquisando}>
              Pesquisar
          </Button>
          <Button
            variant='contained'
            color='secondary'
            onClick={props.onCancele}
            disabled={estado.pesquisando}>
              Encerrar Pesquisa
          </Button>
        </CardActions>
        <CardContent>
          {estado.livros !== undefined && <LivrosEncontrados livros={estado.livros}/>}
        </CardContent>
      </Card>
    </Paper>
  )
}


export default PesquisaTodos
