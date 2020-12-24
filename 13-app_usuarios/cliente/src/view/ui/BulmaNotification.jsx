//@flow
import React from 'react'
import type {CorBulma} from '../../tipos_flow'

type Props = {| message: string, color: | CorBulma |}

const BulmaNotification = (props: Props): React$Element<'div'> => {
  return (
    <div className={`notification ${props.color}`}>
      {props.message}
    </div>
  )
}

export default BulmaNotification
