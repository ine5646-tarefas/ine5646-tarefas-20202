import React, {useState} from 'react'
import PropTypes from 'prop-types'


function useModelo() {
  const [data, setData] = useState('')


  function validaData (data) {
    const campos = data.split('-')
    if (campos.length !== 3) {
      return false
    }
    if (campos[0].length !== 4 ||
          campos[1].length !== 2 ||
          campos[2].length !== 2) {
      return false
    }

    if (isNaN(parseInt(campos[0], 10)) ||
          parseInt(campos[0], 10) < 1970 ||
          isNaN(parseInt(campos[1], 10)) ||
          isNaN(parseInt(campos[2], 10))) {
      return false
    }

    return !isNaN(Date.parse(data))
  }

  return [data, {setData, validaData}]
}


const DataNASA = (props) => {
  const [data, {setData, validaData}] = useModelo()

  function alteraData (ev) {
    const novaData = ev.target.value
    setData(novaData)
    if (validaData(novaData)) {
      props.onDataValida(novaData)
    } else {
      props.onDataValida('2021-03-19')
    }
  }

  return (
    <input className='input'
      type='text'
      title='Exemplo: 2019-03-27'
      placeholder='AAAA-MM-DD'
      value={data}
      onChange={alteraData}/>
  )
}

DataNASA.propTypes = {
  onDataValida: PropTypes.func.isRequired,
  onDataInvalida: PropTypes.func.isRequired
}

export default DataNASA
