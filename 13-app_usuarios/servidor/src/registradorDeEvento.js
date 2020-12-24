//@flow

import type {Evento} from './tipos_flow'

export function registraEvento (evento: Evento) {
  // eslint-disable-next-line no-console
  console.log(`Registrando o evento ${JSON.stringify(evento)}`)
}
  