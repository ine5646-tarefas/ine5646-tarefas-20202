// visao.js

/**
 *  Monta uma página HTML exibindo os dados já processados.
 * @param http.ServerResponse res
 * @param [Pessoa] pessoas  Todas as pessoas cadastradas.
 * @param number idade  A idade limite.
 * @param [Pessoa] pessoasAcima  Pessoas com idade acima de idade limite.
 */
function montaResposta (res, pessoas, idade, pessoasAcima) {
  _escreveInicio(res, 'INE5646 - App Pessoas')
  _escreveCorpo(res, pessoas, idade, pessoasAcima)
  _escreveFim(res)
}

function _escreveCorpo (res, pessoas, idade, pessoasAcima) {
  const msg1 = `Qtd Total de Pessoas: ${pessoas.length}`
  const msg2 = `Qtd Pessoas com Idade Maior que ${idade}: ${pessoasAcima.length}`

  res.write('<h3>UFSC - CTC - INE - INE5646 :: App pessoas</h3>')
  res.write('<hr>')
  _escrevePessoas(res, msg1, pessoas)
  res.write(`<h2>Idade Limite: ${idade}</h2>`)
  _escrevePessoas(res, msg2, pessoasAcima)
}

function _escrevePessoas (res, msg, pessoas) {
  res.write(`<h1>${msg}</h1>`)
  res.write('<ol>')
  pessoas.forEach(pessoa => res.write(`<li>Nome: ${pessoa.nome} - Idade: ${pessoa.idade}</li>`))
  res.write('</ol>')
}

function _escreveInicio (res, titulo) {
  res.write('<!DOCTYPE html>')
  res.write('<html>')
  res.write('<head>')
  res.write('<meta charset="utf-8">')
  res.write('<meta name="viewport" content="width=device-width,initial-scale=1.0">')
  res.write(`<title>${titulo}</title>`)
  res.write('</head>')
  res.write('<body>')
}

function _escreveFim (res) {
  res.write('</body>')
  res.write('</html>')
}

export {montaResposta}
