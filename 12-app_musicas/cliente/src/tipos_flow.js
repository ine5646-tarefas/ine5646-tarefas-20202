//@flow

import {Artista} from './modelo/Artista'

export type RespostaPesquisa =
        {| ok: true, artistas: Array<Artista>, horario: Date |}
    |   {| ok: false, msgErro: string |}