//@flow

// util_masks.js

// Define máscaras para entrada de dados

const util_masks = {
  cpfMask : '999.999.999-99',
  placaMask : 'aaa-9999',
  anoMask : '9999',
  pontosMask : '99',
  idMultaMask : '********',
}

function eliminaCaracteres(palavra: string, caracteres: Array<string>) {
  caracteres.forEach(caracter => {
    while (palavra.indexOf(caracter) !== -1)
      palavra = palavra.replace(caracter, '')
  })
  return palavra
}

export function limpaCPF(cpf: string): string {
  return eliminaCaracteres(cpf, ['.', '-'])
}

export function limpaPlaca(placa: string): string {
  return eliminaCaracteres(placa, ['-'])
}

export default util_masks
