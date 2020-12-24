//@flow

export type Comando = 
      '/CmdEnviePedido' 
    | '/CmdBusquePedidosProcessados'

export type Solicitacao = {| email: string |}

type Produto = {| 
    nome: string, 
    quantidade: number
|}

type ProdutoProcessado = {|
    produto: Produto,
    precoUnitario: number
|}

export type Pedido = {|
    id: string,
    email: string,
    produtos: Array<Produto>
|}

export type PedidoProcessado = {|
    id: string,
    email: string,
    produtosProcessados: Array<ProdutoProcessado>

|}

export type RespostaPedidosProcessados = 
    {| ok: false, message: string |}
  | {| ok: true, pedidosProcessados: Array<PedidoProcessado>|}
