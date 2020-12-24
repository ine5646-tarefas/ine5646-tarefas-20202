class Filmoteca {
  constructor () {
    this.__filmes = new Map()
  }

  adicioneFilme (filme) {
    this.__filmes.set(filme.id, filme)
  }

  get titulos () {
    const fIdTitulo = filme => ({
      id: filme.id,
      titulo: filme.titulo
    })

    const arrayDeFilmes = Array.from(this.__filmes.values())
    const arrayIdTitulo = arrayDeFilmes.map(fIdTitulo)

    return arrayIdTitulo
  }

  get qtdFilmes () {
    return this.__filmes.size
  }

  retorneFilme (id) {
    const filme = this.__filmes.get(id)
    return filme === undefined ? null : filme
  }
}

export { Filmoteca }
