//@flow

export opaque type Email = string

export function emailToString(email: Email): string {return email}

export opaque type TokenJWT = string

export type TokenJWTDecodificado = {| 
  email: Email, 
  nome: string,
  iat: number,
  exp: number
|}
export type EmailEnviado = 
  {| quando: number, de: Email, para: Email, assunto: string, texto: string |}

export type RespostaEnviaEmailDePara =
    {| ok: true, token: TokenJWT |}
  | {| ok: false, motivo: string |}

export type RespostaLeEmailsEnviados =
    {| ok: true, emails: Array<EmailEnviado>, token: TokenJWT |}
  | {| ok: false, motivo: string |}