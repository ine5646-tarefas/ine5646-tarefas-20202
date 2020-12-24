/* eslint-disable no-console */
// @flow

// Variáveis de ambiente, acessadas via process.env, devem ser
// definidas no arquivo .env.

// verificar se todas as variáveis de ambiestão definidas

let todasDefinidas = true

export const LOCAL: boolean = process.env.LOCAL === 'sim'

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

export const LIMITE_IMAGEM: number = parseInt(process.env.LIMITE_IMAGEM || -1, 10)

if (LIMITE_IMAGEM === -1) {
  console.log('Falta definir variável LIMITE_IMAGEM no arquivo .env')
  todasDefinidas = false
}

export const DURACAO_TOKEN: string = process.env.DURACAO_TOKEN || ''

if (DURACAO_TOKEN === '') {
  console.log('Falta definir variável DURACAO_TOKEN no arquivo .env')
  todasDefinidas = false
}

export const PORTA: number = parseInt(process.env.PORT || 3000, 10)

if (!todasDefinidas) {
  process.exit(1)
}
