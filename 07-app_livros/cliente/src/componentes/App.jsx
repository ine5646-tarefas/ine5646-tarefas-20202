//@flow

import React, { useReducer, useEffect } from 'react'

import Sobre from './sobre/Sobre.jsx'
import MenuApp from './menu/MenuApp.jsx'
import Cadastro from './cadastro/Cadastro.jsx'
import Pesquisa from './pesquisa/Pesquisa.jsx'
import BarraDaApp from './menu/BarraDaApp.jsx'
import servicos from '../servicos'
import CircularProgress from '@material-ui/core/CircularProgress'

type Situacao = 
    'FAZENDO_NADA'
  | 'CONECTANDO_BANCO'
  | 'DESCONECTANDO_BANCO'
  | 'MOSTRANDO_SOBRE'
  | 'CADASTRANDO_LIVRO'
  | 'PESQUISANDO_LIVRO'


  type Estado = {|
    situacao: Situacao,
    conectado: boolean,
    mostrandoMenu: boolean,
    mostrarIconeMenu: boolean
  |}

  type Acao = 
      {| type: 'ALTERNE_MENU' |}
    | {| type: 'CADASTRE_LIVRO' |}
    | {| type: 'CONECTE_BANCO' |}
    | {| type: 'DESCONECTE_BANCO' |}
    | {| type: 'FECHE_CADASTRO' |}
    | {| type: 'FECHE_PESQUISA' |}
    | {| type: 'FECHE_SOBRE' |}
    | {| type: 'MOSTRE_SOBRE' |}
    | {| type: 'PESQUISE_LIVRO' |}
    | {| type: 'REGISTRE_CONEXAO_REALIZADA' |}
    | {| type: 'REGISTRE_DESCONEXAO_REALIZADA' |}
    | {| type: 'REGISTRE_ERRO_AO_CONECTAR' |}
    | {| type: 'REGISTRE_ERRO_AO_DESCONECTAR' |}
  

const estadoInicial: Estado = {
  situacao: 'FAZENDO_NADA',
  conectado: false,
  mostrandoMenu: false,
  mostrarIconeMenu: true
}

function reducer(estado: Estado, acao: Acao): Estado {
  switch (acao.type) {

  case 'FECHE_SOBRE':
    return {
      ...estado, 
      mostrandoMenu: false, 
      situacao: 'FAZENDO_NADA'
    }
  
  case 'FECHE_CADASTRO':
    return {
      ...estado, 
      mostrarIconeMenu: true, 
      situacao: 'FAZENDO_NADA'
    }
  
  case 'FECHE_PESQUISA':
    return {
      ...estado, 
      mostrarIconeMenu: true, 
      situacao: 'FAZENDO_NADA'
    }
  
  case 'ALTERNE_MENU':
    return {
      ...estado, 
      mostrandoMenu: !estado.mostrandoMenu
    }

  case 'CONECTE_BANCO':
    return {
      ...estado, 
      situacao: 'CONECTANDO_BANCO', 
      mostrandoMenu: false, 
      mostrarIconeMenu: false
    }

  case 'REGISTRE_CONEXAO_REALIZADA':
    return {
      ...estado, 
      conectado: true, 
      mostrandoMenu: false, 
      mostrarIconeMenu: true, 
      situacao: 'FAZENDO_NADA'
    }

  case 'REGISTRE_ERRO_AO_CONECTAR':
    return {
      ...estado, 
      conectado: false, 
      mostrandoMenu: true, 
      mostrarIconeMenu: false, 
      situacao: 'FAZENDO_NADA'
    }

  case 'DESCONECTE_BANCO':
    return {
      ...estado, 
      situacao: 'DESCONECTANDO_BANCO', 
      mostrandoMenu: false
    }


  case 'REGISTRE_DESCONEXAO_REALIZADA':
  case 'REGISTRE_ERRO_AO_DESCONECTAR': 
    return {
      ...estado, 
      conectado: false, 
      mostrandoMenu: false, 
      situacao: 'FAZENDO_NADA'
    }
    
  case 'MOSTRE_SOBRE':
    return {
      ...estado, 
      mostrandoMenu: false, 
      situacao: 'MOSTRANDO_SOBRE'
    }

  case 'CADASTRE_LIVRO':
    return {
      ...estado, 
      mostrandoMenu: false, 
      mostrarIconeMenu: false, 
      situacao: 'CADASTRANDO_LIVRO'
    }
  
  case 'PESQUISE_LIVRO':
    return {
      ...estado, 
      mostrandoMenu: false, 
      mostrarIconeMenu: false, 
      situacao: 'PESQUISANDO_LIVRO'
    }

  default: 
    throw new Error(`BUG: acao.type inválido: ${acao.type}`)
  }
}

//
// * * * * * * * * 
//

function App (): React$Element<'div'> {
  const [estado, dispatch] = useReducer(reducer, estadoInicial)

  useEffect(() => {
    const sit: Situacao = estado.situacao
    switch (sit) {
    case 'CONECTANDO_BANCO':
      servicos.conecta()
        .then(() => dispatch({type: 'REGISTRE_CONEXAO_REALIZADA'}))
        .catch(() => dispatch({type: 'REGISTRE_ERRO_AO_CONECTAR'}))  
      break
    
    case 'DESCONECTANDO_BANCO':
      servicos.desconecta()
        .then(() => dispatch({type: 'REGISTRE_DESCONEXAO_REALIZADA'}))
        .catch(() => dispatch({type: 'REGISTRE_ERRO_AO_DESCONECTAR'}))  
      break
    }
  }, [estado.situacao])


  function defineConteudo(situacao: Situacao) {
    let conteudo

    switch (situacao) {
    case 'FAZENDO_NADA':
      conteudo = null
      break
    case 'CONECTANDO_BANCO':
      conteudo = <div><h3>Conectando...</h3><CircularProgress/></div>
      break
    case 'DESCONECTANDO_BANCO':
      conteudo = <div><h3>Desconectando...</h3><CircularProgress/></div>
      break
    case 'MOSTRANDO_SOBRE':
      conteudo = <Sobre onClick={() => dispatch({type: 'FECHE_SOBRE'})} />
      break
    case 'CADASTRANDO_LIVRO':
      conteudo = <Cadastro onCancele={() => dispatch({type: 'FECHE_CADASTRO'})}/>
      break
    case 'PESQUISANDO_LIVRO':
      conteudo = <Pesquisa onCancele={() => dispatch({type: 'FECHE_PESQUISA'})}/>
      break

    default: {
      conteudo = <h4>Erro: situação ainda não tratada: {estado.situacao}</h4>
    }
    }
    return conteudo
  }

  let menu
  if (estado.mostrandoMenu)
    menu = 
      <MenuApp
        conectado={estado.conectado}
        cancele = {() => dispatch({type: 'ALTERNE_MENU'})}
        onSobre={() => dispatch({type: 'MOSTRE_SOBRE'})}
        conecte={() => dispatch({type: 'CONECTE_BANCO'})}
        desconecte={() => dispatch({type: 'DESCONECTE_BANCO'})}
        cadastre={() => dispatch({type: 'CADASTRE_LIVRO'})}
        pesquise={() => dispatch({type: 'PESQUISE_LIVRO'})} />

  const conteudo = defineConteudo(estado.situacao)

  return (
    <div>
      <BarraDaApp 
        toggleMenu={() => dispatch({type: 'ALTERNE_MENU'})} 
        mostrarIconeMenu={estado.mostrarIconeMenu} 
        conectado={estado.conectado}/>
      {menu}
      <div>
        {/* espaço para que conteudo não seja escondido pela AppBar */}
        <div style={{height: '50px'}}></div> 
        {conteudo}
      </div>
    </div>
  )

}

export default App
