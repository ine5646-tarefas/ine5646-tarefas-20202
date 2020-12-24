import React from 'react'
import ReactDOM from 'react-dom'
import App from './view/App.jsx'
import 'bulma/css/bulma.min.css'

const elem = document.createElement('div')

document.body.appendChild(elem)
ReactDOM.render(<App />, elem)