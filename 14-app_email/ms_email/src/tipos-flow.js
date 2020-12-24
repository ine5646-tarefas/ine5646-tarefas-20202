//@flow

export type Resposta = {| ok: true |} | {| ok: false, motivo: string|}

export opaque type Email = string

export function emailToString(email: Email): string { return email}