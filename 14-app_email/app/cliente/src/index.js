import React from 'react'
import ReactDOM from 'react-dom'
import App from './view/App.jsx'

const elem = document.createElement('div')
document.body.appendChild(elem)
ReactDOM.render(<App />, elem)
