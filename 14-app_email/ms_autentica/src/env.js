/* eslint-disable no-console */
// @flow

// Variáveis de ambiente, acessadas via process.env, devem ser
// definidas no arquivo .env.

// verificar se todas as variáveis de ambiestão definidas

let todasDefinidas = true

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

const CRIPTO_SALT: string = process.env.CRIPTO_SALT || ''

if (CRIPTO_SALT === '') {
  console.log('Falta definir a variável CRIPTO_SALT no arquivo .env')
  todasDefinidas = false
}

const JWT_PASSWORD: string = process.env.JWT_PASSWORD || ''
if (JWT_PASSWORD === '') {
  console.log('Falta definir a variável JWT_PASSWORD no arquivo .env')
  todasDefinidas = false
}

const JWT_DURATION: string = process.env.JWT_DURATION || ''
if (JWT_DURATION === '') {
  console.log('Falta definir a variável JWT_DURATION no arquivo .env')
  todasDefinidas = false
}

if (!todasDefinidas) {
  process.exit(1)
}

export {JWT_PASSWORD, JWT_DURATION, CRIPTO_SALT, URL_BANCO, RABBITMQ_URL}