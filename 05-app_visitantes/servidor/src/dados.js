// gera número aleatório entre 0 e n. 
// Menor número: 0  
// Maior número: n
function geraAleatorio(n) {
  return Math.floor(Math.random() * (n + 1))
}

const MAX = 100

const meses = ['Jan', 'Mar', 'Abr', 'Mai', 'Jun', 'Jul', 'Ago', 'Set']

// gera array [ [mês, número], [mês, número], ...]
function obtemVisitantes() {
  return meses.map(mes => [mes, geraAleatorio(MAX)])
}

export default obtemVisitantes