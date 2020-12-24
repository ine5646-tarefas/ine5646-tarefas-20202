//@flow
import React from 'react'

import 'bulma/css/bulma.min.css'

import useRedux from '../model/useRedux'
import Login from './Login.jsx'
import Usuarios from './Usuarios.jsx'
import MeuLeilao from './MeuLeilao.jsx'
import Leiloes from './Leiloes.jsx'

import type {Login as TipoLogin} from '../model/tipos'

export default function App (): React$Element<'div'> {
  const [estado, dispatch] = useRedux()
  const estaEmAlgumLeilao = estado.situacaoMeuLeilao.sit !== 'inicial' || 
    estado.optOutroLeilao !== undefined

  return (
    <div className='container is-fluid'>
      <div className='message'>
        <div className='message-header'>
          UFSC - CTC - INE - INE5646 :: App Leilão Relâmpago 
          <Sair 
            optLogin={estado.optUsuario} 
            emLeilao={estaEmAlgumLeilao} 
            onSair={() => dispatch({type: 'QUERO_SAIR_DO_SISTEMA'})}/>
        </div>
        <div className='message-body'>
          { estado.optUsuario === undefined &&
            <Login
              optMsg={estado.optMsgLogin}
              onPronto={(login: TipoLogin) => dispatch({type: 'QUERO_ENTRAR_NO_SISTEMA', login})}/>
          }
          {
            estado.optUsuario !== undefined && 
            <div className='columns'>
              <div className='column'>
                <MeuLeilao
                  situacaoMeuLeilao={estado.situacaoMeuLeilao} 
                  onDefinirLeilao={() => dispatch({type: 'QUERO_DEFINIR_MEU_LEILAO'})}
                  onDesistirDeLeilao={() => dispatch({type: 'QUERO_DESISTIR_DO_MEU_LEILAO'})}
                  onAbrirLeilao={(nomeProduto, precoMinimo) => dispatch({type: 'QUERO_ABRIR_MEU_LEILAO', nomeProduto, precoMinimo})}
                  onFecharLeilao={() => dispatch({type: 'QUERO_FECHAR_MEU_LEILAO'})}
                  onRemoverLeilao={() => dispatch({type: 'QUERO_REMOVER_MEU_LEILAO'})}
                />
              </div>

              <div className='column'>
                <Leiloes
                  comprador={estado.optUsuario}
                  onEnviarLance={(lance) => dispatch({type: 'QUERO_ENVIAR_LANCE', lance})}
                  onAbandonarLeilao={() => dispatch({type: 'QUERO_ABANDONAR_LEILAO'})}
                  optOutroLeilao={estado.optOutroLeilao}
                  leiloes={estado.leiloes}
                  onParticiparDeLeilao={vendedor => dispatch({type: 'QUERO_PARTICIPAR_DE_LEILAO', vendedor})}
                  onSairDeLeilao={() => dispatch({type: 'QUERO_SAIR_DE_OUTRO_LEILAO'})}
                />
              </div>
                            
              <div className='column is-one-fifth'>
                <Usuarios usuarios={estado.usuarios}/>
              </div>
            </div>
          }
        </div>
      </div>
    </div>
  )  
}

type PropsSair = {| 
  optLogin: ?TipoLogin, 
  emLeilao: boolean, 
  onSair: () => void 
|}

function Sair(props: PropsSair) {
  const nomeUsuario = props.optLogin != null ? props.optLogin : undefined
  const botaoSair =  nomeUsuario === undefined ? undefined :
    <button 
      className='button is-link' 
      disabled={props.emLeilao}
      onClick={props.onSair}>
      Sair
    </button>
  return <span>{nomeUsuario} {botaoSair}</span>
}
