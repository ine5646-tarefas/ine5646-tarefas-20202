//@flow

import React, {useReducer, useEffect} from 'react'
import BulmaInput from '../../ui/BulmaInput.jsx'
import BulmaCheckboxGroup from '../../ui/BulmaCheckboxGroup.jsx'
import BulmaMessage from '../../ui/BulmaMessage.jsx'
import BulmaNotification from '../../ui/BulmaNotification.jsx'
import BulmaButton from '../../ui/BulmaButton.jsx'

import {enviaComando} from '../../../model/servicos'
import {validaEmail} from '../../util'

type Estado = {|
  email: string,
  papeis: Array<string>,
  optMsg: string | void,
  cadastrando: boolean  
|}

type Acao =
    {| type: 'ARMAZENE_EMAIL', email: string |}
  | {| type: 'ADICIONE_PAPEL', papel: string |}
  | {| type: 'REMOVA_PAPEL', papel: string |}
  | {| type: 'CADASTRE_USUARIO' |}
  | {| type: 'REGISTRE_CADASTRO_CONCLUIDO', resposta: { ok: boolean, msg?: string } |}
  | {| type: 'REGISTRE_ERRO_AO_CADASTRAR', msg: string |}

type Dispatch = Acao => void

type Modelo = [Estado, Dispatch]


function reducer(estado: Estado, acao: Acao): Estado {
  switch (acao.type) {
  case 'ARMAZENE_EMAIL':
    return {...estado, email: acao.email, optMsg: undefined}

  case 'ADICIONE_PAPEL': {
    const novosPapeis = estado.papeis.map(papel => papel)
    novosPapeis.push(acao.papel)
    return {...estado, papeis: novosPapeis, optMsg: undefined}
  }

  case 'REMOVA_PAPEL': {
    const papelARemover = acao.papel
    const novosPapeis = estado.papeis.filter(papel => papel !== papelARemover)
    return {...estado, papeis: novosPapeis, optMsg: undefined}
  }

  case 'CADASTRE_USUARIO': 
    return estado.papeis.length > 0 
      ? {
        ...estado, 
        cadastrando: true, 
        optMsg: 'Cadastrando usuário...'}
      : estado

  case 'REGISTRE_CADASTRO_CONCLUIDO': 
    return acao.resposta.ok 
      ? {cadastrando: false, email: '', papeis: [], optMsg: 'Cadastro realizado!'}
      : {...estado, cadastrando: false, optMsg: acao.resposta.msg}

  case 'REGISTRE_ERRO_AO_CADASTRAR':
    return {...estado, cadastrando: false, optMsg: acao.msg}

  default:
    throw new Error(`BUG: acao.type inválido: ${acao.type}`)
  }
}

function useModelo(idToken: string): Modelo {

  const estadoInicial: Estado = {
    email: '',
    papeis: [],
    optMsg: undefined,
    cadastrando: false
  }

  const [estado, dispatch] = useReducer(reducer, estadoInicial)

  useEffect(() => {
    if (estado.cadastrando) {
      const dados = {
        idToken: idToken,
        email: estado.email,
        papeis: Array.from(estado.papeis)
      }
      enviaComando('CadastrarUsuario', dados)
        .then(resposta => dispatch({type: 'REGISTRE_CADASTRO_CONCLUIDO', resposta}))
        .catch (erro => dispatch({type: 'REGISTRE_ERRO_AO_CADASTRAR', msg: erro.message}))
    }
  })

  return [estado, dispatch]
}


type Props = {| 
  idToken: string, 
  papeisPossiveis: Array<string> 
|}

function CadastrarUsuario (props: Props): React$Element<'div'> {
  const [estado, dispatch] = useModelo(props.idToken)

  const opcoes = props.papeisPossiveis
    .map(papel => ({label: papel, value: papel, checked: estado.papeis.includes(papel)}))

  const notificacao = estado.optMsg === undefined
    ? null
    : <BulmaNotification color='is-warning' message={estado.optMsg}/>

  return (
    <div className='box'>
      <BulmaMessage color='is-info' title='Cadastrar novo usuário'>
        <BulmaInput 
          label='E-mail' 
          value={estado.email}
          isPassword={false} 
          onChange={(email) => dispatch({type: 'ARMAZENE_EMAIL', email})}/>

        <BulmaCheckboxGroup
          label='Papéis'
          options={opcoes}
          onSelect={(papel) => dispatch({type: 'ADICIONE_PAPEL', papel})}
          onUnselect={(papel) => dispatch({type: 'REMOVA_PAPEL', papel})}/>

        <BulmaButton
          color='is-info'
          label='Cadastrar'
          onClick={() => dispatch({type: 'CADASTRE_USUARIO'})}
          disabled={!validaEmail(estado.email) || estado.papeis.length === 0}/>

        {notificacao}
      </BulmaMessage>
    </div>
  )
}

export default CadastrarUsuario
