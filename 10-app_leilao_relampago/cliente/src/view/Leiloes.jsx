//@flow
import React from 'react'

import type {Leilao, Login, Lance} from '../model/tipos'

import OutroLeilao from './OutroLeilao.jsx'

type Props = {|
  comprador: Login,
  onEnviarLance: Lance => void,
  onAbandonarLeilao: void => void,
  onParticiparDeLeilao: Login => void,
  onSairDeLeilao: void => void,
  leiloes: Array<Leilao>,
  optOutroLeilao: void | Leilao, // leilão que eu participo
|}


export default function Leiloes(props: Props): React$Element<'div'> {

  let conteudo

  if (props.optOutroLeilao === undefined)
    conteudo = <div className='message is-link'>
      <div className='message-header'>
        Outros Leilões Disponíveis
      </div>
      <div className='message-body'>
        {
          props.leiloes.length === 0 && <p>Nenhum leilão no momento.</p>
        }
        {
          props.leiloes.length > 0 &&
        <ul>
          {
            props.leiloes.map(leilao => 
              <li key={leilao.vendedor}>
                {leilao.vendedor} está leiloando {leilao.produto.nome} por R${leilao.produto.precoMinimo}
                <button 
                  className='button' 
                  onClick={() => props.onParticiparDeLeilao(leilao.vendedor)}>
                    Participar
                </button>
              </li>
            )
          }
        </ul>
        }
      </div>
    </div>
  else {
    conteudo = 
      <OutroLeilao
        comprador={props.comprador}
        leilao={props.optOutroLeilao} 
        onEnviarLance={props.onEnviarLance}
        onAbandonarLeilao={props.onAbandonarLeilao}
        onSair={() => props.onSairDeLeilao()}
      />
  }
  return <div>{conteudo}</div>
}