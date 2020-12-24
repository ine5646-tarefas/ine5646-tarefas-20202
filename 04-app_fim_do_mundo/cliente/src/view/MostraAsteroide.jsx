import React from 'react'
import PropTypes from 'prop-types'
import { Asteroide } from '../model/modelos'

const MostraAsteroide = (props) => {
  let diametro = parseFloat(props.asteroide.diametro)
  let distancia = parseFloat(props.asteroide.distancia)
  diametro = parseFloat(diametro.toFixed(2)).toLocaleString('pt-BR')
  distancia = parseFloat(distancia.toFixed(2)).toLocaleString('pt-BR')

  const corAmeaca =
    props.asteroide.ehAmeaca
      ? 'card-header-title has-background-danger'
      : 'card-header-title has-background-success'

  return (
    <div className='card'>
      <div className='card-header'>
        <div className={corAmeaca}>
          Nome: {props.asteroide.nome}
        </div>
      </div>
      <div className='card-content'>
        <span className='is-size-5 has-text-weight-bold has-text-info'>
          Diâmetro :
        </span>
        <span className='is-size-4'>{diametro} m</span>
        <br/>
        <span className='is-size-5 has-text-weight-bold has-text-info'>
          Distância :
        </span>
        <span className='is-size-4'>{distancia} Km</span>
      </div>
    </div>
  )
}

MostraAsteroide.propTypes = {
  asteroide: PropTypes.instanceOf(Asteroide).isRequired
}

export default MostraAsteroide
