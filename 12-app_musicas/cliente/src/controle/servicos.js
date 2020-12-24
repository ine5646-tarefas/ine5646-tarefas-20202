//@flow

import { Artista } from '../modelo/Artista'
import type {RespostaPesquisa}  from '../tipos_flow'

async function buscaTopArtistas(): Promise<RespostaPesquisa> {
  const r = await fetch('topArtistas')
  const j = await r.json()
  if (j.ok) {
    const artistas = j.artistas.map(a => new Artista(a.nome, a.url, a.imagem))
    return {ok: true, artistas, horario: new Date(j.horario)}  
  } else {
    throw new Error(j.msg)
  }
}

export {buscaTopArtistas}