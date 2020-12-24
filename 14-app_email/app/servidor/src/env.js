/* eslint-disable no-console */
// @flow

const LOCAL: boolean = process.env.LOCAL === 'sim'
const PORTA: number = parseInt(process.env.PORT || 3000, 10)
const RABBITMQ_URL: string = process.env.RABBITMQ_URL || ''

if (process.env.RABBITMQ_URL === '') {
  console.log('Falta definir a variável RABBITMQ_URL')
  process.exit(1)
}


export {PORTA, LOCAL, RABBITMQ_URL}
