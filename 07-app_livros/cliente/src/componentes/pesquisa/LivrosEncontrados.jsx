//@flow

import React from 'react'

import Table from '@material-ui/core/Table'
import TableHead from '@material-ui/core/TableHead'
import TableBody from '@material-ui/core/TableBody'
import TableCell from '@material-ui/core/TableCell'
import TableRow from '@material-ui/core/Table'

import type {Livro} from '../../tipos_flow'

type Props = {|
  livros: Array<Livro>
|}

const LivrosEncontrados = (props: Props): React$Element<'div'> => {

  function montaTabela(livros) {
    const linhas = montaLinhas(livros)
    return <Table>
      <TableHead>
        <TableRow component='tr'>
          <TableCell align='right' style={{width: '5%'}}>Num</TableCell>
          <TableCell align='left' style={{width: '15%'}}>ID</TableCell>
          <TableCell align='left' style={{width: '40%'}}>Título</TableCell>
          <TableCell align='left' style={{width: '30%'}}>Autor</TableCell>
          <TableCell align='right' style={{width: '10%'}}>Páginas</TableCell>
        </TableRow>
      </TableHead>
      <TableBody>
        {linhas}
      </TableBody>
    </Table>
  }

  function montaLinhas (livros) {
    return livros.map( (livro, indice) => (
      <TableRow key={indice} component='tr'>
        <TableCell align='right' style={{width: '5%'}}>{indice+1}</TableCell>
        <TableCell align='left' style={{width: '15%'}}>{livro._id}</TableCell>
        <TableCell align='left' style={{width: '40%'}}>{livro.titulo}</TableCell>
        <TableCell align='left' style={{width: '30%'}}>{livro.autor}</TableCell>
        <TableCell align='right' style={{width: '10%'}}>{livro.paginas}</TableCell>
      </TableRow>
    ) )
  }

  let conteudo

  if (props.livros.length === 0)
    conteudo = <h3>Nenhum livro encontrado</h3>
  else
    conteudo =  montaTabela(props.livros)

  return (<div>{conteudo}</div>)
}

export default LivrosEncontrados
