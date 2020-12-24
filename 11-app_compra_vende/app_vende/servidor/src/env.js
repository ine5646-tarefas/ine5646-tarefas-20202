//@flow

export const LOCAL: boolean = process.env.LOCAL === 'sim'
export const PORTA: number = parseInt(process.env.PORT || 3000, 10)
export const RABBITMQ_URL: string = process.env.RABBITMQ_URL || ''

if (RABBITMQ_URL === '') {
  console.log('Falta definir variável RABBITMQ_URL')
  process.exit(1)
}
