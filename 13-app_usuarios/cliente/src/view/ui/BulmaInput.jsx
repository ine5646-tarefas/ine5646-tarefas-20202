//@flow

import React from 'react'

type Props = {| 
  isPassword: boolean, 
  label: string,
  value: string, 
  onChange: string => void 
|}

const BulmaInput = (props: Props): React$Element<'div'> => {
  const tipo = props.isPassword ? 'password' : 'text'
  
  return (
    <div className='field'>
      <label className='label'>{props.label}</label>
      <div className='control'>
        <input 
          className='input is-primary' 
          type={tipo} 
          value={props.value}
          onChange={(ev) => props.onChange(ev.target.value)}/>
      </div>
    </div>
  )
}

export default BulmaInput
