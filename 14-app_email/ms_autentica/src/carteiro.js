//@flow

import type {ServiceBroker} from 'moleculer'

import type {Email, RespostaDeuNaoDeu} from './tipos-flow'

export async function enviaEmail(broker: ServiceBroker, para: Email, assunto: string, texto: string): Promise<void> {
  return await broker.call('email.enviaEmail', {para, assunto, texto})
}

export async function validaEmail(broker: ServiceBroker, email: Email): Promise<RespostaDeuNaoDeu> {
  return await broker.call('email.validaEmail', {email})
}
