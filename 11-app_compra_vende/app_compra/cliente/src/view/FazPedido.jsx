//@flow
import React, {useReducer, useEffect} from 'react'

import {enviaPedido} from '../servicos'
import {geraIdPedido, Produto, Pedido} from '../modelos'
import {TabelaProdutos} from './TabelaProdutos.jsx'


type Estado = {|
  pedido: Pedido,
  novoProduto: Produto,
  msg: void | string,
  enviando: boolean
|}

  type Acao =
      {| type: 'ARMAZENE_EMAIL', email: string |}
    | {| type: 'ARMAZENE_NOME_NOVO_PRODUTO', nome: string |}
    | {| type: 'ARMAZENE_QTD_NOVO_PRODUTO', qtdDigitada: string |}
    | {| type: 'ADICIONE_NOVO_PRODUTO' |}
    | {| type: 'EXCLUA_PRODUTO', nome: string |}
    | {| type: 'ENVIE_PEDIDO' |}
    | {| type: 'REGISTRE_PEDIDO_ENVIADO' |}
    | {| type: 'REGISTRE_ERRO_AO_ENVIAR_PEDIDO', msg: string |}

type Dispatch = Acao => void

type Modelo = [Estado, Dispatch]

    
const estadoInicial: Estado = {
  pedido: new Pedido(geraIdPedido(), '', []),
  novoProduto: new Produto('', 1),
  msg: undefined,
  enviando: false
}

function reducer(estado: Estado, acao: Acao): Estado {
  switch (acao.type) {
  case 'ARMAZENE_EMAIL': {
    estado.pedido.email = acao.email.trim()
    return {...estado, pedido: estado.pedido, msg: undefined}
  }

  case 'ARMAZENE_NOME_NOVO_PRODUTO': {
    const msg = estado.pedido.getProdutoPorNome(acao.nome) !== null
      ?  'Produto já adicinado!'
      : undefined

    estado.novoProduto.nome = acao.nome
    return {...estado, novoProduto: estado.novoProduto, msg}    
  }

  case 'ARMAZENE_QTD_NOVO_PRODUTO': {
    const qtd = parseInt(acao.qtdDigitada, 10)
    const msg = !isFinite(qtd) || qtd < 1 
      ? 'Quantidade deve ser número inteiro maior que zero!' 
      : undefined

    if (msg === undefined)
      estado.novoProduto.quantidade = qtd

    return {...estado, novoProduto: estado.novoProduto, msg}
  }

  case 'ADICIONE_NOVO_PRODUTO': {
    if (estado.novoProduto.nome === '')
      return {...estado, msg: 'Nome do produto em branco!'}

    if (estado.pedido.getProdutoPorNome(estado.novoProduto.nome) !== null)
      return {...estado, msg: 'Produto já adicinado!'}

    estado.pedido.adicioneProduto(estado.novoProduto) 
    return {
      ...estado, 
      pedido: estado.pedido, 
      novoProduto: new Produto('', 1), 
      msg: `Adicionou produto ${estado.novoProduto.nome}.`
    }
  }

  case 'EXCLUA_PRODUTO': {
    estado.pedido.removaProdutoPorNome(acao.nome)
    return {...estado, pedido: estado.pedido, msg: `Produto ${acao.nome} excluído.`}    
  }

  case 'ENVIE_PEDIDO': {
    let msg
    if (estado.pedido.id === '')
      msg = 'Id do pedido não definido'
    else {
      if (estado.pedido.email === '')
        msg = 'E-mail não definido'
      else 
      if (estado.pedido.produtos.length === 0)
        msg = 'Pedido precisa ter pelo menos um produto'
    }
    if (msg !== undefined)
      return {...estado, msg}
    else
      return {...estado, enviando: true, msg: 'Enviando pedido...'}
  }

  case 'REGISTRE_PEDIDO_ENVIADO': {
    const pedido = new Pedido(geraIdPedido(), '', [])
    const novoProduto = new Produto('', 1)
    pedido.email = estado.pedido.email

    return {...estadoInicial, pedido, novoProduto, msg: 'Pedido enviado!'}
  }

  case 'REGISTRE_ERRO_AO_ENVIAR_PEDIDO':
    return {...estado, msg: acao.msg, enviando: false}

  default:
    throw new Error(`BUD: acao.type não definido: ${acao.type}`)
  }
}

function useModelo(): Modelo {

  const [estado, dispatch] = useReducer(reducer, estadoInicial)

  useEffect(() => {
    if (estado.enviando) {
      enviaPedido(estado.pedido)
        .then(() => dispatch({type: 'REGISTRE_PEDIDO_ENVIADO'}))
        .catch(erro => dispatch({type: 'REGISTRE_ERRO_AO_ENVIAR_PEDIDO', msg: erro.message}))
    }

  }, [estado.enviando, estado.pedido])

  return [estado, dispatch]
}

function FazPedido(): React$Element<'div'> {
  const [estado, dispatch] = useModelo()
  

  return (
    <div className='card'>
      <div className='card-header'>
        <div className='card-header-title is-centered  has-background-grey-light'>
          Pedido - {estado.pedido.id}
        </div>
      </div>

      <div className='card-content'>
        <InputText 
          rotulo='E-mail' 
          valor={estado.pedido.email} 
          onChange={(ev) => dispatch({type: 'ARMAZENE_EMAIL', email: ev.target.value})}/>

        <div className='field'>
          <label className='label'>
            Produtos Adicionados
          </label>
          <div className='control'>
            <div className='card has-background-danger'>
              <div className='card-header'>
                <TabelaProdutos
                  produtos={estado.pedido.produtos}
                  onRemove={(nome) => dispatch({type: 'EXCLUA_PRODUTO', nome})}/>
              </div>
              <div className='card-content'>
                <InputText 
                  rotulo='Nome do Produto'
                  valor={estado.novoProduto.nome}
                  onChange={(ev) => dispatch({type: 'ARMAZENE_NOME_NOVO_PRODUTO', nome: ev.target.value})}
                />

                <div className='field'>
                  <label className='label'>Quantidade</label>
                  <div className='control'>
                    <input
                      className='input is-primary'
                      type='number'
                      min='1'
                      value={estado.novoProduto.quantidade}
                      onChange={(ev) => dispatch({type: 'ARMAZENE_QTD_NOVO_PRODUTO', qtdDigitada: ev.target.value})}/>
                  </div>
                </div>
                <div className='field'>
                  <div className='control'>
                    <button
                      disabled={estado.novoProduto.nome === ''}
                      className='button is-success'
                      onClick={() => dispatch({type: 'ADICIONE_NOVO_PRODUTO'})}>
                          Adicionar
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className='field'>
          <div className='control'>
            <button
              className='button is-success'
              disabled={!estado.pedido.estaPreenchido() || estado.enviando}
              onClick={() => dispatch({type: 'ENVIE_PEDIDO'})}>
                  Enviar Pedido
            </button>
          </div>
        </div>
       
        <div className='field'>
          <label className='label'>Msg</label>
          <div className='control'>
            {estado.msg}
          </div>
        </div>

      </div>
    </div>
  )
}

type PropsInputText = {| rotulo: string, valor: string, onChange: any => void|}
function InputText ({rotulo, valor, onChange}: PropsInputText) {
  return (
    <div className='field'>
      <label className='label'>
        {rotulo}
      </label>
      <div className='control'>
        <input
          className='input is-primary'
          type='text'
          value={valor}
          onChange={onChange}/>
      </div>
    </div>
  )
}

export default FazPedido
