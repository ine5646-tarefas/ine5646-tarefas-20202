import React from 'react'
import PropTypes from 'prop-types'

const DetalhesFilme = (props) => {

  let conteudo

  if (props.filme === undefined) {
    conteudo = 
      <div className="notification is-warning">
        Nenhum filme selecionado.
      </div>
  } else {
    conteudo =
          <div className="message is-success">
            <div className="message-header">
              <p>Detalhes do Filme</p>
              <button className="delete" onClick={props.quandoFechado}></button>
            </div>
            <div className="message-body">
              <div className="panel">
                {MostraCampo('Título', props.filme.titulo)}
                {MostraCampo('Lançamento', props.filme.lancamento)}
                {MostraCampo('Direção', props.filme.direcao)}
              </div>
            </div>
          </div>
  }

  return (
    <div className="message is-info">
      <div className="message-header">
        <p>Filme</p>
      </div>
      <div className="message-body">
        <div className="box">
          {conteudo}
        </div>
      </div>
    </div>
  )
}

function MostraCampo (atributo, valor) {
  return (
    <div className="field">
      <label className="label">{atributo}</label>
      <div className="control">
        <p>{valor}</p>
      </div>
    </div>
  )
}

DetalhesFilme.propTypes = {
  quandoFechado: PropTypes.func.isRequired,
  filme: PropTypes.object
}

export {DetalhesFilme}
