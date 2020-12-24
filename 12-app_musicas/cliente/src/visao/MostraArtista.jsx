//@flow
import React from 'react'

import {Artista} from '../modelo/Artista'

type ArtistaInternet = {| artista: Artista, comInternet: boolean |}

export function MostraArtista ({artista, comInternet}: ArtistaInternet): React$Element<'div'> {
  const imagem = artista.imagem === null
    ? <p>sem imagem disponível</p>
    : <img src={artista.imagem}/>

  return (
    <div className='message is-info'>
      <div className='message-header'>
        {artista.nome}
        {comInternet && <a href={artista.url} target='_blank' rel='noopener noreferrer'>ver site</a>}
      </div>
      <div className='message-body'>
        {imagem}
      </div>
    </div>
  )
}