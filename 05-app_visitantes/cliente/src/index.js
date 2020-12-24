import React from 'react'
import ReactDOM from 'react-dom'
import App  from './visao/App.jsx'
import PrimeReact from 'primereact/utils'

const elem = document.createElement('div')

PrimeReact.ripple = true

document.body.append(elem)
ReactDOM.render(<App/>, elem)
