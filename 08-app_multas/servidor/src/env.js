//@flow

/* eslint-disable no-console */

let comErro = false

const PORTA: number = parseInt(process.env.PORT || 3000, 10)
const LOCAL: boolean = process.env.LOCAL === 'sim'
const URL_MULTAS_DB: string = process.env.URL_MULTAS_DB ? process.env.URL_MULTAS_DB : ''

if (URL_MULTAS_DB === '') {
  console.log('Variável URL_MULTAS_DB não definida no arquivo .env')
  comErro = true
}
  
if (comErro) {
  process.exit(1)
}

export {PORTA, URL_MULTAS_DB, LOCAL}
