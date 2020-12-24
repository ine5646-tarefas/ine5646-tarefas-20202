//@flow

export class Artista {
  __nome: string
  __url: string
  __imagem: string

  constructor(nome: string, url: string, imagem: string) {
    this.__nome = nome
    this.__imagem = imagem
    this.__url = url
  }

  get nome(): string {
    return this.__nome
  }

  get imagem(): string {
    return this.__imagem
  }

  get url(): string {
    return this.__url
  }
}