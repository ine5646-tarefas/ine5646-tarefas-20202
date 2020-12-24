
//@flow

export type FirebaseConfig = {|
    apiKey: string,
    authDomain: string,
    databaseURL: string,
    projectId: string,
    storageBucket: string,
    messageSenderId: string
|}


export type Firebase = {|
    auth: void => any
|}

export type Config = {| firebaseConfig: FirebaseConfig, papeisPossiveis: Array<string> |}

export type IdTokenResult = { token: string, claims: {papeis: Array<string>, email: string} }

export type CorBulma = 
        'is-white'
    |   'is-light'
    |   'is-text'
    |   'is-black'
    |   'is-dark'
    |   'is-primary'
    |   'is-link'
    |   'is-info'
    |   'is-success'
    |   'is-warning'
    |   'is-danger'



export type OpcaoCheckbox = {| label: string, value: string, checked: boolean |}