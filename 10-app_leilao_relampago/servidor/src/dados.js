//@flow

import type {Login, Leilao, Produto, Lance} from './tipos'

import type WebSocket from 'ws'

type Usuario = {|
  optLeilao: null | Leilao,
  cliente: WebSocket
|}

const usuarios: Map<Login, Usuario> = new Map()

export function entraEmLeilao(comprador: Login, vendedor: Login): null | Leilao {
  const usuario = usuarios.get(vendedor)
  let leilao = usuario === undefined ? null : usuario.optLeilao
  if (leilao != null)
    leilao.participantes = [...leilao.participantes, comprador]
  return leilao
}

export function podeAdicionarUsuario(login: Login): Login | null {
  const soPalavras = /\W/
  
  if (login.trim().length > 10 || login.trim().length === 0 || soPalavras.test(login.trim()) || 
      usuarios.has(login))
    return null

  return login.trim()
}

export function adicionaUsuario(login: Login, cliente: WebSocket): void {
  usuarios.set(login, {optLeilao: null, cliente})
}

export function removeUsuario(login: Login): boolean {
  let resposta = true
  let usuario: void | Usuario = usuarios.get(login)
  if (usuario !== undefined && usuario.optLeilao !== null)
    resposta = false // usuário possui um leilao não removido
  else
    usuarios.delete(login)
  return resposta
}

export function retornaLoginDeUsuarios(): Array<Login> {
  return Array.from(usuarios.keys())
}

export function retornaLeiloesAbertos(): Array<Leilao> {
  const leiloesAbertos: Array<Leilao> = []
  usuarios.forEach(u => {
    if (u.optLeilao !== null && u.optLeilao.aberto)
      leiloesAbertos.push(u.optLeilao)
  })

  return leiloesAbertos
}

export function adicionaLeilao(login: Login, produto: Produto): null | Leilao {
  const usuario = usuarios.get(login)

  if (usuario === undefined || usuario.optLeilao !== null)
    return null

  const leilao: Leilao = {
    vendedor: login,
    aberto: true,
    produto: {
      nome: produto.nome,
      precoMinimo: produto.precoMinimo,
      melhorOferta: null
    },
    participantes: []
  }

  usuario.optLeilao = leilao
  return leilao
}

export function removeLeilao(login: Login): boolean {
  const usuario = usuarios.get(login)

  if (usuario === undefined || usuario.optLeilao === null)
    return false
  usuario.optLeilao = null
  return true
}

export function fechaLeilao(login: Login): null | Leilao {
  const usuario: Usuario | void = usuarios.get(login)

  if (usuario === undefined || usuario.optLeilao === null)
    return null

  const leilao = usuario.optLeilao
  leilao.aberto = false
  return leilao
}

export function processaLance(lance: Lance): null | Set<WebSocket> {
  let usuario = usuarios.get(lance.vendedor)

  if (usuario === undefined || usuario.optLeilao === null || !usuario.optLeilao.aberto)
    return null

  const leilao: Leilao = usuario.optLeilao
  if (leilao.participantes.indexOf(lance.comprador) === -1)
    return null

  let clientes: Set<WebSocket> = new Set()
  if ((leilao.produto.melhorOferta === null && lance.valor >= leilao.produto.precoMinimo)
     || (leilao.produto.melhorOferta !== null && lance.valor > leilao.produto.melhorOferta.valor)) {
    leilao.produto.melhorOferta = {valor: lance.valor, comprador: lance.comprador}
    let participantes = [...leilao.participantes, lance.vendedor]
    participantes.forEach(login => {
      usuario = usuarios.get(login)
      usuario !== undefined && clientes.add(usuario.cliente)
    })
  }
  if (clientes.size === 0)
    return null
    
  return clientes
}

export function abandonaLeilao(comprador: Login, vendedor: Login): null | Set<WebSocket> {
  let optUsuario = usuarios.get(vendedor)

  if (optUsuario !== undefined && optUsuario.optLeilao !== null && 
    optUsuario.optLeilao.participantes.indexOf(comprador) !== -1) {
    const l: Leilao = optUsuario.optLeilao
    l.participantes = l.participantes.filter(p => p !== comprador)
    const clientesAfetados = new Set<WebSocket>().add(optUsuario.cliente)
    l.participantes.forEach(login => {
      optUsuario = usuarios.get(login)
      optUsuario !== undefined && clientesAfetados.add(optUsuario.cliente)
    })
    return clientesAfetados
  }
  return null
}
