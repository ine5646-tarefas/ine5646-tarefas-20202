// controle.js

import {pessoas, idadeMinima, selecionaPessoas} from './modelo'
import {montaResposta} from './visao'

/**
 * Função que gera a resposta HTTP a cada requisição HTTP recebida pelo Node.
 * @param http.ServerResponse res
 */
function atendeRequisicao (res) {
  const pessoasAcimaDaIdadeMinima = selecionaPessoas(pessoas, idadeMinima)
  montaResposta(res, pessoas, idadeMinima, pessoasAcimaDaIdadeMinima)
  res.end()
}

export {atendeRequisicao}
