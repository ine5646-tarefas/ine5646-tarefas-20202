//@flow
import React from 'react'

type PropsAviso = {|
    msg: string | void
  |}
  
export default function Aviso({msg}: PropsAviso): React$Element<'div'> {
  return <div className='field'>
    <label className='label'>
        Aviso
    </label>
    <div className='notification is-black has-text-warning has-text-weight-bold is-family-code is-size-5'>
      {msg}
    </div>
  </div> 
}
  