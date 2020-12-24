//@flow
import React, {useState, useEffect, useRef} from 'react'
import {tokenExpiraraEm, tokenExpirou} from '../model/util'
import {renovaToken} from '../model/servicos'
import type {TokenJWT} from '../tipos-flow'

type Estado = {| 
    perguntar: boolean,
    expirando: boolean ,
    renovando: boolean
|}

const estadoInicial: Estado = {
  perguntar: true,
  expirando: false,
  renovando: false
}

// https://overreacted.io/making-setinterval-declarative-with-react-hooks/
function useInterval(callback, delay) {
  const savedCallback = useRef()

  // Remember the latest callback.
  useEffect(() => {
    savedCallback.current = callback
  }, [callback])

  // Set up the interval.
  useEffect(() => {
    function tick() {
      savedCallback.current !== undefined && savedCallback.current()
    }
    if (delay !== null) {
      let id = setInterval(tick, delay)
      return () => clearInterval(id)
    }
  }, [delay])
}

function useModelo(token: TokenJWT, tempo: number, onNovoToken: TokenJWT => void, onTokenExpirou: void => void) {
  const [estado, setEstado] = useState(estadoInicial)

  function naoPerguntarMais() {
    setEstado({...estado, perguntar: false})
  }

  function querRenovarToken() {
    setEstado({...estado, renovando: true})
  }

  useInterval(() => {
    if (!estado.renovando && estado.perguntar && estado.expirando === false && tokenExpiraraEm(token, tempo)) {
      setEstado(estado => ({...estado, expirando: true}))
    }
  }, 3000)

  useEffect(() => {
    if (tokenExpirou(token))
      onTokenExpirou()
    else
    if (estado.renovando) {
      renovaToken(token)
        .then(r => {
          setEstado({...estado, renovando: false, expirando: false})
          r.ok ? onNovoToken(r.token) : onTokenExpirou()
        })
        .catch(() => onTokenExpirou())
    }
  })

  return [estado, naoPerguntarMais, querRenovarToken]
}

type Props = {| 
    token: TokenJWT, 
    tempo: number, 
    onNovoToken: TokenJWT => void,
    onTokenExpirou: void => void
|}

export default function TokenExpirando(props: Props): React$Element<'div'> {
  const [estado, naoPerguntarMais, querRenovarToken] = 
    useModelo(props.token, props.tempo, props.onNovoToken, props.onTokenExpirou)

  let conteudo

  if (!estado.renovando && estado.expirando && estado.perguntar) {
    conteudo = <div className='modal is-active'>
      <div className='modal-background'></div>
      <div className='modal-card'>
        <header className='modal-card-head'>
          <p className='modal-card-title'>Sessão Expirará Em Breve</p>
        </header>
        <section className='modal-card-body'>
            Sua sessão expirará em breve. Você deseja continuar?
        </section>
        <footer className='modal-card-foot'>
          <button className='button is-success' onClick={querRenovarToken}>
                Continuar
          </button>
          <button className='button is-danger' onClick={naoPerguntarMais}>
                Ignorar
          </button>
        </footer>
      </div>
    </div>
  }
  return <div>{conteudo}</div>
}