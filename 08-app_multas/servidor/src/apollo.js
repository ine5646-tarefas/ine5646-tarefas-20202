//@flow

import {ApolloServer} from 'apollo-server-express'

import banco from './bancoMongoDB'

// O esquema GraphQL schema na forma de string
const typeDefs = `
  type Query {
    proprietarios: [Proprietario]!,
    proprietario(cpf: ID!): Proprietario,
    veiculo(placa: ID!): Veiculo,
    veiculoComProprietario(placa: ID!): VeiculoComProprietario,
    veiculosDoProprietario(cpf: ID!): [Veiculo],
    multasDoVeiculo(placa: ID!): [Multa],
    multaCompleta(id: ID!): MultaCompleta,
    multasDeProprietario(cpf: ID!): ProprietarioMultas
  }

  type Mutation {
    cadastraProprietario(cpf: ID!, nome: String!): Boolean!,
    cadastraProprietariosEmMassa(dados: [String]!): [String]!,
    cadastraVeiculo(cpf: ID!, placa: ID!, ano: Int!): CadastrouVeiculo!,
    cadastraVeiculosEmMassa(dados: [String]!): [String]!,
    cadastraMulta(placa: ID!, pontos: Int!): CadastrouMulta!,
    cadastraMultasEmMassa(dados: [String]!): [String]!
  }

  type Proprietario { cpf: ID!, nome: String! }
  type Veiculo { placa: ID!, ano: Int!, proprietario_cpf: ID!}
  type Multa { id: ID!, veiculo_placa: ID!, pontos: Int!}
  type MultaCompleta {id: ID!, pontos: Int!, placa: ID!, cpf: ID!, nome: String!}
  type ProprietarioMultas {proprietario: Proprietario, veiculos:[PlacaPontos]}
  type PlacaPontos {placa: String!, pontos: Int!}
  type CadastrouVeiculo {cadastrou: Boolean!, motivo: String}
  type CadastrouMulta {id: ID, motivo: String}
  type VeiculoComProprietario {veiculo: Veiculo!, proprietario: Proprietario!}
`

// Os resolvedores
const resolvers = {
  Query: {
    proprietarios: () => banco.proprietarios(),
    proprietario: (root, {cpf}) => banco.proprietario(cpf),
    veiculo: (root, {placa}) => banco.veiculo(placa),
    veiculoComProprietario: (root, {placa}) => banco.veiculoComProprietario(placa),
    veiculosDoProprietario: (root, {cpf}) => banco.veiculosDoProprietario(cpf),
    multasDoVeiculo: (root, {placa}) => banco.multasDoVeiculo(placa),
    multaCompleta: (root, {id}) => banco.multaCompleta(id),
    multasDeProprietario: (root, {cpf}) => banco.multasDeProprietario(cpf)
  },

  Mutation: {
    cadastraProprietario: (root, {cpf, nome}) =>
      banco.cadastreProprietario(cpf, nome),

    cadastraProprietariosEmMassa: (root, {dados}) =>
      banco.cadastreProprietariosEmMassa(dados),

    cadastraVeiculosEmMassa: (root, {dados}) =>
      banco.cadastreVeiculosEmMassa(dados),

    cadastraMultasEmMassa: (root, {dados}) =>
      banco.cadastreMultasEmMassa(dados),

    cadastraVeiculo: (root, {cpf, placa, ano}) =>
      banco.cadastreVeiculo(cpf, placa, ano),

    cadastraMulta: (root, {placa, pontos}) =>
      banco.cadastreMulta(placa, pontos)
  }
}

function configuraApolloServer(appExpress: any, server: any) {
  const apollo = new ApolloServer({typeDefs, resolvers, introspection: true, playground: true})
  apollo.applyMiddleware({app: appExpress})
  apollo.installSubscriptionHandlers(server)
}

export {configuraApolloServer}
