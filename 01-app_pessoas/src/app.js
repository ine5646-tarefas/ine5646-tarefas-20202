import http from 'http'
import https from 'https'
import fs from 'fs'
import path from 'path'

import {atendeRequisicao} from './controle'


const opcoesHTTPS = {
  key: fs.readFileSync(path.resolve(__dirname, '../cert/key.pem')),
  cert: fs.readFileSync(path.resolve(__dirname, '../cert/cert.pem'))
}
const PORTA = process.env.PORT || 3000
const LOCAL = process.env.LOCAL === 'sim'
const msgNoAr = `Servidor no ar escutando na porta ${PORTA}...`

const f = (req, res) => atendeRequisicao(res)

const servidor = LOCAL ? https.createServer(opcoesHTTPS, f) : http.createServer(f)

// eslint-disable-next-line no-console
servidor.listen(PORTA, () => console.log(msgNoAr))
