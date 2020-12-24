//@flow

/* eslint-disable no-console */
// verifica se todas as variáveis de ambiente estão definidas

let comErro = false

const PORTA: number = parseInt(process.env.PORT || 3000, 10)
const LOCAL: boolean = process.env.LOCAL === 'sim'

if (process.env.LASTFM_API_KEY === undefined) {
  console.log('Variável LASTFM_API_KEY não definida! Defina no arquivo .env')
  console.log('Para obter uma chave acesse https://www.last.fm/api')
  comErro = true
}

if (process.env.FANART_TV_API_KEY === undefined) {
  console.log('Variável FANART_TV_API_KEY não definida! Defina no arquivo .env')
  console.log('Para obter uma chave acesse https://fanart.tv/get-an-api-key/')
  comErro = true
}

if (comErro) {
  process.exit(1)
}

const LASTFM_API_KEY: string = process.env.LASTFM_API_KEY || ''
const FANART_TV_API_KEY: string = process.env.FANART_TV_API_KEY || ''
export { PORTA, LOCAL, LASTFM_API_KEY, FANART_TV_API_KEY }
