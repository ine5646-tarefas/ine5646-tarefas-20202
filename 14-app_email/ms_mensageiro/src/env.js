/* eslint-disable no-console */
// @flow

// verificar se todas as variáveis de ambiestão definidas

let todasDefinidas = true

const MAX_MSGS_LIDAS: string = process.env.MAX_MSGS_LIDAS || ''

if (MAX_MSGS_LIDAS === '') {
  console.log('Falta definir a variável MAX_MSGS_LIDAS no arquivo .env')
  todasDefinidas = false
}

const RABBITMQ_URL: string = process.env.RABBITMQ_URL || ''

if (RABBITMQ_URL === '') {
  console.log('Falta definir a variável RABBITMQ_URL no arquivo .env')
  todasDefinidas = false
}

const URL_BANCO: string = process.env.URL_BANCO || ''

if (URL_BANCO === '') {
  console.log('Falta definir a variável URL_BANCO no arquivo .env')
  todasDefinidas = false
}

if (!todasDefinidas) {
  process.exit(1)
}

export {MAX_MSGS_LIDAS, RABBITMQ_URL, URL_BANCO}