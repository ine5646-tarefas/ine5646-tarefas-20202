//@flow

import * as React from 'react'
import type {CorBulma} from '../../tipos_flow'

type Props = {| color: CorBulma, title: string, children: React.Node |}

const BulmaMessage = (props: Props): React$Element<'div'> => (
  <div className={`message ${props.color}`}>
    <div className='message-header'>
      {props.title}
    </div>
    <div className='message-body'>
      {props.children}
    </div>
  </div>
)

export default BulmaMessage
