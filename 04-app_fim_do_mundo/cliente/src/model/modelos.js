class Asteroide {
  constructor (nome, diametro, distancia, ehAmeaca) {
    this.nome = nome
    this.diametro = diametro
    this.distancia = distancia
    this.ehAmeaca = ehAmeaca
  }
}

class Relatorio {
  constructor (data, asteroides) {
    this.data = data
    this.asteroidesAmeacadores = asteroides.filter(asteroide => asteroide.ehAmeaca)
    this.asteroidesInofensivos = asteroides.filter(asteroide => !asteroide.ehAmeaca)
  }
}

export { Asteroide, Relatorio }
