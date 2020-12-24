# UFSC - CTC - INE - INE5646 Programação para Web :: Exercício App Filmes

A aplicação mostra uma relação de filmes (título, ano de lançamento e diretor). O usuário pode ver os detalhes de um filme clicando um botão junto ao título do filme.

## Objetivo do Exercício

Mostrar uma aplicação do tipo SPA (*Single Page Application*) que utiliza a bilioteca [React](https://reactjs.org/) e o framework CSS [Bulma](https://bulma.io/) para o desenvolvimento do lado cliente. A aplicação também utiliza o agregador [webpack](https://webpack.js.org/) para gerar o arquivo JavaScript que é executado pelo browser.

## Bug do Exercício

O botão que permite mostrar os detalhes de um filme deveria sumir da tela assim que clicado pois não faz sentido poder clicar
nele outra vez já que os detalhes do filme estão sendo selecionados.

## Configuração no seu computador

O progrma Docker Desktop precisa estar instalado e em execução na sua máquina. Acesse [https://www.docker.com/get-started](https://www.docker.com/get-started) para saber como fazer isso.

Se o VSCode for utilizado então é preciso instalar a extensão [Remote Development da Microsoft](https://marketplace.visualstudio.com/items?itemName=ms-vscode-remote.vscode-remote-extensionpack).

## Instruções

Crie o arquivo `.env` no diretório raiz do projeto e defina o seguinte conteúdo:

```bash
LOCAL=sim
```

Esta variável, quando presente e com o valor *sim*  indica que a aplicação será executada localmente. Se ausente ou com outro valor indica que a aplicação será executada no Heroku.

### Durante o desenvolvimento com VSCode

Os procedimentos a seguir devem ser realizados uma única vez.

#### Instalando bibliotecas JavaScript

Abra um terminal e instale as bibliotecas JavaScript usadas pelo lado cliente da aplicação:

```bash
cd cliente
npm install
```

Abra um terminal e instale as bibliotecas JavaScript usadas pelo lado servidor da aplicação:

```bash
cd servidor
npm install
```

#### Durante o desenvolvimento

Para colocar a aplicação no ar durante o seu desenvolvimento proceda da seguinte forma.

Abra um terminal e inicie a execução do lado cliente (os arquivos serão monitorados pelo webpack):

```bash
cd cliente
npm start
```

Abra um segundo terminal e inicie a execução do lado servidor (os arquivos serão monitorados pelo babel):

```bash
cd servidor
npm start
```

A partir de agora altere os arquivos JavaScript como desejar.

### Em produção

Depois que a aplicação está pronta é preciso gerar "uma versão executável". Para isso é preciso gerar uma imagem e depois instanciar e executar um container a partir da imagem gerada.

#### Gerando a imagem

A imagem, aqui chamada de ***ine5646-app_filmes:*** conterá a versão executável da aplicação. Execute o seguinte comando para gerar a imagem (note que o comando termina com um ponto depois de ine5646-app_filmes):

```bash
docker build -t ine5646-app_filmes .
```

#### Executando a aplicação localmente

Crie um container para executar a aplicação. Execute o seguinte comando para instanciar o container e colocá-lo no ar.

```bash
docker run -d --name ine5646-app_filmes --env-file .env -p 4000:3000 ine5646-app_filmes
```

Para acessar a aplicação basta digitar `https://localhost:4000` no seu navegador.
