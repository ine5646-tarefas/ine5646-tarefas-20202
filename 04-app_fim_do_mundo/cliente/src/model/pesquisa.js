import { Asteroide, Relatorio } from './modelos'

const URL_BASE = 'https://api.nasa.gov/neo/rest/v1/feed'

async function pesquisa (nasaApiKey, data) {
  const asteroides = await acessaNASA(nasaApiKey, data)
  return new Relatorio(data, asteroides)
}

async function acessaNASA (nasaApiKey, dia) {
  const u = `${URL_BASE}?start_date=${dia}&end_date=${dia}&api_key=${nasaApiKey}`
  const resp = await window.fetch(u)
  if (resp.ok === false) {
    throw new Error('Não foi possível acessar dados da NASA. API Key não definida ou inválida.')
  }
  const respJSON = await resp.json()
  return processaRespostaNASA(respJSON, dia)
}

function processaRespostaNASA (respJSON, dia) {
  const qtdEncontrada = respJSON.element_count
  const ocorrencias =
    qtdEncontrada === 0 ? [] : respJSON.near_earth_objects[dia]

  return ocorrencias.map(ocorrencia => objToAsteroide(ocorrencia))
}

function objToAsteroide (ocorrencia) {
  const nome = ocorrencia.name
  const diametro = ocorrencia.estimated_diameter.meters.estimated_diameter_min
  const distancia = ocorrencia.close_approach_data[0].miss_distance.kilometers
  const ehAmeaca = ocorrencia.is_potentially_hazardous_asteroid
  return new Asteroide(nome, diametro, distancia, ehAmeaca)
}

export default pesquisa
