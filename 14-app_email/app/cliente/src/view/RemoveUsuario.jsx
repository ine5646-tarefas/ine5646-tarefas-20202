//@flow
import React, {useState, useEffect} from 'react'
import jwt_decode from 'jwt-decode'

import Aviso from './Aviso.jsx'

import {removeUsuario} from '../model/servicos'

import type {TokenJWT} from '../tipos-flow'

function useModelo(token: TokenJWT, onRemoveu: void => void) {
  const [{removendo, msg}, setEstado] = useState({removendo: false, msg: undefined})

  function remove() {
    setEstado({removendo: true, msg: 'Removendo...'})
  }

  useEffect(() => {
    if (removendo) {
      removeUsuario(token)
        .then((r) => {
          if (r.ok) {
            setEstado({removendo: false, msg: 'Usuário removido'})
            onRemoveu()
          }
          else {
            setEstado({removendo: false, msg: r.motivo})
          }
        })
        .catch((erro) => {
          setEstado({removendo: false, msg: erro.message})
        })
    }
  })

  
  return [{removendo, msg}, remove]
}


type Props = {|
  token: TokenJWT,
  onDesistiu: void => void,
  onRemoveu: void => void
|}

export default function RemoveUsuario (props: Props): React$Element<'div'> {
  const [{removendo, msg}, remove] = useModelo(props.token, props.onRemoveu)
  const {email, nome} = jwt_decode(props.token)

  return (
    <div className='message is-danger'>
      <div className='message-header'>
        Remover Usuário {email} - {nome}
      </div>
      <div className='message-body has-background-warning'>
        <Aviso msg={msg}/>
        <div className='control'>
          <button
            className='button is-danger'
            disabled={removendo}
            onClick={() => remove()}>
            Sim, quero mesmo remover
          </button>
          <button
            className='button is-success'
            disabled={removendo}
            onClick={() => props.onDesistiu()}>
            Não quero mais remover
          </button>
        </div>
      </div>
    </div>)
}