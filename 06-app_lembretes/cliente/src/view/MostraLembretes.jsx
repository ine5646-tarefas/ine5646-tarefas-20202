//@flow
import React, {useState, useEffect} from 'react'

import { leLembretes, apagaLembrete } from '../servicos'
import MostraLembrete from './MostraLembrete.jsx'

import type {Token, Lembrete} from '../tipos_flow'

type Props = {| 
  token: Token,
  onTokenInvalido: void => void
|}

type Estado = {| 
  lembretes: Array<Lembrete> | void,
  idLembreteApagar: string | void,
  lendo: boolean
|}

const estadoInicial: Estado = {
  lembretes: undefined,
  idLembreteApagar: undefined,
  lendo: false
}


function MostraLembretes (props: Props): React$Element<'div'> {
  const [estado: Estado, setEstado] = useState(estadoInicial)

  
  function apagaUmLembrete(idLembrete) {
    setEstado({...estado, idLembreteApagar: idLembrete})
  }

  function leTodosLembretes() {
    setEstado({...estado, lendo: true})
  }

  const onTokenInvalido = props.onTokenInvalido
  const token = props.token

  useEffect(() => {
    if (estado.idLembreteApagar !== undefined) {
      apagaLembrete(token, estado.idLembreteApagar)
        .then(() => {
          if (estado.lembretes !== undefined) {
            const lembs = estado.lembretes.filter(lemb => lemb._id !== estado.idLembreteApagar)
            setEstado({...estadoInicial, lembretes: lembs})
          }
        })
        .catch(() => {
          setEstado(estadoInicial)
          onTokenInvalido()
        })

    }
  }, [estado.idLembreteApagar, estado.lembretes, onTokenInvalido, token])

  useEffect(() => {
    if (estado.lendo) {
      leLembretes(token)
        .then(lembretes => setEstado({...estadoInicial, lembretes}))
        .catch(() => {
          setEstado(estadoInicial)
          onTokenInvalido()
        })
    }
  }, [estado.lendo, onTokenInvalido, token])

  return (
    <div className='message'>
      <div className='message-header'>Mostrar Lembretes
        <button className='button is-info' onClick={leTodosLembretes}>
          Ler Lembretes
        </button>
      </div>
      {
        estado.lembretes !== undefined &&
          <div>
            {estado.lembretes.map(l =>
              <span key={l._id}>
                <MostraLembrete id={l._id}
                  texto={l.texto}
                  onDelete={() => apagaUmLembrete(l._id)}/>
              </span>)}
          </div>
      }
      {
        estado.lembretes !== undefined && 
        estado.lembretes.length == 0 &&
        <div className='notification is-warning'>Não há lembretes para este usuário.</div>
      }
    </div>
  )
}


export default MostraLembretes
