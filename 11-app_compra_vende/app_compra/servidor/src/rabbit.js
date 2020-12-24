// @flow
import amqp from 'amqplib'
import { RABBITMQ_URL } from './env'
import type { Pedido, Solicitacao, RespostaPedidosProcessados } from './tipos_flow'

const FILA_DE_PEDIDOS = 'pedidos'

// Estabelece conexão com sevidor RabbitMQ hospedado em RABBITMQ_URL.
// A conexão fica ativa enquanto o servidor estiver no ar.
let conexao

amqp.connect(RABBITMQ_URL)
  .then(conn => {
    // eslint-disable-next-line no-console
    console.log('Conectado com servidor RabbitMQ')
    conexao = conn
    process.on('exit', () => {
      // eslint-disable-next-line no-console
      console.log('Aviso: Encerrando conexão com servidor RabbitMQ...')
      if (conexao) conexao.close()
    })

    // Ctl-C interrompe a execução do node
    process.on('SIGINT', () => {
      process.exit(1)
    })
  })
  .catch(() => {
    // eslint-disable-next-line no-console
    console.warn('Aviso: não conseguiu conexão com servidor RabbitMQ')
  })

export async function enviaPedido (pedido: Pedido): Promise<void> {
  return enviaMsgParaFila(RABBITMQ_URL, FILA_DE_PEDIDOS, JSON.stringify(pedido))
}

export async function obtemPedidosProcessados (solicitacao: Solicitacao): Promise<RespostaPedidosProcessados> {
  try {
    const pedidosProcessados = await obtemObjsDaFila(URL, solicitacao.email)
    return { ok: true, pedidosProcessados }
  } catch (erro) {
    return { ok: false, message: erro.message }
  }
}

async function enviaMsgParaFila (url, fila, msg) {
  if (conexao === undefined) throw new Error('Sem conexão com RabbitMQ')

  let ch
  try {
    ch = await conexao.createChannel()
    await ch.assertQueue(fila, { durable: false })
    ch.sendToQueue(fila, Buffer.from(msg))
  } finally {
    if (ch !== undefined) { await ch.close() }
  }
}

// retorna array de objetos que estão na fila
async function obtemObjsDaFila (url, fila) {
  if (conexao === undefined) throw new Error('Sem conexão com Rabbit')

  let ch
  try {
    let objetos = []
    const consomeMsg = (msg) => {
      const ob = JSON.parse(msg.content.toString('utf-8'))
      objetos.push(ob)
    }

    ch = await conexao.createChannel()
    await ch.assertQueue(fila, { durable: false })
    await ch.consume(fila, consomeMsg, { noAck: true })
    return objetos
  } finally {
    if (ch !== undefined) { await ch.close() }
  }
}
