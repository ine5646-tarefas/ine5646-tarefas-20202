//@flow

import {EMAIL, EMAIL_PASSWORD, IPQUALITYSCORE_API_KEY} from './env'

import fetch from 'node-fetch'
import nodemailer from 'nodemailer'

import type {Email, Resposta} from './tipos-flow'
import {emailToString} from './tipos-flow'

const transport = nodemailer.createTransport({
  host: 'smtp.gmail.com',
  port: 465,
  secure: true,
  auth: {
    user: EMAIL,
    pass: EMAIL_PASSWORD
  }
})


export async function enviaEmail(para: Email, assunto: string, texto: string): Promise<Resposta> {
  try {
    await transport.sendMail({
      from: EMAIL,
      to: para,
      subject: assunto,
      text: texto
    })
    return {ok: true}
  }
  catch (erro) {
    return {ok: false, motivo: `Erro ao enviar e-mail: ${erro.message}`}
  }
}

export async function validaEmail(email: Email): Promise<Resposta> {
  
  const API_KEY: string = IPQUALITYSCORE_API_KEY
  const strEmail: string = emailToString(email)
  try {
    const r = await fetch(`https://www.ipqualityscore.com/api/json/email/${API_KEY}/${strEmail}`)
    const j = await r.json()
    if (j.success) {
      if (j.valid || (j.timed_out && j.dns_valid && !j.disposable) && !j.recent_abuse)
        return {ok: true}
      return {ok: false, motivo: 'E-mail inexistente'}
    } else {
      return {ok: false, motivo: 'Não conseguiu validar e-mail'}
    }
  } catch (erro) {
    return {ok: false, motivo: `Erro ao validar email: ${erro.message}`}
  }
}
