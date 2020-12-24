//@flow

import type {LivroACadastrar, Livro} from './tipos_flow'

export type Cadastrou = {| salvou: true, id: string |}
export type NaoCadastrou = {| salvou: false |}

const servicos = {
  conecta: (): Promise<boolean> =>
    fetch('/conecta')
      .then(r => analisaStatusCode(r))
      .then(r => r.json())
      .then(json => json.conectou)
  ,

  desconecta: (): Promise<boolean> =>
    fetch('/desconecta')
      .then(r => analisaStatusCode(r))
      .then(() => true)
  ,
  cadastre: (dados: LivroACadastrar): Promise<Cadastrou | NaoCadastrou> => {
    const promResposta =
      fetch('/salva', {
        method: 'post',
        headers: {'Content-Type':'application/json'},
        body: JSON.stringify(dados)
      })

    return promResposta
      .then(r => analisaStatusCode(r))
      .then(r => r.json())
  }
  ,
  pesquiseTodos: (): Promise<Array<Livro>> => {
    return fetch('/pesquisaTodos')
      .then(r => analisaStatusCode(r))
      .then(r => r.json())
  }
  ,
  pesquisePorId: (id: string): Promise<Livro | null> => {
    return fetch(`/pesquisaPorId?id=${id}`)
      .then(r => analisaStatusCode(r))
      .then(r => r.json())
  }
  ,
  pesquisePorTitulo: (titulo: string): Promise<Array<Livro>> => {
    return fetch(`/pesquisaPorTitulo?titulo=${titulo}`)
      .then(r => analisaStatusCode(r))
      .then(r => r.json())
  }
}

function analisaStatusCode(resposta) {
  if (resposta.status === 200)
    return Promise.resolve(resposta)
  else
    return Promise.reject(false)
}

export default servicos
