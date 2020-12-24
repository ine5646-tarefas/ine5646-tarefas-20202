/* eslint-disable no-console */
// @flow

// verifica se todas as variáveis de ambiente estão definidas

let todasDefinidas = true

export const RABBITMQ_URL: string = process.env.RABBITMQ_URL || ''
if (RABBITMQ_URL === '') {
  console.log('Falta definir a variável RABBITMQ_URL no arquivo .env')
  todasDefinidas = false
}

export const EMAIL: string = process.env.EMAIL || ''
if (EMAIL === '') {
  console.log('Falta definir a variável EMAIL no arquivo .env')
  todasDefinidas = false
}

export const EMAIL_PASSWORD: string = process.env.EMAIL_PASSWORD || ''
if (EMAIL_PASSWORD === undefined) {
  console.log('Falta definir a variável EMAIL_PASSWORD no arquivo .env')
  todasDefinidas = false
}

export const IPQUALITYSCORE_API_KEY: string = process.env.IPQUALITYSCORE_API_KEY || ''
if (IPQUALITYSCORE_API_KEY === '') {
  console.log('Falta definir a variável IPQUALITYSCORE_API_KEY no arquivo .env')
  todasDefinidas = false
}

if (!todasDefinidas) {
  process.exit(1)
}
