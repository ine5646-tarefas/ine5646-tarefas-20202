//@flow

import React from 'react'
import type {Leilao, Login} from '../../model/tipos'

type Props = {|
  leilao: Leilao
|}

export default function MostraLeilao ({leilao}: Props): React$Element<'div'> {
  const melhorOferta = 
    leilao.produto.melhorOferta === null ? 
      <span>ainda sem oferta</span> : 
      <span> {leilao.produto.melhorOferta.comprador} paga R${leilao.produto.melhorOferta.valor}</span>

  const participantes =
    leilao.participantes.length === 0 ?
      <span>Ninguém</span> :
      <span>{MostraParticipantes(leilao.participantes)}</span>

  return <div className='message'>
    <div className='message-header'>
      {leilao.vendedor} leiloando {leilao.produto.nome}
    </div>
    <div className='message-body'>
      <div className='field'>
        <label className='label'>Preço Mínimo</label>
        <div className='control'>
          R${leilao.produto.precoMinimo}
        </div>
        <label className='label'>Participantes</label>
        <div className='control'>
          {participantes}
        </div>
        <label className='label'>Melhor Oferta</label>
        <div className='control'>
          {melhorOferta}
        </div>
      </div>
    </div>
  </div>
}

function MostraParticipantes(participantes: Array<Login>) {
  return <ul>
    {
      participantes.map(p => <li key={p} className='level-item'>{p}</li>)
    }
  </ul>
}