//@flow

import type {PedidoProcessadoJSON} from './modelos'

export type Comando = 
      '/CmdEnviePedido' 
    | '/CmdBusquePedidosProcessados'

export type Solicitacao = {| email: string |}

export type RespostaJSONPedidosProcessados =
  {| ok: false, message: string |}
  | {| ok: true, pedidosProcessados: Array<PedidoProcessadoJSON>|}
