//@flow
// verifica se email pode ser um email

export function validaEmail(email: string): boolean {
  return !(email === null || email === undefined || email.length === 0 ||
    email.includes(' ') || !email.includes('@') ||
    email.indexOf('@') === 0 || email.indexOf('@') === email.length - 1)

}

export function msgErroSignInWithEmailAndPassword (codigo: string): string {
  switch (codigo) {
  case 'auth/invalid-email' :
    return 'E-mail inválido'
  case 'auth/user-disabled' :
    return 'E-mail desabilitado'
  case 'auth/user-not-found' :
    return 'Não há usuário cadastrado com esse e-mail'
  case 'auth/wrong-password' :
    return 'Senha inválida ou não definida'
  default :
    return 'Não foi possível fazer login'
  }
}
