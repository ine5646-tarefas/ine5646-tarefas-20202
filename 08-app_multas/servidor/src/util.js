//@flow

/**
Executa um conjunto de promises em série (sequencialmente) e retorna um
Promise que conterá um array com a resposta de cada Promise.
*/

type f = string => Promise<string>

async function executaPromisesEmSerie (dados: Array<string>, funcaoQueRetornaPromise: f): Promise<Array<string>> {
  // Um Promise só será instanciado (e imediatamente executado) quando a
  // função func for executada.
  const func = dado => () => funcaoQueRetornaPromise(dado)

  const funcs = dados.map(func)
  const funcaoReduce = (promiseComArrayDeRespostas, f) =>
    promiseComArrayDeRespostas.then(respostas => f().then(rf => respostas.concat(rf)))

  return funcs.reduce(funcaoReduce, Promise.resolve([]))
}

export default executaPromisesEmSerie
