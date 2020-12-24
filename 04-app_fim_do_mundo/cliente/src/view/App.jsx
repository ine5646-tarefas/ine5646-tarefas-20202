import React, { useState, useEffect } from 'react'

import pesquisa from '../model/pesquisa'
import MostraRelatorio from './MostraRelatorio.jsx'
import DataNASA from './DataNASA.jsx'

const estadoInicial = {
  data: undefined,
  relatorio: undefined,
  msgErro: undefined,
  pesquisando: false,
  nasaApiKey: undefined
}

function useModelo() {

  const [estado, setEstado] = useState(estadoInicial)

  function naoPodePesquisar () {
    return estado.pesquisando === true || estado.data === undefined 
      || estado.nasaApiKey === undefined || estado.relatorio !== undefined
  }

  function onDataInvalida () {
    setEstado({...estadoInicial, nasaApiKey: estado.nasaApiKey})
  }

  function onDataValida (novaData) {
    setEstado({...estado, data: novaData, relatorio: undefined, pesquisando: false})
  }

  function onPesquisando() {
    setEstado({...estado, relatorio: undefined, pesquisando: true})
  }


  useEffect(() => { 
    function deuErro(erro) {
      setEstado({...estadoInicial, nomeBotao: erro.message, pesquisando: false})
    }

    window.fetch('/chave')
      .then(resposta => resposta.json())
      .then(nasaApiKey => setEstado({...estadoInicial, nasaApiKey}))
      .catch(erro => deuErro(erro))
  }, [])

  useEffect(() => {
    function onRelatorio (relatorio) {
      setEstado(estado => ({...estado, relatorio, nomeBotao: 'Pesquisar asteróides', pesquisando: false}))
    }
  
    function onErro(erro) {
      setEstado(estado => ({...estado, nomeBotao: erro.message, pesquisando: false}))
    }
  
    if (estado.pesquisando) {
      pesquisa(estado.nasaApiKey, estado.data)
        .then(relatorio => onRelatorio(relatorio))
        .catch(erro => onErro(erro))
    }
  }, [estado.data, estado.nasaApiKey, estado.pesquisando])

  return [ estado,  {onDataInvalida, onDataValida, onPesquisando, naoPodePesquisar} ]
}


export default function App () {
  const [ estado,  {onDataValida, onDataInvalida, onPesquisando, naoPodePesquisar} ] = useModelo()

  function defineNomeECSSBotao(estado) {
    let nomeBotao = 'Pesquisar asteróides'
    let cssBotao = 'button is-danger'
  
    if (estado.msgErro !== undefined) {
      nomeBotao = estado.msgErro
      cssBotao = 'button is-black'
    }
    else {
      if (estado.relatorio !== undefined) {
        cssBotao = 'button is-success'
      } else {
        if (estado.pesquisando) {
          nomeBotao = 'Pesquisando...'
          cssBotao = 'button is-warning is-loading'
        }
        else {
          if (estado.data !== undefined) {
            cssBotao = 'button is-success'
          }
        }
      }
    }
    return [nomeBotao, cssBotao]

  }
  const [nomeBotao, cssBotao] = defineNomeECSSBotao(estado)

  const oRelatorio = estado.relatorio !== undefined ? 
    <MostraRelatorio relatorio={estado.relatorio} /> : undefined


  return (
    <div className='container is-fluid'>
      <div className='message'>
        <div className='message-header'>
            UFSC - CTC - INE - INE5646 :: App Fim do Mundo
        </div>
        <div className='message-body'>
          <DataNASA onDataValida={onDataValida} onDataInvalida={onDataInvalida}/>
          <button className={cssBotao}
            onClick={onPesquisando}
            disabled={naoPodePesquisar()}>
            {nomeBotao}
          </button>
          {oRelatorio}
        </div>
      </div>
    </div>
  )  
}
