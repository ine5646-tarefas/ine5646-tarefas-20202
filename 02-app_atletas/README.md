# UFSC - CTC - INE - INE5646 Programação para Web :: Exercício App Atletas

A aplicação mostra na tela uma relação de atletas (nome e altura) cadastradas em uma equipe. O usuário pode pesquisar os atletas que possuem uma altura mínima (informada pelo usuário).

## Objetivo do Exercício

Mostrar uma aplicação cujas páginas são geradas no lado servidor e que utiliza o framework [Express](http://expressjs.com/),  a biblioteca [pug](https://pugjs.org/api/getting-started.html) e os estilos CSS do framework [Bulma](https://bulma.io/).

## Bug no Exercício

A aplicação não está levando em consideração a altura informada pelo usuário.

## Configuração no seu computador

O programa Docker Desktop precisa estar instalado e em execução na sua máquina. Acesse [https://www.docker.com/get-started](https://www.docker.com/get-started) para saber como fazer isso.

Se o VSCode for utilizado então é preciso instalar a extensão [Remote Development da Microsoft](https://marketplace.visualstudio.com/items?itemName=ms-vscode-remote.vscode-remote-extensionpack).

## Instruções

### Durante o desenvolvimento com VSCode

#### Preparação Inicial

Os procedimentos a seguir devem ser realizados uma única vez.

Crie o arquivo `.env` no diretório raiz do projeto e defina o seguinte conteúdo:

```bash
LOCAL=sim
```

Esta variável, quando presente e com o valor *sim*  indica que a aplicação será executada localmente. Se ausente ou com outro valor indica que a aplicação será executada no Heroku.

##### Instalando bibliotecas JavaScript

Abra um terminal e instale as bibliotecas JavaScript usadas durante o desenvolvimento da aplicação:

```bash
npm install
```

#### Durante o desenvolvimento

Para colocar a aplicação no ar durante o seu desenvolvimento proceda da seguinte forma.

Abra um terminal e inicie a execução da aplicação (os arquivos serão monitorados pelo babel):

```bash
npm start
```

A partir de agora altere os arquivos JavaScript contidos no diretório *src* como desejar.

### Em produção

Depois que a aplicação está pronta é preciso gerar "uma versão executável". Para isso é preciso gerar uma imagem e depois instanciar e executar um container a partir da imagem gerada.

#### Gerando a imagem

A imagem, aqui chamada de ***ine5646-app_atletas*** conterá a versão executável da aplicação. Execute o seguinte comando para gerar a imagem (note que o comando termina com um ponto depois de ine5646-app_atletas):

```bash
docker build -t ine5646-app_atletas .
```

#### Executando a aplicação localmente

Crie um container para executar a aplicação localmente. Execute o seguinte comando para instanciar o container e colocá-lo no ar.

```bash
docker run -d --name ine5646-app_atletas --env-file .env -p 4000:3000  ine5646-app_atletas
```

Para acessar a aplicação basta digitar `https://localhost:4000` no seu navegador.
