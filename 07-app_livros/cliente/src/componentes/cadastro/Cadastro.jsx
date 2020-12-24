//@flow

import React, { useReducer, useEffect } from 'react'
import Paper from '@material-ui/core/Paper'
import Card from '@material-ui/core/Card'
import CardHeader from '@material-ui/core/CardHeader'
import CardContent from '@material-ui/core/CardContent'
import Radio from '@material-ui/core/Radio'
import RadioGroup from '@material-ui/core/RadioGroup'
import FormControlLabel from '@material-ui/core/FormControlLabel'
import FormControl from '@material-ui/core/FormControl'
import FormLabel from '@material-ui/core/FormLabel'
import servicos from '../../servicos'
import FormCadastro from './FormCadastro.jsx'

import type {LivroACadastrar} from '../../tipos_flow'

type Props = {|
  onCancele: void => void
|}

type Acao = 
    {| type: 'FACA_CADASTRO', dados: LivroACadastrar |}
  | {| type: 'CADASTRO_FEITO', id: string |}
  | {| type: 'CADASTRO_NAO_FEITO' |}
  | {| type: 'FACA_NOVO_CADASTRO' |}

type Estado = {|
  msg: string | void,
  cadastrarNovamente: boolean,
  dados: LivroACadastrar | void
|}

  
const estadoInicial: Estado = {
  msg: undefined,
  cadastrarNovamente: false,
  dados: undefined
}


function reducer(estado: Estado, acao: Acao): Estado {
  switch (acao.type) {
  case 'FACA_CADASTRO': 
    return {...estado, dados: acao.dados, msg: 'Cadastrando...'}
  
  case 'CADASTRO_FEITO':
    return {
      cadastrarNovamente: true, 
      dados: undefined, 
      msg: `Livro cadastrado! Id: ${acao.id}`
    }

  case 'CADASTRO_NAO_FEITO':
    return {msg: 'Não conseguiu cadastrar.', dados: undefined, cadastrarNovamente: false}

  case 'FACA_NOVO_CADASTRO':
    return estadoInicial

  default:
    throw new Error(`BUG: acao.type inválido: ${acao.type}`)
  }
}

function useModelo() {

  const [estado, dispatch] = useReducer(reducer, estadoInicial)

  useEffect(() => {
    if (estado.dados !== undefined) {
      servicos.cadastre(estado.dados)
        .then((resultado) => {
          if (resultado.salvou)
            dispatch({type: 'CADASTRO_FEITO', id: resultado.id})
          else
            dispatch({type: 'CADASTRO_NAO_FEITO'})
        })
        .catch(() => dispatch({type: 'CADASTRO_NAO_FEITO'}))
    }
  }, [estado.dados])


  return [estado, dispatch]
}

function Cadastro (props: Props): React$Element<'div'> {
  const [estado, dispatch] = useModelo()

  function decidaSeCadastraNovamente(ev) {
    ev.target.value === 'sim' ? dispatch({type: 'FACA_NOVO_CADASTRO'}) : props.onCancele()
  }

  let conteudo
  let msg

  if (estado.msg !== undefined)
    msg = <h4>{estado.msg}</h4>

  if (estado.cadastrarNovamente) {
    conteudo =
        <Paper>
          <FormControl component='fieldset'>
            <FormLabel component='legend'>Cadastrar mais um?</FormLabel>
            <RadioGroup onChange={decidaSeCadastraNovamente}>
              <FormControlLabel value={'sim'} control={<Radio/>} label='Sim'/>
              <FormControlLabel value={'não'} control={<Radio/>} label='Não'/>
            </RadioGroup>
          </FormControl>
        </Paper>
  }
  else
    conteudo =
        <FormCadastro
          onCadastre={(dados) => dispatch({type: 'FACA_CADASTRO', dados})}
          onCancele={props.onCancele}/>


  return (
    <Paper>
      <Card>
        <CardHeader title='Cadastrar Livro'/>
        <CardContent>
          {msg}{conteudo}
        </CardContent>
      </Card>
    </Paper>
  )
}

export default Cadastro
