class Filme {
  constructor (id, titulo, lancamento, direcao) {
    this.__id = id
    this.__titulo = titulo
    this.__lancamento = lancamento
    this.__direcao = direcao
  }

  get id () {
    return this.__id
  }

  get titulo () {
    return this.__titulo
  }

  get lancamento () {
    return this.__lancamento
  }

  get direcao () {
    return this.__direcao
  }
}

export { Filme }
