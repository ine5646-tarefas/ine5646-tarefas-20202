// toda a comunicação entre cliente e servidor
// é feita por meio das funções enviaComando e enviaConsulta

// Uma consulta é uma operação de leitura que ocorre no lado servidor.
// Um comando é uma operação de escrita que ocorre no lado servidor.

export function enviaConsulta (nome, dados) {
  const parametros = {
    method: 'post',
    headers: {
      'content-type': 'application/json'
    },
    body: JSON.stringify(dados)
  }
  return enviaRequisicaoHTTP(`/consulta/${nome}`, parametros)
}

export function enviaComando(nome, dados) {
  const parametros = {
    method: 'post',
    headers: {
      'content-type': 'application/json'
    },
    body: JSON.stringify(dados)
  }
  return enviaRequisicaoHTTP(`/comando/${nome}`, parametros)
}


// Envia assíncronamente uma requisição HTTP para o servidor e analisa a resposta HTTP retornada.
function enviaRequisicaoHTTP(url, parametros) {
  let promRespostaHTTP

  if (parametros === undefined)
    promRespostaHTTP = fetch(url)
  else
    promRespostaHTTP = fetch(url, parametros)

  const promResposta =
    promRespostaHTTP
      .then(resp =>
      {
        if (resp.ok === false)throw new Error('Servidor indisponível')
        return resp
      })
      .then(resposta => resposta.json())
      .catch(erro =>
      {
        // eslint-disable-next-line no-console
        console.log(erro)
        throw erro
      })

  return promResposta
}
