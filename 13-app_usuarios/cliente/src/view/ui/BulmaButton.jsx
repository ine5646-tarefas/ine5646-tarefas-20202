//@flow

import React from 'react'

import type {CorBulma} from '../../tipos_flow'

type Props = {| 
  disabled: boolean, 
  label: string, 
  color: CorBulma, 
  onClick: SyntheticEvent<> => void  
|}

const BulmaButton = (props: Props): React$Element<'button'> => {
  return (
    <button
      className={`button is-outlined is-rounded ${props.color}`}
      onClick={props.onClick} disabled={props.disabled}>
      {props.label}
    </button>
  )
}

export default BulmaButton
