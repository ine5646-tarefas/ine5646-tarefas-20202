//@flow

export type PapelUsuario = 'professor' | 'aluno' | 'admin'

export type Usuario = {|
    email: string,
    papeis: Array<PapelUsuario>
|}

export type IdToken = string

export type IdTokenDecodificado = {|
  uid: string, 
  papeis: Array<string> 
|}

export type IdTokenResult = { token: string, claims: {papeis: Array<string>} }

export type UId = string

export type Evento = 
        {| ev: 'UsuarioCadastrado', email: string, papeis: [PapelUsuario], uid: UId |}
    |   {| ev: 'LoginRegistrado' , uid: UId |}
    |   {| ev: 'LogoutRegistrado',uid: UId |}

export type Comando = 
        {| type: 'RegistrarLogin', idToken: IdToken |}
    |   {| type: 'RegistrarLogout', idToken: IdToken |}
    |   {| type: 'CadastrarUsuario', idToken: IdToken, email: string, papeis: [PapelUsuario] |}

export type Consulta =
        {| type: 'PesquisaUsuarios', idToken: IdToken |}
    |   {| type: 'PesquisaConfig' |}

export type Firebase_Config = {|
  apiKey: string,
  authDomain: string,
  databaseURL: string,
  projectId: string,
  storageBucket: string,
  messagingSenderId: string,
  appId: string
|}

export type Firebase_AdminSDK = {|
  type: string,
  project_id: string,
  private_key_id: string,
  private_key: string,
  client_email: string,
  client_id: string,
  auth_uri: string,
  token_uri: string,
  auth_provider_x509_cert_url: string,
  client_x509_cert_url: string
|}

export type RespostaConsulta = 
    {| ok: true , firebaseConfig: Firebase_Config, papeisPossiveis: Array<PapelUsuario>|}
  | {| ok: false, msg: string |}
  | {| ok: true, usuarios: Array<Usuario> |}

export type RespostaComando =
    {| ok: true |}
  | {| ok: false, msg: string |}
