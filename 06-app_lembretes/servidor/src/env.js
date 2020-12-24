//@flow
/* eslint-disable no-console */

// Variáveis de ambiente, acessadas via process.env, devem ser
// definidas no arquivo .env.

// verificar se todas as variáveis de ambiestão definidas

let todasDefinidas = true

export const PORTA: number = parseInt(process.env.PORT || 3000, 10)

export const BD_URL: string = process.env.BD_URL || ''

if (BD_URL === '') {
  console.log('Falta definir variável BD_URL no arquivo .env')
  todasDefinidas = false
}

export const SENHA_JWT: string = process.env.SENHA_JWT || ''

if (SENHA_JWT === '') {
  console.log('Falta definir variável SENHA_JWT no arquivo .env')
  todasDefinidas = false
}

export const DURACAO_JWT: string = process.env.DURACAO_JWT || ''

if (DURACAO_JWT === '') {
  console.log('Falta definir variável DURACAO_JWT no arquivo .env')
  todasDefinidas = false
}

export const SALT: string = process.env.SALT || ''

if (SALT === '') {
  console.log('Falta definir variável SALT no arquivo .env')
  todasDefinidas = false
}

export const LOCAL: boolean = process.env.LOCAL === 'sim'

if (!todasDefinidas) {
  process.exit(1)
}
