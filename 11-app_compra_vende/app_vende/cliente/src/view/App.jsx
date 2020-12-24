//@flow
import React from 'react'

import VerificaPedidos from './VerificaPedidos.jsx'

function App (): React$Element<'div'> {
  return (
    <div className='container is-fluid'>
      <div className="message is-dark">
        <div className="message-header">
          UFSC - CTC - INE - INE5646 :: Apps Compra e Vende :: Vendedor
        </div>
        <div className="message-body">
          <div className='columns'>
            <div className='column'>
              <VerificaPedidos/>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}


export default App
