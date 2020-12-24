//@flow

import React, {useState} from 'react'

type Props = {|
  id: string,
  texto: string,
  onDelete: string => void    
|}


function obtenhaTexto(mostrando: boolean, texto: string): string {
  return mostrando ?  'Ocultar' : `${texto.substring(0,10)}...`
}


function MostraLembrete (props: Props): React$Element<'span'> {
  const [mostrando, setMostrando] = useState(false)


  function exibaOuOculte() {
    setMostrando(!mostrando)
  }

  let conteudo

  if (mostrando) {
    conteudo =
        <div className='notification is-info'>
          <textarea className='textarea' readOnly value={props.texto}/>
          <button className='button is-link' 
            onClick={exibaOuOculte}>
            {obtenhaTexto(mostrando, props.texto)}
          </button>
          <button className='button is-danger'
            onClick={() => props.onDelete(props.id)}>
              Apagar
          </button>
        </div>
  } else {
    conteudo =
          <button className='button is-link is-rounded' onClick={exibaOuOculte}>
            {obtenhaTexto(mostrando, props.texto)}
          </button>
  }
  return (
    <span>{conteudo}</span>
  )
}


export default MostraLembrete
