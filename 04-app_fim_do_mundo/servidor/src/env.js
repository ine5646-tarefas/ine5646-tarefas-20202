/* eslint-disable no-console */
// verifica se todas as variáveis de ambiente estão definidas

let comErro = false

if (process.env.NASA_API_KEY === undefined) {
  console.log('Variável NASA_API_KEY não definida!')
  console.log('Para obter uma chave acesse https://api.nasa.gov/index.html#apply-for-an-api-key')
  comErro = true
}

if (comErro) {
  process.exit(1)
}

const LOCAL = process.env.LOCAL === 'sim'
const PORTA = parseInt(process.env.PORT || 3000, 10)
const NASA_API_KEY = process.env.NASA_API_KEY
export { PORTA, NASA_API_KEY, LOCAL }
