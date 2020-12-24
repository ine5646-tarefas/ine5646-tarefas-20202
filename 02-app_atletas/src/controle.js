// controle.js

/**
 * Função que gera a página inicial da aplicação.
 * @param http.ClientResponse res Objeto que conterá a resposta HTTP.
 * @param {titulo, equipe} dados Dados usados na aplicação.
 */
function consultaInicial (res, dados) {
  res.render('index', dados)
}

/**
 * Função que gera a página que mostra apenas os atletas com uma altura mínima
 * @param  req Requisição HTTP enviada pelo usuário.
 * @param  res Resposta HTTP a ser enviada para o browser.
 * @param  dados Dados da aplicação.
 */
function consultaPesquisaPorAltura (req, res, dados) {
  const alturaMinima = parseInt(req.query.altura_minima)
  const atletas = dados.equipe.encontreAtletasComAlturmaMinima(alturaMinima)
  const resposta = {
    nome: dados.equipe.nome,
    titulo: dados.titulo,
    alturaMinima,
    atletas
  }
  res.render('resposta', resposta)
}

export {consultaInicial, consultaPesquisaPorAltura}
