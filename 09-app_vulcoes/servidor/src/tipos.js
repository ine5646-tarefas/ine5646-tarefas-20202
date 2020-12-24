// @flow
export type ImagemEmBase64 = string

export type Vulcao = {|
  nome: string,
  pais: string,
  imagem: ImagemEmBase64,
  miniatura: ImagemEmBase64
|}

export type Token = string

export type TokenDecodificado = {|
  exp: number,
  iat: number,
  login: string
|}

export type Usuario = {|
  login: string,
  senha: string
|}
//Obs: Deve ser igual ao definido no lado cliente
export type Consulta =
    '/qryTemConexaoComBanco'
  | '/qryLeiaLimiteImagem'
  | '/qryLeiaVulcoes'
  | '/qryLeiaImagemVulcao'


//Obs: Deve ser igual ao definido no lado cliente
export type Comando =
    '/cmdFacaCadastro'
  | '/cmdFacaLogin'
  | '/cmdCadastreVulcao'
  | '/cmdApagueVulcao'
