//@flow

import React from 'react'

type Props = {|
    onOpcaoSelecionada: (opcao: OpcaoMenu) => void
|}

export type OpcaoMenu = 'ENVIAR_MSG' | 'LER_MSGS' | 'REMOVER_USUARIO' | 'SAIR'

export default function NavBar(props: Props): React$Element<'nav'> {
  return <nav className='navbar'>
    <div className='navbar-menu has-background-light'>
      <div className='navbar-start'>
        <div className='navbar-item has-dropdown is-hoverable'>
          <div className='navbar-link'>
                Mensagem
          </div>
          <div className='navbar-dropdown'>
            <a className='dropdown-item'
              onClick={() => props.onOpcaoSelecionada('ENVIAR_MSG')}>
                 Enviar Para...
            </a>
            <a className='dropdown-item'
              onClick={() => props.onOpcaoSelecionada('LER_MSGS')}>
                Ler Já Enviadas...
            </a>
          </div>
        </div>

        <div className='navbar-item has-dropdown is-hoverable'>
          <div className='navbar-link'>
                Usuário
          </div>
          <div className='navbar-dropdown'>
            <a className='dropdown-item' 
              onClick={() => props.onOpcaoSelecionada('REMOVER_USUARIO')}>
                Remover...
            </a>
          </div>
        </div>

      </div>
      <div className='navbar-end'>
        <div className='navbar-item'>
          <span className='button is-small is-primary' onClick={() => props.onOpcaoSelecionada('SAIR')}>Sair</span>
        </div>

      </div>
    </div>
  </nav>
}