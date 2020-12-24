//@flow
/* eslint-disable no-console */
/*
  Script que cria usuário com papel de administrador.
*/

import * as admin from 'firebase-admin'
import {FIREBASE_CONFIG, FIREBASE_ADMINSDK} from '../env'

const serviceAccount = FIREBASE_ADMINSDK
export const firebaseConfig = FIREBASE_CONFIG

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: firebaseConfig.databaseURL
})

const adminEmail = process.argv[2]

if (adminEmail === undefined) {
  console.warn('Passar como argumento o e-mail do administrador')
} else {
  admin.auth().getUserByEmail(adminEmail)
    .then(usuario => {
      const claimsAtuais = usuario.customClaims === undefined ? {} : usuario.customClaims
      for (const c in claimsAtuais) {
        console.log(`${c} : ${claimsAtuais[c]}`)
      }

      if (claimsAtuais.papeis === undefined) {
        claimsAtuais['papeis'] = ['admin']
      } else {
        if (!claimsAtuais.papeis.includes('admin')) {
          claimsAtuais['papeis'].push('admin')
        }
      }
      return admin.auth().setCustomUserClaims(usuario.uid, claimsAtuais)
    })
    .then(() => {
      console.log(`Usuário ${adminEmail} agora é administrador.`)
      process.exit(0)
    })
    .catch(erro => {
      console.log('erro:',erro.message)
      process.exit(1)
    })
}
