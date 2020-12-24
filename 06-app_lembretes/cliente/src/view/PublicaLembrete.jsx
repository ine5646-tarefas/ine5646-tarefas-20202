//@flow
import React, {useState, useEffect} from 'react'

import {publicaLembrete} from '../servicos'

import type {Token} from '../tipos_flow'

type Props = {|
  token: Token,
  onTokenInvalido: void => void
|}

type Estado = {| 
  texto: string,
  publicando: boolean
|}

const estadoInicial: Estado = {
  texto: '',
  publicando: false
}

function PublicaLembrete (props: Props): React$Element<'div'> {
  const [estado: Estado, setEstado: Estado => void] = useState(estadoInicial)

  function textoAlterado(ev) {
    setEstado({texto: ev.target.value, publicando: false})
  }

  function publica() {
    setEstado({texto: estado.texto, publicando: true})
  }

  const token = props.token
  const onTokenInvalido = props.onTokenInvalido
  useEffect(() => {
    if (estado.publicando) {
      publicaLembrete(estado.texto, token)
        .then(() => setEstado(estadoInicial))
        .catch(() => {
          setEstado(estadoInicial)
          onTokenInvalido()
        })
    }
  }, [estado, token, onTokenInvalido])

  return (
    <div className='message is-primary'>
      <div className='message-header'>Lembrete</div>
      <div className='message-body'>
        <textarea className='textarea' value={estado.texto} onChange={textoAlterado}/>
        <button className='button is-success' onClick={publica}>Publicar</button>
      </div>
    </div>
  )
}


export default PublicaLembrete
