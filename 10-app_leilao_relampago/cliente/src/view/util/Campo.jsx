//@flow

import React from 'react'

type Props = {|
    rotulo: string,
    valor: string | number,
    tipo: 'text' | 'number',
    dica: string,
    onChange: string => void
  |}
  
export default function Campo ({rotulo, valor, tipo, dica, onChange}: Props): React$Element<'div'> {
  return <div className='field'>
    <label className='label'>{rotulo}</label>
    <div className='control'>
      <input 
        className='input' 
        value={valor} 
        type={tipo} 
        placeholder={dica}
        onChange={ev => onChange(ev.target.value)}/>
    </div>
  </div>
}