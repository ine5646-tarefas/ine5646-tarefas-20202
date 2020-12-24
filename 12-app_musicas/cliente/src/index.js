import React from 'react'
import ReactDOM from 'react-dom'
import {UI} from './visao/UI.jsx'
import 'bulma/css/bulma.min.css'

import registra_sw from './pwa/registra_sw'

const elem = document.createElement('div')

document.body.appendChild(elem)
ReactDOM.render(<UI/>, elem)

registra_sw()