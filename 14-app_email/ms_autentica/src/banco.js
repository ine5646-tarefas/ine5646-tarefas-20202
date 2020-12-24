//@flow

import MongoClient from 'mongodb'
import {URL_BANCO} from './env'

import type {Email, TokenUUID, UsuarioDB, CamposAlteraveisUsuarioDB} from './tipos-flow'

let cliente
let db



const COL_USUARIOS: string = 'usuarios'

export async function leUsuario(email: Email): Promise<?UsuarioDB> {
  const col = db.collection(COL_USUARIOS)
  const usuario = col.findOne({email})

  if (usuario)
    return usuario
  else
    return null
}

export async function insereNovoUsuario(email: Email, nome: string, senha: string, token: TokenUUID): Promise<boolean> {
  const col = db.collection(COL_USUARIOS)
  const usuario: UsuarioDB = {email, nome, senha, confirmado: false, token}
  await col.insertOne(usuario)
  return true
}


export async function atualizaUsuario(email: Email, campos: CamposAlteraveisUsuarioDB): Promise<true> {
  const col = db.collection(COL_USUARIOS)
  await col.updateOne({email}, {$set: campos})
  return true
}

export async function leUsuarioComToken(token: TokenUUID): Promise<?UsuarioDB> {
  const col = db.collection(COL_USUARIOS)
  return col.findOne({token})
}

export async function removeUsuario(email: Email) {
  const col = db.collection(COL_USUARIOS)
  await col.deleteOne({email})
}


// estabelece conexão com o banco

const MONGO_CONF = {
  useNewUrlParser: true, 
  useUnifiedTopology: true,
  retryWrites: false
}

async function conecta() {
  try {
    cliente = await MongoClient.connect(URL_BANCO, MONGO_CONF)
    db = cliente.db()
    console.log('Conectou no banco...')
    process.on('SIGINT', () => {
      cliente.close()
      console.log('Desconectou do banco.')
      process.exit()
    })
  } catch (erro) {
    console.log('Erro ao conectar com o banco: ', erro.message)
    process.exit()
  }
}

conecta()
