//@flow

import mongoose from 'mongoose'
import {MONGODB_LIVROS} from './env'

type Resposta = {
  json: ({} | null | []) => void
}

const livroSchema = new mongoose.Schema({
  titulo: String,
  autor: String,
  paginas: Number
})

const Livro = mongoose.model('Livro', livroSchema)

const CONFIG_MONGO = {
  keepAlive: 200, 
  useNewUrlParser: true, 
  useUnifiedTopology: true,
  retryWrites: false
}

function conecta (res: Resposta): void {
  mongoose.connect(MONGODB_LIVROS, CONFIG_MONGO).then(
    () => res.json({conectou: true}),
    () => res.json({conectou: false})
  )
}

function desconecta (res: Resposta): void {
  mongoose.disconnect().then(
    () => res.json({desconectou: true}),
    () => res.json({desconectou: false})
  )
}

function salva (res: Resposta, titulo: string, autor: string, paginas: number): void {
  const livro = new Livro({ titulo, autor, paginas })
  livro.save().then(
    (livroSalvo) => res.json({salvou: true, id: livroSalvo._id}),
    () => res.json({salvou: false})
  )
}

function pesquisaPorId (res: Resposta, id: string): void {
  Livro.findById(id).then(
    (livro) => res.json(livro),
    () => res.json(null)
  )
}

function pesquisaTodos (res: Resposta): void {
  Livro.find().then(
    (livros) => res.json(livros),
    () => res.json([])
  )
}

function pesquisaPorTitulo (res: Resposta, titulo: string): void {
  Livro.find().where('titulo', new RegExp(titulo)).then(
    (livros) => res.json(livros),
    () => res.json([])
  )
}

function apagaTudo (res: Resposta): void {
  Livro.remove().then(
    () => res.json({removeu: true}),
    () => res.json({removeu: false})
  )
}

// Obs: Sempre retorna true, mesmo quando id não existe
function apagaPorId (res: Resposta, id: string): void {
  Livro.deleteOne({_id: id}).then(
    () => res.json({removeu: true}),
    () => res.json({removeu: false})
  )
}
export {conecta, desconecta, salva,
  pesquisaPorId, pesquisaTodos, pesquisaPorTitulo, apagaTudo, apagaPorId}
