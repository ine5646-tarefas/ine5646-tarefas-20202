// @flow

export type ImagemEmBase64 = string

export type ImagemEmURL = string

export type IdVulcao = string

export type ConectadoComBanco = boolean | void

export type Token = string

export type TokenDecodificado = {|
  exp: number,
  iat: number,
  login: string
|}


export type VulcaoParaCadastro = {|
  nome: string,
  pais: string,
  imagem: ImagemEmBase64,
  miniatura: ImagemEmBase64
|}

export type Vulcao = {|
  nome: string,
  pais: string,
  miniatura: ImagemEmBase64
|}


export type VulcaoMongo = {|
  _id: IdVulcao,
  vulcao: Vulcao
|}

// deve ser igual ao definido no lado servidor
export type Consulta =
    '/qryTemConexaoComBanco'
  | '/qryLeiaLimiteImagem'
  | '/qryLeiaVulcoes'
  | '/qryLeiaImagemVulcao'

// deve ser igual ao definido no lado servidor
export type Comando =
    '/cmdFacaCadastro'
  | '/cmdFacaLogin'
  | '/cmdCadastreVulcao'
  | '/cmdApagueVulcao'
