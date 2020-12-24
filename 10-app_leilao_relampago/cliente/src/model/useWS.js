//@flow
import {useState} from 'react'

export type WS = {|
  endereco: string,
  protocolo: string
|}

export type Comandos = {|
  conecta: string => boolean,
  fechaConexao: void => boolean,
  estaConectado: void => boolean,
  enviaMsg: string => boolean,
|}

export type EventoConexao = 'NADA' | 'CONECTOU' | 'ERRO' | 'FECHOU'
export type EventoMsg = void | string

export function useWS(ws: WS): [EventoConexao, EventoMsg, Comandos] {  
  const eventoConexaoInicial: EventoConexao = 'NADA'
  const [cliente, setCliente] = useState(undefined)
  const [eventoConexao, setEventoConexao] = useState<EventoConexao>(eventoConexaoInicial)
  const [eventoMsg, setEventoMsg] = useState<EventoMsg>(undefined)

  function enviaMsg(msg: string): boolean {
    let enviou: boolean = false
    if (cliente && estaConectado()){
      cliente.send(msg)
      enviou = true
    }
    return enviou
  }

  function fechaConexao(): boolean {
    let fechou = false
    if (cliente && estaConectado()) {
      cliente.close()
      fechou = true
    }
    return fechou
  }

  function estaConectado() {
    return cliente !== undefined && cliente !== null && cliente.readyState === WebSocket.OPEN
  }

  function conecta(login: string): boolean {
    let conectou: boolean = false
    if (!estaConectado()) {
      const cliente = new WebSocket(`${ws.endereco}?login=${login}`, ws.protocolo)
      cliente.onerror = (erro) =>  {console.error('erro', erro); setEventoConexao('ERRO')}
      cliente.onopen = () => setEventoConexao('CONECTOU')
      cliente.onclose = () => setEventoConexao('FECHOU')
      cliente.onmessage = (mensagem) => {
        typeof(mensagem.data) === 'string' && setEventoMsg(mensagem.data)
      }
      setCliente(cliente)
      conectou = true
    }
    return conectou
  }

  return [eventoConexao, eventoMsg, {conecta, enviaMsg, fechaConexao, estaConectado}]
}