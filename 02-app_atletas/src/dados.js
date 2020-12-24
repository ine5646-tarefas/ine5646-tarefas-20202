// dados.js

/*
Representa o estado atual da aplicação
*/
import {Equipe, Atleta} from './modelo'

const equipe = new Equipe('Os Gigantes')
equipe.adicione(new Atleta('Fulano de Tal', 188))
equipe.adicione(new Atleta('Macielimero Gurterioso Notade', 174))
equipe.adicione(new Atleta('Talismã Ouro Frates', 163))
equipe.adicione(new Atleta('Sebastiana Pinta Gretere', 192))
equipe.adicione(new Atleta('Carlos Martelino', 171))
equipe.adicione(new Atleta('Gamalino Furioso', 174))

const dados = {
  equipe, // equivale a equipe: equipe
  titulo: 'INE5646 App Atletas'
}

export {dados}
