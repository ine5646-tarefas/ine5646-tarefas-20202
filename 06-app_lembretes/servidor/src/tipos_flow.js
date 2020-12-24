//@flow

export type Token = string

export type TokenDecodificado = {| login: string, iat: number, exp: number |}

export type Usuario = {| login: string, senha: string |}

export type Lembrete = {| login: string, texto: string |}
