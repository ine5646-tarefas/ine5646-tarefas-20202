//@flow

import MongoClient from 'mongodb'

import {URL_BANCO} from './env'

import type {Email, EmailEnviado} from './tipos-flow'

let cliente
let db

const COL_MENSAGENS: string = 'mensagens'

export async function salvaCopiaDeEmail(de: Email, para: Email, assunto: string, texto: string): Promise<boolean> {
  const agora = Date.now()
  const col = db.collection(COL_MENSAGENS)
  const emailEnviado: EmailEnviado = {quando: agora, de, para, assunto, texto}
  await col.insertOne(emailEnviado)
  return true
}

export async function leTodosEmailsDe(de: Email, qtd: number): Promise<Array<EmailEnviado>> {
  const col = db.collection(COL_MENSAGENS)

  return await col.find({de}, {limit: qtd, sort: {quando: -1}}).toArray()
}

export async function removeMensagensDe(email: Email) {
  const col = db.collection(COL_MENSAGENS)
  await col.deleteMany({de: email})
}

const MONGO_CONF = {
  useNewUrlParser: true, 
  useUnifiedTopology: true,
  retryWrites: false
}

// estabelece conexão com o banco
async function conecta () {
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
