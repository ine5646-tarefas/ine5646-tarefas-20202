//@flow

export type Proprietario = {| cpf: string, nome: string |}

export type Veiculo = {| placa: string, ano: number |}

export type VeiculoComPontos = {| placa: string, pontos: number |}

export type ProprietarioVeiculos = {| proprietario: Proprietario, veiculos: Array<VeiculoComPontos> |}

export type Multa = {|
    id: string,
    pontos: number,
    placa: string,
    cpf: string,
    nome: string  
  |}

export type MultaSimplificada = {| id: string, pontos: number |}

export type VeiculoSimplificado = {| placa: string, ano: number |}

export type VeiculoComProprietario = {| veiculo: Veiculo, proprietario: Proprietario |}