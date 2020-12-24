import React, { useState, useEffect } from 'react'
import aFilmoteca from '../dados'
import {FilmesCadastrados} from './FilmesCadastrados.jsx'
import {DetalhesFilme} from './DetalhesFilme.jsx'


const estadoInicial = {
  filmoteca: undefined,
  titulos: undefined,
  idFilmeSelecinado: undefined
}

function IU () {
  const [estado, setEstado] = useState(estadoInicial)
  
  useEffect(() => {
    // filmoteca poderia vir do servidor
    setEstado({...estadoInicial, filmoteca: aFilmoteca, titulos: aFilmoteca.titulos})
  }, [])
  
  let filme

  if (estado.idFilmeSelecionado !== undefined) {
    filme = estado.filmoteca.retorneFilme(estado.idFilmeSelecionado)
  }

  return (
    <div className="container is-fluid">
      <div className="message">
        <div className="message-header">
          UFSC - CTC - INE - INE5646 :: App Filmes
        </div>
        <div className="message-body">
          <div className="columns">
            <div className="column is-three-fifths ">
              <FilmesCadastrados
                idFilmeSelecionado={estado.idFilmeSelecionado}
                titulos={estado.titulos}
                quandoSelecionado={idFilmeSelecionado => setEstado({...estado, idFilmeSelecionado})}/>
            </div>
            <div className="column">
              <DetalhesFilme
                filme={filme}
                quandoFechado={() => setEstado({...estado, idFilmeSelecionado: undefined})}/>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export {IU}
