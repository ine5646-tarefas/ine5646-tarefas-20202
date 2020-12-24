//@flow

import { useRef, useEffect } from 'react'

export type TipoRef<A> = {|current: A | null |}

type AvisaToast = 
  {| 
  severity: 'error' | 'warn' | 'success',
  summary: string,
  detail: string
|} => void

export type MostraAviso = {| show: AvisaToast |}


type Avisa  = (titulo: string, msg: string) => void

type SetMsg = {|
  setMsgErro: Avisa,
  setMsgAviso: Avisa,
  setMsgSucesso: Avisa
|}

type HookToast = [TipoRef<MostraAviso>, SetMsg]

type Estado = {
  msgSucesso: string | void,
  msgAviso: string | void,
  msgErro: string | void
}

export function useToast(): HookToast {
  const toastEl = useRef<MostraAviso | null>(null)
  
  function setMsgErro(titulo: string, msg: string) {
    toastEl.current !== null && toastEl.current.show({
      severity: 'error',
      summary: titulo,
      detail: msg})
  }

  function setMsgAviso(titulo: string, msg: string) {
    toastEl.current !== null && toastEl.current.show({
      severity: 'warn',
      summary: titulo,
      detail: msg})
  }

  function setMsgSucesso(titulo: string, msg: string) {
    toastEl.current !== null && toastEl.current.show({
      severity: 'success',
      summary: titulo,
      detail: msg})
  }

  return [toastEl, {setMsgErro, setMsgAviso, setMsgSucesso}]
}

export function useMsgsToast(estado: Estado): TipoRef<MostraAviso> {
  const [toastEl, msgToast] = useToast()
  
  useEffect(() => {
    if (estado.msgAviso !== undefined) {
      msgToast.setMsgAviso('Aviso', estado.msgAviso)
    }
  }, [estado.msgAviso, msgToast])

  useEffect(() => {
    if (estado.msgErro !== undefined) {
      msgToast.setMsgErro('Erro', estado.msgErro)
    }
  }, [estado.msgErro, msgToast])

  useEffect(() => {
    if (estado.msgSucesso !== undefined) {
      msgToast.setMsgSucesso('Sucesso', estado.msgSucesso)
    }
  }, [estado.msgSucesso, msgToast])

  return toastEl
}
  