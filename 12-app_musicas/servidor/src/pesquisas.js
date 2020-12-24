//@flow
import { LASTFM_API_KEY, FANART_TV_API_KEY } from './env'

import fetch from 'node-fetch'

const URL_ROOT_LASTFM = 'http://ws.audioscrobbler.com/2.0/'

const URL_ROOT_FANART = 'http://webservice.fanart.tv/v3/music'


type Artista = 
  {| nome: string, url: string, imagem: null | string |}
  
type Resposta = 
    {| ok: false, msg: string |}
  | {| ok: true, artistas: Array<Artista>, horario: number |}


export async function topArtistas(): Promise<Resposta> {
  const URL = `${URL_ROOT_LASTFM}?format=json&method=chart.getTopArtists&limit=10&api_key=${LASTFM_API_KEY}`
  try {
    const r = await fetch(URL)
    const j = await r.json()
    if (j.error !== undefined)
      throw new Error(j.message)
    const a = await obtemImagens(j.artists.artist)
    return {ok: true, artistas: a, horario: Date.now()}
  }
  catch (erro) {
    throw {ok: false, msg: `LastFM indisponível no momento: ${erro.message}`}
  }
}

// Sobre mbid: https://musicbrainz.org/

async function obtemImagens(artistas_lastfm): Promise<Array<Artista>> {
  const as = Promise.all(artistas_lastfm.map(async (a) => {
    if (a.mbid.length > 0) { // nem sempre Last.fm fornece mbid do artista
      const URL = `${URL_ROOT_FANART}/${a.mbid}?api_key=${FANART_TV_API_KEY}`
      const r = await fetch(URL)
      const j = await r.json()
      try {
        return {nome: a.name, url: a.url, imagem: j.artistbackground[0].url}
      }
      catch (erro) { // nem sempre o fanart fornece imagem do artista
        return {nome: a.name, url: a.url, imagem: null}
      }

    } else
      return {nome: a.name, url: a.url, imagem: null}
  }))

  return as
}