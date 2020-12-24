//@flow
import React from 'react'
import ReactDOM from 'react-dom'
import App from './componentes/App.jsx'
import CssBaseline from '@material-ui/core/CssBaseline'

const MuiApp = () => (
  <React.Fragment>
    <CssBaseline/>
    <App/>
  </React.Fragment>
)

const elem = document.createElement('div')

document.body?.append(elem)
ReactDOM.render(<MuiApp/>, elem)
