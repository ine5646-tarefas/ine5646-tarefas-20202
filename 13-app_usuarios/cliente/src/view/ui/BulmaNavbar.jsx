//@flow

import * as React from 'react'
import type {CorBulma} from '../../tipos_flow'

type PropsNavbar = {| color: CorBulma, children: React.Node |}

type PropsNavbarItem = {| name: string, children: React.Node |}

const BulmaNavbar = (props: PropsNavbar): React$Element<'nav'> => (
  <nav className={`navbar ${props.color}`}>
    {props.children}
  </nav>
)

export const BulmaNavbarItem = (props: PropsNavbarItem): React$Element<'div'> => {
  return (
    <div className='navbar-item has-dropdown is-hoverable'>
      <span className='navbar-link'>
        {props.name}
      </span>

      <div className='navbar-dropdown'>
        {props.children}
      </div>
    </div>

  )
}

export default BulmaNavbar
