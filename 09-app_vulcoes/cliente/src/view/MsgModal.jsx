// @flow
import React from 'react'

type Props = {| 
  msg: string
|}

const MsgModal = (props: Props): React$Element<'div'>  => {
  return (
    <div className='modal is-active'>
      <div className='modal-background'></div>
      <div className='modal-content'>
        <div className='notification is-info'>
          {props.msg}
        </div>
      </div>
    </div>

  )
}

export default MsgModal
