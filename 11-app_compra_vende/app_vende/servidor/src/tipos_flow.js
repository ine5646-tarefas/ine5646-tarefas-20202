//@flow

export type Comando = 
      '/CmdEnviePedidoProcessado' 
    | '/CmdBusquePedidos'

type Produto = {| 
    nome: string, 
    quantidade: number
|}

type ProdutoProcessado = {|
    produto: Produto,
    precoUnitario: number
|}

export type PedidoProcessado = {|
    id: string,
    email: string,
    produtosProcessados: Array<ProdutoProcessado>

|}
export type Pedido = {|
    id: string,
    email: string,
    produtos: Array<Produto>
|}

export type RespostaPedidos = {| 
    ok: true, 
    pedidos: Array<Pedido>
|}
