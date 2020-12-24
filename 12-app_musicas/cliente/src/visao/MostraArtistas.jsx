//@flow

import React from 'react'
import { MostraArtista } from './MostraArtista.jsx'

import {Artista} from '../modelo/Artista'

type ArtistasInternet = {| artistas: Array<Artista>, comInternet: boolean|}

export function MostraArtistas ({artistas, comInternet}: ArtistasInternet): React$Element<'ol'> {
  return (
    <ol>
      {artistas.map((a, i) => <li key={i}><MostraArtista artista={a} comInternet={comInternet}/></li>)}
    </ol>
  )
}