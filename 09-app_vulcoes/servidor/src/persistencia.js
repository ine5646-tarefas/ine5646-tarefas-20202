// @flow
import {BD_URL} from './env'
import MongoClient from 'mongodb'
import type {Vulcao, Usuario, ImagemEmBase64} from './tipos'

let client
let db

const COL_USUARIOS = 'usuarios'
const COL_VULCOES = 'vulcoes'


const CONFIG_MONGO = { 
  useNewUrlParser: true, 
  useUnifiedTopology: true,
  retryWrites: false
}

conectaComBanco()

function temConexaoComBanco(): {| ok: boolean |} {
  if (client === undefined)
    return {ok: false}
  else
    return {ok: true}
}

async function conectaComBanco() {
  try {
    client = await MongoClient.connect(BD_URL, CONFIG_MONGO)
    db = client.db()
    // eslint-disable-next-line no-console
    console.log('conectou com o banco...')
    process.on('SIGINT', () => {
      client.close()
      // eslint-disable-next-line no-console
      console.log('desconectou do banco...')
      process.exit()
    })
    return {ok: true}
  } catch (e) {
    // eslint-disable-next-line no-console
    console.log(e)
    // eslint-disable-next-line no-console
    console.log('não conseguiu conexão com o banco')
    return {ok: false, message: 'Sem conexão com o banco.'}
  }
}

async function leiaUsuario (login: string): Promise<Usuario | null> {
  const col = db.collection(COL_USUARIOS)
  const usuario = await col.findOne({ login })
  if (usuario) {
    return usuario
  } else {
    return null
  }
}

async function cadastreUsuario (login: string, senha: string): Promise<boolean> {
  const usuario = await leiaUsuario(login)
  if (usuario !== null) {
    return false
  } else {
    const col = db.collection(COL_USUARIOS)
    await col.insertOne({ login, senha })
    return true
  }
}

async function cadastreVulcao (login: string, vulcao: Vulcao): Promise<string> {
  const col = db.collection(COL_VULCOES)
  const resultado = await col.insertOne({ login, vulcao })
  return resultado.insertedId
}

async function leiaVulcoes (login: string): Promise<Array<Vulcao>> {
  const col = db.collection(COL_VULCOES)
  const resultado = await col.find({ login }).project({ 'vulcao.imagem': 0, 'login': 0 })
  const resultadoComoArray = await resultado.toArray()
  return resultadoComoArray
}

async function apagueVulcao (idVulcao: string): Promise<boolean> {
  const col = db.collection(COL_VULCOES)
  const r = await col.deleteOne({ _id: new MongoClient.ObjectId(idVulcao) })
  if (r.deletedCount === 0) {
    throw new Error('não conseguiu remover vulcão')
  }
  return true
}

async function leImagemDeVulcaoPorId (idVulcao: string): Promise<ImagemEmBase64> {
  const col = db.collection(COL_VULCOES)
  const resultado = await col.findOne(
    { _id: new MongoClient.ObjectId(idVulcao) },
    { projection: { 'vulcao.imagem': 1 } }
  )
  return resultado.vulcao.imagem
}

export {
  leiaUsuario, cadastreUsuario,
  cadastreVulcao, leiaVulcoes,
  apagueVulcao, leImagemDeVulcaoPorId, temConexaoComBanco }
