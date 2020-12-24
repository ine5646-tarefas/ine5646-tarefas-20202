//@flow

/**
  Este arquivo define o modelo de dados existente no domínio da aplicação.
*/

import {v4 as uuidv4} from 'uuid'

type ProdutoJSON = {|nome: string, quantidade: number|}
type ProdutoProcessadoJSON = {| produto: ProdutoJSON, precoUnitario: number |}
type PedidoJSON = {|id: string, email: string, produtos: Array<ProdutoJSON>|}
export type PedidoProcessadoJSON = {| id: string, email: string, produtosProcessados: Array<ProdutoProcessadoJSON>|}

class Produto {
  nome: string
  quantidade: number

  static fromJSON(p: ProdutoJSON): Produto {
    return new Produto(p.nome, p.quantidade)
  }
  
  constructor(nome: string, quantidade: number) {
    this.nome = nome
    this.quantidade = quantidade
  }
}
  

class ProdutoProcessado {
  produto: Produto
  precoUnitario: number

  static fromJSON(pp: ProdutoProcessadoJSON): ProdutoProcessado {
    return new ProdutoProcessado(Produto.fromJSON(pp.produto), pp.precoUnitario)
  }
  
  static fromProduto(produto: Produto): ProdutoProcessado {
    return new ProdutoProcessado(produto, 0.0)
  }
  
  constructor(produto: Produto, precoUnitario: number) {
    this.produto = produto
    this.precoUnitario = precoUnitario
  }
  
  custo(): number {
    let custo = this.produto.quantidade * this.precoUnitario
    let custoTruncado = custo.toFixed(2) // trunca arredondando em 2 casas decimais
    return parseFloat(custoTruncado)
  }
}
  

class Pedido {
  id: string
  email: string
  produtos: Array<Produto>

  static fromJSON(pedido: PedidoJSON): Pedido {
    const produtos = pedido.produtos.map(produto => Produto.fromJSON(produto))
    return new Pedido(pedido.id, pedido.email, produtos)
  }
  
  constructor(id: string, email: string, produtos: Array<Produto>) {
    this.id = id
    this.email = email
    this.produtos = produtos
  }
  
  adicioneProduto(novoProduto: Produto): boolean {
    const prodExistente =
        this.produtos.find(prod => prod.nome === novoProduto.nome)
    if (prodExistente !== undefined) return false
    this.produtos = this.produtos.concat(novoProduto)
    return true
  }
  
  getProdutoPorNome(nome: string): null | Produto {
    const produto = this.produtos.find(prod => prod.nome === nome)
    return produto === undefined ? null : produto
  }
  
  removaProdutoPorNome(nome: string) {
    this.produtos =
        this.produtos.filter(prod => prod.nome !== nome)
  }

  estaPreenchido(): boolean {
    return this.id !== '' && this.email !== '' && this.produtos.length > 0
  }
}
  
  
class PedidoProcessado {
  id: string
  email: string
  produtosProcessados: Array<ProdutoProcessado>

  static fromJSON(pedidoProcessado: PedidoProcessadoJSON): PedidoProcessado {
    const produtosProcessados = pedidoProcessado
      .produtosProcessados
      .map(prodProcessado => ProdutoProcessado.fromJSON(prodProcessado))
    return new PedidoProcessado(pedidoProcessado.id, pedidoProcessado.email, produtosProcessados)
  }
  
  static fromPedido(pedido: Pedido): PedidoProcessado {
    const produtosProcessados =
        pedido.produtos.map(prod => ProdutoProcessado.fromProduto(prod))
    return new PedidoProcessado(pedido.id, pedido.email, produtosProcessados)
  }
  
  
  constructor(id: string, email: string, produtosProcessados: Array<ProdutoProcessado>) {
    this.id = id
    this.email = email
    this.produtosProcessados = produtosProcessados
  }
  
  adicioneProdutoProcessado(novoProdutoProcessado: ProdutoProcessado): boolean {
    const ppExistente =
        this.produtosProcessados
          .find(prodProc =>
            prodProc.produto.nome === novoProdutoProcessado.produto.nome)
  
    if (ppExistente !== undefined) return false
    this.produtosProcessados = this.produtosProcessados.concat(novoProdutoProcessado)
    return true
  }
  
  getProdutoProcessadoPorNome(nome: string): null | ProdutoProcessado {
    const pp = this.produtosProcessados.find(pp => pp.produto.nome === nome)
    return pp === undefined ? null : pp
  }
  
  custo(): number {
    const custo = this.produtosProcessados
      .reduce((somaAtual, produtoProcessado) =>
        somaAtual + produtoProcessado.custo(), 0)
    const custoTruncado = custo.toFixed(2)
    return parseFloat(custoTruncado)
  }
}

function geraIdPedido(): string {
  return uuidv4().substring(0,8)
}  

export { geraIdPedido, Produto, Pedido, ProdutoProcessado, PedidoProcessado }
  