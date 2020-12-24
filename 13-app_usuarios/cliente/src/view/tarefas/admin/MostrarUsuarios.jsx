//@flow

import React, {useState, useEffect} from 'react'
import BulmaMessage from '../../ui/BulmaMessage.jsx'
import BulmaNotification from '../../ui/BulmaNotification.jsx'
import BulmaTable from '../../ui/BulmaTable.jsx'

import {enviaConsulta} from '../../../model/servicos'

type Props = {| idToken: string |}

function MostrarUsuarios (props: Props): React$Element<'div'> {
  const [{optUsuarios, optMsg}, setEstado] = useState({optUsuarios: undefined, optMsg: undefined})

  useEffect(() => {
    enviaConsulta('PesquisaUsuarios', {idToken: props.idToken})
      .then (resposta => setEstado({optUsuarios: resposta.usuarios, optMsg: undefined}))
      .catch(erro => setEstado({optUsuarios: undefined, optMsg: erro.message}))
    
    setEstado({optUsuarios: undefined, optMsg: 'Pesquisando...'})

  }, [props.idToken])

  function mostraUsuarios(usuarios) {
    let num = 1
    const lu = usuarios.map(emailPapeis => [num++, emailPapeis.email, emailPapeis.papeis.join(', ')])
    return <div>
      <BulmaTable head={['No.', 'E-mail', 'Papéis']} data={lu}/>
    </div>
  }


  const osUsuarios = optUsuarios === undefined ? null : mostraUsuarios(optUsuarios)
  const notificacao = optMsg === undefined
    ? null
    : <BulmaNotification color='is-warning' message={optMsg}/>
  return (
    <div className='box'>
      <BulmaMessage color='is-info' title='Usuários Cadastrados'>
        {osUsuarios}
        {notificacao}
      </BulmaMessage>
    </div>
  )
}

export default MostrarUsuarios
