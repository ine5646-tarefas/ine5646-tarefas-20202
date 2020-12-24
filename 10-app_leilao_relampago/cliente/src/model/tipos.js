//@flow

export type Login = string

export type Usuario = {| login: Login |}

export type Oferta = {|
  valor: number,
  comprador: Login
|}

export type ProdutoVendido = {
  nome: string,
  precoMinimo: number,
  melhorOferta: null | Oferta
}

export type Leilao = {|
  vendedor: Login,
  aberto: boolean,
  produto: ProdutoVendido,
  participantes: Array<Login>
|}

export type Produto = {|
  nome: string,
  precoMinimo: number
|}

export type Lance = {|
  comprador: Login,
  vendedor: Login,
  valor: number
|}

export type MensagemEnviada =
  {| type: 'ABRIR_LEILAO',  vendedor: Login, produto: Produto |}
| {| type: 'FECHAR_LEILAO', vendedor: Login |}
| {| type: 'REMOVER_LEILAO', vendedor: Login |}
| {| type: 'ENVIAR_LANCE', lance: Lance |}
| {| type: 'PARTICIPAR_DE_LEILAO', vendedor: Login |}
| {| type: 'ABANDONAR_LEILAO', vendedor: Login |}


export type MensagemRecebida =
  {| type: 'USUARIOS_ONLINE', usuarios: Array<Login> |}
| {| type: 'USUARIO_ENTROU', login: Login |}
| {| type: 'USUARIO_SAIU', login: Login |}
| {| type: 'LEILOES_ABERTOS', leiloes: Array<Leilao>|}
| {| type: 'LANCE_RECEBIDO', lance: Lance |}
| {| type: 'LEILAO_ABERTO', leilao: Leilao |}
| {| type: 'LEILAO_FECHADO', leilao: Leilao |}
| {| type: 'ENTROU_EM_LEILAO', leilao: Leilao |}
| {| type: 'NOVO_USUARIO_EM_LEILAO', vendedor: Login, comprador: Login |}
| {| type: 'LANCE_ACEITO', lance: Lance |}
| {| type: 'LEILAO_ABANDONADO', comprador: Login, vendedor: Login |}
