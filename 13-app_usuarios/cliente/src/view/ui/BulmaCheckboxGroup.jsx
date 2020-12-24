//@flow

import React from 'react'

import BulmaCheckbox from './BulmaCheckbox.jsx'
import type {OpcaoCheckbox} from '../../tipos_flow'

type Props = {| 
  label: string,  
  options: Array<OpcaoCheckbox>,
  onSelect: string => void,
  onUnselect: string => void
|}

const BulmaCheckboxGroup = (props: Props): React$Element<'div'> => {
  const opcoes =
    props.options.map(opcao => 
      <BulmaCheckbox 
        key={opcao.label} 
        value={opcao.value}
        {...opcao}
        onSelect={props.onSelect}
        onUnselect={props.onUnselect}/>)

  return (
    <div className='field'>
      <label className='label'>{props.label}</label>
      <div className='control'>
        {opcoes}
      </div>
    </div>
  )
}

export default BulmaCheckboxGroup
