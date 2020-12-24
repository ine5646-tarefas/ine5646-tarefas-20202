# UFSC - CTC - INE - INE5646 Programação para Web :: Exercício App Pessoas

A aplicação mostra na tela uma relação de todas as pessoas (nome e idade) cadastradas e uma segunda relação contendo apenas as pessoas cuja idade seja superior a uma idade limite.

## Objetivo do Exercício

Mostrar uma aplicação cuja página é gerada no lado servidor e que utiliza apenas módulos (bibliotecas JavaScript) já existentes no Node durante a execução da aplicação.

## Bug no Exercício

Não está selecionando as pessoas cuja idade seja superior à idade limite.

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

A imagem, aqui chamada de ***ine5646-app_pessoas*** conterá a versão executável da aplicação. Execute o seguinte comando para gerar a imagem (note que o comando termina com um ponto depois de ine5646-app_pessoas):

```bash
docker build -t ine5646-app_pessoas .
```

#### Executando a aplicação localmente

Crie um container para executar a aplicação. Execute o seguinte comando para instanciar o container e colocá-lo no ar.

```bash
docker run -d --name ine5646-app_pessoas --env-file .env -p 4000:3000 ine5646-app_pessoas
```

Para acessar a aplicação basta digitar `https://localhost:4000` no seu navegador.

Naturalmente, pode-se utilizar outras portas (por exemplo, -p 4500:3000). Neste caso, a aplicação seria acessada via `https://localhost:4500`.
