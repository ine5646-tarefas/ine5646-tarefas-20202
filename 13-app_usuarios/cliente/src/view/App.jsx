//@flow
import React, {useReducer} from 'react'

import Login from './Login.jsx'
import Tarefas from './tarefas/Tarefas.jsx'
import BulmaMessage from './ui/BulmaMessage.jsx'

import 'bulma/css/bulma.min.css'

import type {IdTokenResult} from '../tipos_flow'

type Estado = {|
  optIdTokenResult: IdTokenResult | void,
  papeisPossiveis: Array<string>
|}


type Acao =
    {| type: 'REGISTRE_PAPEIS_POSSIVEIS', papeisPossiveis: Array<string> |}
  | {| type: 'REGISTRE_USUARIO_ENTROU', idTokenResult: IdTokenResult |}
  | {| type: 'REGISTRE_USUARIO_SAIU' |}


const estadoInicial: Estado = {
  optIdTokenResult: undefined,
  papeisPossiveis: []
}

function reducer(estado: Estado, acao: Acao): Estado {
  switch (acao.type) {
  
  case 'REGISTRE_USUARIO_ENTROU':
    return {...estado, optIdTokenResult: acao.idTokenResult}
  
  case 'REGISTRE_USUARIO_SAIU':
    return {...estado, optIdTokenResult: undefined}
  
  case 'REGISTRE_PAPEIS_POSSIVEIS':
    return {...estado, papeisPossiveis: acao.papeisPossiveis}
    
  default:
    throw new Error(`BUG: acao.type inválido : ${acao.type}`)
  }
  
}

function useModelo() {

  const [estado, dispatch] = useReducer(reducer, estadoInicial)

  return [estado, dispatch]
}

function App (): React$Element<'div'> {
  const [estado, dispatch] = useModelo()

  let tarefas
  let tamColunaLogin = ''

  if (estado.optIdTokenResult !== undefined) {
    tarefas =
      <div className='column'>
        <Tarefas idTokenResult={estado.optIdTokenResult} papeisPossiveis={estado.papeisPossiveis}/>
      </div>
    tamColunaLogin = 'is-one-third'
  }

  return (
    <div className='container is-fullhd'>
      <div className='box'>
        <BulmaMessage color='is-dark' title='UFSC - CTC - INE - INE5646 :: App Usuários'>
          <div className='columns'>
            <div className={`column ${tamColunaLogin}`}>
              <Login onPapeisPossiveis={(papeisPossiveis) => dispatch({type: 'REGISTRE_PAPEIS_POSSIVEIS', papeisPossiveis})}
                optIdTokenResult={estado.optIdTokenResult}
                onUserIn={(idTokenResult) => dispatch({type: 'REGISTRE_USUARIO_ENTROU', idTokenResult})}
                onUserOut={() => dispatch({type: 'REGISTRE_USUARIO_SAIU'})}/>
            </div>
            {tarefas}
          </div>
        </BulmaMessage>
      </div>
    </div>
  )
}

export default App
