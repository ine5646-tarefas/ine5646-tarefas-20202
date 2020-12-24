import React from 'react'
import ReactDOM from 'react-dom'
import {IU} from './visao/IU.jsx'
import 'bulma/css/bulma.min.css'

const elem = document.createElement('div')

document.body.appendChild(elem)
ReactDOM.render(<IU/>, elem)
