import React from 'react'
import MostraAsteroide from './MostraAsteroide.jsx'
import PropTypes from 'prop-types'
import { Relatorio } from '../model/modelos'

const MostraRelatorio = (props) => {
  const r = props.relatorio
  let inofensivos
  let ameacas

  if (r.asteroidesInofensivos.length > 0) {
    inofensivos =
    <div className='box'>
      <ol>
        {r.asteroidesInofensivos.map(asteroide =>
          <li key={asteroide.nome}>
            <MostraAsteroide asteroide={asteroide}/>
          </li>
        )}
      </ol>
    </div>
  }
  if (r.asteroidesAmeacadores.length > 0) {
    ameacas =
    <div className= 'box'>
      <ol>
        {r.asteroidesAmeacadores.map(asteroide =>
          <li key={asteroide.nome}>
            <MostraAsteroide asteroide={asteroide}/>
          </li>
        )}
      </ol>
    </div>
  }
  return (
    <div className='card'>
      <h1 className='card-header'>
        <span className='card-header-title has-background-primary'>
          Relatório de Ameaças do Dia {r.data}
        </span>
      </h1>
      <div className='card-content'>
        <span className='is-size-5 has-text-weight-bold has-text-success'>
          Qtd Asteróides Inofensivos :
        </span>
        <span className='is-size-2 has-text-weight-bold'>
          {r.asteroidesInofensivos.length}
        </span>
        <br/>
        <span className='is-size-5 has-text-weight-bold has-text-danger'>
          Qtd Asteróides Que Ameaçam a vida na Terra :
        </span>
        <span className='is-size-2 has-text-weight-bold'>
          {r.asteroidesAmeacadores.length}
        </span>
      </div>
      {inofensivos}
      {ameacas}

    </div>
  )
}

MostraRelatorio.propTypes = {
  relatorio: PropTypes.instanceOf(Relatorio).isRequired
}

export default MostraRelatorio
