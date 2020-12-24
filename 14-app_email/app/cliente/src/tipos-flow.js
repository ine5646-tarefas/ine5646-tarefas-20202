//@flow

export opaque type Email = string

export function stringToEmail(email: string): Email { return email }
export function emailToString(email: Email): string { return email }
export function tamanhoEmail(email: Email): number { return email.trim().length}

export opaque type TokenJWT = string

export function stringToTokenJWT(token: string): TokenJWT {return token}

export opaque type TokenUUID = string

export type Configuracao = {|
    MAX_MSGS_LIDAS: number
|}

export type Mensagem = {|
  _id: string,
  quando: number,
  de: Email,
  para: Email,
  assunto: string,
  texto: string
|}

export type LeEmailsEnviados =
    {| ok: true, token: TokenJWT, emails: Array<Mensagem>|}
  | {| ok: false, motivo: string |}

export type RespostaObtemConfiguracao =
    {| ok: true, configuracao: {| MAX_MSGS_LIDAS: number |} |}
  | {| ok: false, motivo: string |}

export type RespostaRenovaToken =
    {| ok: false |}
  | {|ok: true, token: TokenJWT |}

export type RespostaRecuperaSenha = {| ok: true |} | {| ok: false, motivo: string |}

export type FazLogin =
    {| ok: true, token: TokenJWT |}
  | {| ok: false, motivo: string |}

export type RespostaDeuNaoDeu = {| ok: true |} | {| ok: false, motivo: string|}

export type PesquisaUsuario =
    {| ok: true, nome: string |}
  | {| ok: false, motivo: string |}

export type EnviaEmailDePara =
    {| ok: true, token: TokenJWT |}
  | {| ok: false, motivo: string |}
