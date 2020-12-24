//@flow

export opaque type Email = string

export opaque type TokenUUID = string

export function tokenUUIDToString(token: TokenUUID): string {return token}
export opaque type TokenJWT = string

export type TokenJWTDecodificado = 
  {| email: Email, nome: string |}

export type FazLogin =
    {| ok: true, token: TokenJWT |}
  | {| ok: false, motivo: string |}

export type ConfirmaTokenRedefinicao = 
  {| ok: true, token: TokenUUID |}
| {| ok: false, motivo: string |}

export type EnviaEmailDePara =
    {| ok: true, token: TokenJWT |}
  | {| ok: false, motivo: string |}

export type PesquisaUsuario =
    {| ok: true, nome: string |}
  | {| ok: false, motivo: string |}

type Mensagem = {|
  _id: string,
  quando: number,
  de: string,
  para: string,
  assunto: string,
  texto: string
|}

export type LeEmailsEnviados =
    {| ok: true, token: TokenJWT, emails: Array<Mensagem>|}
  | {| ok: false, motivo: string |}

export type RespostaDeuNaoDeu = {| ok: true |} | {| ok: false, motivo: string|}
