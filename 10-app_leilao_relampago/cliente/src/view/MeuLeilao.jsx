//@flow
import React, {useState, useEffect} from 'react'

import type {ProdutoVendido, Leilao} from '../model/tipos'
import type {SituacaoMeuLeilao} from '../model/useRedux'

import MostraLeilao from './util/MostraLeilao.jsx'
import Campo from './util/Campo.jsx'

type PropsMeuLeilao = {
    situacaoMeuLeilao: SituacaoMeuLeilao,
    onDefinirLeilao: void => void,
    onDesistirDeLeilao: void => void,
    onAbrirLeilao: (string, number) => void,
    onFecharLeilao: void => void,
    onRemoverLeilao: void => void,
}

type EstadoLocal = {|
  nomeProduto: string,
  precoMinimo: number
|}

const estadoInicial: EstadoLocal = {
  nomeProduto: '',
  precoMinimo: 0.0
}


export default function MeuLeilao(props: PropsMeuLeilao): React$Element<'div'> {
  const [estado, setEstado] = useState<EstadoLocal>(estadoInicial)

  useEffect(() => {
    if (props.situacaoMeuLeilao.sit === 'inicial' && (estado.nomeProduto.length > 0 || estado.precoMinimo > 0.0))
      setEstado(estadoInicial)
  }, [estado.nomeProduto.length, estado.precoMinimo, props.situacaoMeuLeilao.sit])

  let conteudo

  function atualizaNome(nomeProduto: string) {
    setEstado({...estado, nomeProduto})
  }

  function podeLeiloar() {
    return estado.nomeProduto.trim().length > 0 && estado.precoMinimo > 0.0
  }

  function atualizaPreco(precoMinimo: string) {
    let pm: number = estado.precoMinimo
    try {
      if (precoMinimo.trim().length > 0)
        pm = parseFloat(precoMinimo)
    } catch {
      //
    }
    setEstado({...estado, precoMinimo: pm})
  }

  function iniciaLeilao() {
    props.onAbrirLeilao(estado.nomeProduto, estado.precoMinimo)
  }
  
  
  switch (props.situacaoMeuLeilao.sit) {
  case 'inicial':
    conteudo = <button className='button' onClick={props.onDefinirLeilao}>Leiloar</button>
    break
  
  case 'definindo': {
    conteudo = <div>
      <Campo 
        rotulo='Produto' 
        dica='nome do produto' 
        tipo='text' 
        valor={estado.nomeProduto} 
        onChange={nomeProduto => atualizaNome(nomeProduto)}
      />
      <Campo
        rotulo='Preço Mínimo em R$'
        dica='preço mínimo'
        tipo='number'
        valor={estado.precoMinimo}
        onChange={precoMinimo => atualizaPreco(precoMinimo)}
      />
      <div className='field is-grouped'>
        <div className='control'>
          <button 
            className='button' 
            disabled={!podeLeiloar()}
            onClick={iniciaLeilao}>
              Abrir Leilão
          </button>
        </div>
        <div className='control'>
          <button className='button' onClick={props.onDesistirDeLeilao}>Cancelar</button>
        </div>
      </div>
    </div>
  }
    break

  case 'leiloando':
    conteudo = 
      <OLeilao 
        leilao={props.situacaoMeuLeilao.leilao} 
        onFechaLeilao={props.onFecharLeilao} 
      />
    break

  case 'final':
    conteudo = 
      <Resultado 
        produto={props.situacaoMeuLeilao.leilao.produto} 
        onInicio={props.onRemoverLeilao}
      />
    break
  default:
    break
  }

  return <div className='message is-info'>
    <div className='message-header'>
      Estou Leiloando
    </div>
    <div className='message-body'>
      {conteudo}
    </div>
  </div>
}

type OLeilaoProps = {|
  leilao: Leilao,
  onFechaLeilao: void => void,
|}

function OLeilao(props: OLeilaoProps) {
  return <div>
    <MostraLeilao leilao={props.leilao}/>
    <button className='button' onClick={props.onFechaLeilao}>Fechar Leilão</button>
  </div>
}

type ResultadoProps = {|
  produto: ProdutoVendido,
  onInicio: void => void
|}

function Resultado(props: ResultadoProps) {
  let conteudo

  if (props.produto.melhorOferta === null) {
    conteudo = <p>Não houve oferta para {props.produto.nome} por R${props.produto.precoMinimo}</p>
  } else {
    conteudo = <p>O produto {props.produto.nome} teve a melhor 
    oferta feita por {props.produto.melhorOferta.comprador} por R${props.produto.melhorOferta.valor}</p>
  }
  return <div>
    {conteudo}
    <button className='button' onClick={props.onInicio}>Concluir</button>
  </div>
}