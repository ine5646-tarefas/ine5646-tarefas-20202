import React from 'react'
import PropTypes from 'prop-types'

const BotaoDetalhes = (props) =>  {

  let conteudo =
      <button
        className='button is-small is-rounded is-primary'
        onClick={() => props.quandoClicado(props.id)}>
        Detalhes
      </button>

  return conteudo
}

BotaoDetalhes.propTypes = {
  quandoClicado: PropTypes.func.isRequired,
  id: PropTypes.number.isRequired
}

export {BotaoDetalhes}
