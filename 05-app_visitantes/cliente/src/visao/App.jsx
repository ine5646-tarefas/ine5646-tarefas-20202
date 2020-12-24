import React, { useState, useEffect } from 'react'
import {Panel} from 'primereact/panel'
import {Button} from 'primereact/button'
import {Chart} from 'primereact/chart'


import 'primereact/resources/themes/saga-blue/theme.css'
import 'primereact/resources/primereact.min.css'
import 'primeicons/primeicons.css'
import 'primeflex/primeflex.css' 

/*

=====     DEFINIÇÃO DO MODELO DE DADOS     =====

 */

const EnumSituacao = {
  INICIAL : 0,
  EXIBINDO : 1,
  PESQUISANDO : 2
}

/**
 * dados : [ [mes, visitantes], ..., [mes, visitantes]]
 * 
 * retorna : {meses: [mes, ..., mes], visitantes: [visitantes, ..., visitantes]}
 */
function extraiMesesEVisitantes(dados) {
  // reducer : (acumulado, dado) => novo acumulado
  const reducer = ([meses, visitantes], [mes, vis]) => [meses.concat(mes), visitantes.concat(vis)]
  const inicial = [[],[]]
  const [meses, visitantes] = dados.reduce(reducer, inicial)
  return {meses, visitantes}
}

const estadoInicial = {situacao: EnumSituacao.INICIAL, dados: undefined}

/**
  Esta função define o modelo de dados usado na aplicação.
 */
function useModelo() {
  const [estado, setEstado] = useState(estadoInicial)

  useEffect(() => {
    if (estado.situacao === EnumSituacao.PESQUISANDO) {
      window.fetch('/dados')
        .then(r => r.json())
        .then(dados => 
          setEstado({ dados, situacao: EnumSituacao.EXIBINDO}))
    }  
  }, [estado.situacao])


  function apagaDados() {
    setEstado(estadoInicial)
  }

  function buscaDados() {
    setEstado({dados: undefined, situacao: EnumSituacao.PESQUISANDO})
  }

  return [estado, {buscaDados, apagaDados}]
}



/** 

=====     DEFINIÇÃO DA VISUALIZAÇÃO DOS DADOS     =====

*/

export default function App () {
  const [estado, {buscaDados, apagaDados}] = useModelo()

  let conteudo

  switch (estado.situacao) {
  case EnumSituacao.INICIAL: {
    conteudo = <Button label='Obter Dados' onClick={buscaDados}/>
    break
  }
  
  case EnumSituacao.EXIBINDO: {
    const {meses, visitantes} = extraiMesesEVisitantes(estado.dados)
    const dadosDoGrafico = {
      labels: meses,
      datasets: [
        {
          label: 'Visitantes',
          backgroundColor: 'blue',
          data: visitantes
        }
      ]
    }
    conteudo = 
      <Panel header='Dados dos Visisantes'>
        <Button label='Fechar' onClick={apagaDados}/>
        <Chart type='bar' data={dadosDoGrafico}/>
      </Panel>
  }
  }

  return (
    <Panel header='UFSC - CTC - INE - INE5646 :: App Visitantes'>
      <div>{conteudo}</div>
    </Panel>
  )

}
