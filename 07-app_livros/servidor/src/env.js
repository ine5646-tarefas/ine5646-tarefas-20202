//@flow

/* eslint-disable no-console */
// verifica se todas as variáveis de ambiente estão definidas

let comErro = false

if (process.env.MONGODB_LIVROS === undefined) {
  console.log('Variável MONGODB_LIVROS não definida! Defina no arquivo servidor/.env')
  console.log('Exemplo: MONGODB_LIVROS=mongodb://usuario45:senha@ds034892.mlab.com:34892/bd_livros')
  comErro = true
}

if (comErro)
  process.exit(1)

const LOCAL: boolean = process.env.LOCAL === 'sim'
const PORTA: number = parseInt(process.env.PORT || 3000, 10)
const MONGODB_LIVROS: string = process.env.MONGODB_LIVROS || ''

export {PORTA, MONGODB_LIVROS, LOCAL}
