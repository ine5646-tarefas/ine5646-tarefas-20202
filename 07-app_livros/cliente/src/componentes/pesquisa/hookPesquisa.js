//@flow

import {useEffect, useReducer} from 'react'

import type {RespostaPesquisa} from '../../tipos_flow'

export type Acao = 
    {| type: 'ARMAZENE_DADO', dado: string |}
  | {| type: 'PESQUISE_DADO' |}
  | {| type: 'REGISTRE_RESPOSTA', resposta: RespostaPesquisa |}
  | {| type: 'REGISTRE_FALHA_NA_CONEXAO' |}


export type Estado = {|
  pesquisando: boolean,
  resposta: void | RespostaPesquisa,
  dado: string,
  erroPreenchimento: string | void,
  falhaNaConexao: boolean  
|}

const estadoInicial: Estado = {
  pesquisando: false,
  resposta: undefined,
  dado: '',
  erroPreenchimento: undefined,
  falhaNaConexao: false
}

function reducer(estado: Estado, acao: Acao): Estado {
  switch (acao.type) {
  case 'ARMAZENE_DADO': {
    const erroPreenchimento = acao.dado === '' ? 'Campo obrigatório' : undefined
    return {...estadoInicial, erroPreenchimento, dado: acao.dado}
  }
    
  case 'PESQUISE_DADO':
    return {...estado, pesquisando: true, resposta: undefined}

  case 'REGISTRE_RESPOSTA':
    return {...estado, pesquisando: false, resposta: acao.resposta}
    
  case 'REGISTRE_FALHA_NA_CONEXAO':
    return {...estado, pesquisando: false, falhaNaConexao: true}    
    
  default:
    throw new Error(`BUG: acao.type inválido: ${acao.type}`)  
  }
}

export type Modelo = [Estado, {| armazenaDado: string => void, fazPesquisa: void => void|}]

export function useModeloPesquisa(pesquisa: string => Promise<RespostaPesquisa>): Modelo {
  
  const [estado, dispatch] = useReducer<Estado,Acao>(reducer, estadoInicial)
  
  useEffect(() => {
    if (estado.pesquisando) {
      pesquisa(estado.dado)
        .then(resposta => dispatch({type: 'REGISTRE_RESPOSTA', resposta}))
        .catch(() => dispatch({type: 'REGISTRE_FALHA_NA_CONEXAO'}))
    }  
  }, [estado.pesquisando, estado.dado, pesquisa])
  
  function armazenaDado(dado: string) {
    dispatch({type: 'ARMAZENE_DADO', dado})
  }

  function fazPesquisa() {
    dispatch({type: 'PESQUISE_DADO'})
  }

  return [estado, {armazenaDado, fazPesquisa}]
}
  