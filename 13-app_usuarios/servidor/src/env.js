//@flow

import type {Firebase_Config, Firebase_AdminSDK} from './tipos_flow'

export const PORTA: number = parseInt(process.env.PORT || 3000, 10)
  
export const FIREBASE_CONFIG: Firebase_Config = {
  apiKey: process.env.FIREBASE_CONFIG_apiKey || '',
  authDomain: process.env.FIREBASE_CONFIG_authDomain || '',
  databaseURL: process.env.FIREBASE_CONFIG_databaseURL || '',
  projectId: process.env.FIREBASE_CONFIG_projectId || '',
  storageBucket: process.env.FIREBASE_CONFIG_storageBucket || '',
  messagingSenderId: process.env.FIREBASE_CONFIG_messagingSenderId || '',
  appId: process.env.FIREBASE_CONFIG_appId || ''
}

// O valor da variável de ambiente FIREBASE_ADMINSDK_private_key aparece no node como
// uma string que:
// 1) inicia e termina com o caracter '
// 2) todos os \n convertidos para \\n
// O caracter ' deve ser removido e os \\n substituídos por \n
const FIREBASE_ADMINSDK_private_key: string = (process.env.FIREBASE_ADMINSDK_private_key || '').replace(/\\n/g, '\n').replace(/'/g, '')

export const FIREBASE_ADMINSDK: Firebase_AdminSDK = {
  type: process.env.FIREBASE_ADMINSDK_type || '',
  project_id: process.env.FIREBASE_ADMINSDK_project_id || '',
  private_key_id: process.env.FIREBASE_ADMINSDK_private_key_id || '',
  private_key: FIREBASE_ADMINSDK_private_key || '',
  client_email: process.env.FIREBASE_ADMINSDK_client_email || '',
  client_id: process.env.FIREBASE_ADMINSDK_client_id || '',
  auth_uri: process.env.FIREBASE_ADMINSDK_auth_uri || '',
  token_uri: process.env.FIREBASE_ADMINSDK_token_uri || '',
  auth_provider_x509_cert_url: process.env.FIREBASE_ADMINSDK_auth_provider_x509_cert_url || '',
  client_x509_cert_url: process.env.FIREBASE_ADMINSDK_client_x509_cert_url || ''
}

export const LOCAL = process.env.LOCAL === 'sim'
