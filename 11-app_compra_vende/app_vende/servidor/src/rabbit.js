//@flow

import amqp from 'amqplib'
import { RABBITMQ_URL } from './env'
import type { PedidoProcessado, RespostaPedidos} from './tipos_flow'

const FILA_DE_PEDIDOS = 'pedidos'

// Estabelece conexão com sevidor Rabbit hospedado em URL.
// A conexão fica ativa enquanto o servidor estiver no ar.
let conexao

amqp.connect(RABBITMQ_URL)
  .then(conn => {
    // eslint-disable-next-line no-console
    console.log('Conectou com servidor RabitMQ.')
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

export async function enviaPedidoProcessado (pedidoProcessado: PedidoProcessado): Promise<void> {
  return enviaMsgParaFila(RABBITMQ_URL, pedidoProcessado.email, JSON.stringify(pedidoProcessado))
}

export async function obtemPedidos (): Promise<RespostaPedidos> {
  return obtemObjsDaFila(RABBITMQ_URL, FILA_DE_PEDIDOS).then(arrayDePedidos => {
    return { ok: true, pedidos: arrayDePedidos }
  })
}

async function enviaMsgParaFila (url, fila, msg) {
  if (conexao === undefined) throw new Error('Sem conexão com RabbitMQ')

  let ch
  try {
    ch = await conexao.createChannel()
    await ch.assertQueue(fila, { durable: false })
    ch.sendToQueue(fila, Buffer.from(msg))
  } catch (erro) {
    // eslint-disable-next-line no-console
    console.log(erro.message)
    throw erro
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
