//@flow
import * as admin from 'firebase-admin'

import {FIREBASE_CONFIG, FIREBASE_ADMINSDK} from './env'

import type {PapelUsuario, IdTokenDecodificado, Usuario} from './tipos_flow'

const serviceAccount = FIREBASE_ADMINSDK
export const firebaseConfig = FIREBASE_CONFIG

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: firebaseConfig.databaseURL
})

// idToken --> Promise[IdTokenDecodificado]
export async function validaIdToken (idToken: string): Promise<IdTokenDecodificado> {
  try {
    const tokenDecodificado: IdTokenDecodificado = await admin.auth().verifyIdToken(idToken, true)
    return tokenDecodificado
  } catch (erro) {
    throw new Error('idToken inválido')
  }
}

export async function obtemUsuarios (idTokenDecodificado: IdTokenDecodificado): Promise<Array<Usuario>> {
  if (idTokenDecodificado.papeis.includes('admin')) {
    const listUsersResult = await admin.auth().listUsers(500)
    const resposta = listUsersResult.users.map(u => {
      const papeis = u.customClaims === undefined ? [] : u.customClaims.papeis
      return {email: u.email, papeis}
    })
    return resposta
  }
  throw new Error('Usuário não tem permissão')
}

export async function cadastraUsuario (idTokenDecodificado: IdTokenDecodificado, 
  email: string, papeis: [PapelUsuario]): Promise<true> {
  if (idTokenDecodificado.papeis.includes('admin')) {
    const userRecord = await admin.auth().createUser({email})
    await admin.auth().setCustomUserClaims(userRecord.uid, {papeis})
    return true
  }
  throw new Error('Usuário não tem permissão')
}
