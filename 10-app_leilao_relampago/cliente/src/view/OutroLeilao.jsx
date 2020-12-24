//@flow
import React, {useState} from 'react'
import MostraLeilao from './util/MostraLeilao.jsx'
import Campo from './util/Campo.jsx'

import type {Leilao, Lance, Login} from '../model/tipos'

type Props = {|
    comprador: Login,
    leilao: Leilao,
    onSair: void => void,
    onEnviarLance: Lance => void,
    onAbandonarLeilao: void => void
|}
  
type EstadoLocalEmLeilao = number
  
  
export default function OutroLeilao(props: Props): React$Element<'div'> {
  const [valor, setValor] = useState<EstadoLocalEmLeilao>(0.0)
  
  function ofertaInvalida() {
    return valor < props.leilao.produto.precoMinimo || 
        (props.leilao.produto.melhorOferta !== null && valor <= props.leilao.produto.melhorOferta.valor)
  }
  
  function enviaOferta() {
    const lance: Lance = {
      comprador: props.comprador,
      vendedor: props.leilao.vendedor,
      valor
    }
    props.onEnviarLance(lance)
  }

  function alteraValor(sValor: string) {
    let v: number = valor
    try {
      if (sValor.trim().length > 0)
        v = parseFloat(sValor)
    } catch {
      //
    }
    setValor(v)
  }
  
  function podeAbandonar() {
    return props.leilao.produto.melhorOferta === null
  }

  let cor
  let cabecalho
  let controle
  
  if (props.leilao.aberto) {
    cor = 'message is-success'
    cabecalho = 'Participando de Leilão'
    controle = <span>
      <Campo 
        rotulo='Sua Oferta (R$)'
        tipo='number'
        dica='sua oferta' 
        valor={valor}
        onChange={valor => alteraValor(valor)}
      />
      <button className='button is-info' disabled={ofertaInvalida()} onClick={enviaOferta}>
          Enviar Oferta
      </button>
      <button className='button is-danger' disabled={!podeAbandonar()} onClick={props.onAbandonarLeilao}>
        Abandonar Leilão
      </button>
    </span>
  } else {
    cor = 'message is-danger'
    cabecalho = 'Leilão Encerrado'
    controle=<span>
      <button className='button' onClick={props.onSair}>
          Sair
      </button>
    </span>
  }
  let conteudo = <div className={cor}>
    <div className='message-header'>
      {cabecalho}
    </div>
    <div className='message-body'>
      <MostraLeilao leilao={props.leilao}/>
      {controle}
    </div>
  </div>
  
  return conteudo
}