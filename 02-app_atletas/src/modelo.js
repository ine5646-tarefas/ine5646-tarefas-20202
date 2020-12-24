// modelo.js

class Atleta {
  constructor (nome, altura) {
    this.__nome = nome
    this.__altura = altura
  }

  get nome () {
    return this.__nome
  }

  get altura () {
    return this.__altura
  }
}

class Equipe {
  constructor (nome) {
    this.__nome = nome
    this.__atletas = []
  }

  adicione (atleta) {
    this.__atletas.push(atleta)
  }

  get nome () {
    return this.__nome
  }

  get atletas () {
    return this.__atletas
  }

  encontreAtletasComAlturmaMinima (alturaMinima) {
    return this.__atletas
  }
}

export {Atleta, Equipe}
