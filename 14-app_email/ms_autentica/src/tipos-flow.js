//@flow

export opaque type Email = string

export function emailToString(email: Email): string { return email}

export opaque type TokenJWT = string

export opaque type TokenUUID = string

export function tokenUUIDoString(token: TokenUUID): string { return token }

export function stringToTokenUUID(token: string): TokenUUID { return token }

export type TokenJWTDecodificado = {|
    email: Email,
    nome: string,
    iat: number, 
    exp: number
  |}

export type RespostaRenovaToken = TokenJWT | null

export type RespostaFazLogin =
    {| ok: true, token: TokenJWT |}
  | {| ok: false, motivo: string |}

export type RespostaConfirmaTokenRedefinicao = 
    {| ok: true, token: TokenUUID |}
  | {| ok: false, motivo: string |} 

export type RespostaPesquisaUsuario =
  {| ok: true, nome: string |}
| {| ok: false, motivo: string |}

export type RespostaDeuNaoDeu = 
    {| ok: true |}
  | {| ok: false, motivo: string |}

export type UsuarioDB = {|
    email: Email,
    nome: string,
    senha: string,
    confirmado: boolean,
    token: TokenUUID | void,
  |}
  
export type CamposAlteraveisUsuarioDB = {|
    nome?: string,
    senha?: string,
    confirmado?: boolean,
    token?: TokenUUID | void,
  |}
  