/* eslint-disable no-console */
// @flow

export const RABBITMQ_URL: string = process.env.RABBITMQ_URL || ''
export const PORTA: number = parseInt(process.env.PORT || 3000, 10)
export const LOCAL: boolean = process.env.LOCAL === 'sim'

if (RABBITMQ_URL === '') {
  console.error('Falta definir variável RABBITMQ_URL')
  process.exit(1)
}