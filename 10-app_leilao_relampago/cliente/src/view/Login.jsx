//@flow
import React, {useState} from 'react'

import type {Login as TipoLogin} from '../model/tipos'

type Props = {| 
  optMsg: void | string,
  onPronto: TipoLogin => void
|}

type EstadoLocal = {|
  loginProposto: string,
  digitando: boolean
|}


const estadoInicial: EstadoLocal = {
  loginProposto: '',
  digitando: false
}

export default function Login(props: Props): React$Element<'div'> {
  const [estado, setEstado] = useState<EstadoLocal>(estadoInicial)

  function podeLogar() {
    return estado.loginProposto.length > 0 &&
      estado.loginProposto.length < 11 && !/\W/.test(estado.loginProposto)
  }

  function tentaLogin() {
    props.onPronto(estado.loginProposto)
    setEstado({digitando: false, loginProposto: estado.loginProposto})
  }
  return <div className='message is-info'>
    <div className='message-header'>
        Login
    </div>
    <div className='message-body'>
      <div className='field'>
        <label className='label'>Defina seu login</label>
        <div className='control'>
          <input className='input' 
            type='text' placeholder='seu login' value={estado.loginProposto}
            onChange={ev => {
              ev.persist()
              setEstado({digitando: true, loginProposto: ev.target.value})}
            }/>
        </div>
      </div>
      <div className='field'>
        <div className='control'>
          <button className='button' 
            disabled={!podeLogar()}
            onClick={tentaLogin}>Entrar</button>
        </div>
      </div>
      {
        props.optMsg !== undefined && !estado.digitando &&
          <div className='notification'>
            {props.optMsg}
          </div>
      }
    </div>
  </div>
}