//@flow

import type {PedidoJSON} from './modelos'

export type Comando = 
      '/CmdEnviePedidoProcessado' 
    | '/CmdBusquePedidos'

export type RespostaJSONPedidos =
  {| ok: false, message: string |}
  | {| ok: true, pedidos: Array<PedidoJSON>|}
