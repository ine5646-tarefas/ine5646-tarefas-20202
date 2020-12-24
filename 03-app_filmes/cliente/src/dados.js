// dados.js
import { Filmoteca } from './modelo/Filmoteca'
import { Filme } from './modelo/Filme'

const filmoteca = new Filmoteca()
filmoteca.adicioneFilme(new Filme(1, 'Um dia de fúria', 1993, 'Joel Schumacher'))
filmoteca.adicioneFilme(new Filme(2, 'O nome da rosa', 1986, 'Jean-Jaques Annaud'))
filmoteca.adicioneFilme(new Filme(3, 'The Wall', 1982, 'Alan Parker e Gerald Scarfe'))
filmoteca.adicioneFilme(new Filme(4, '2001 - Uma Odisséia no Espaço', 1968, 'Stanley Kubrick'))

export default filmoteca
