//@flow

import React from 'react'
import ReactDOM from 'react-dom'
import App from './componentes/App.jsx'

const elem = document.createElement('div')

document.body?.append(elem)
ReactDOM.render(<App/>, elem)
