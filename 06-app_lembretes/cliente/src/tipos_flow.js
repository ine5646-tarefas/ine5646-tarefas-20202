//@flow

export type Token = string

export type TokenDecodificado = {| login: string, iat: number, exp: number |}

export type Lembrete = {|
    _id: string,
    texto: string
|}