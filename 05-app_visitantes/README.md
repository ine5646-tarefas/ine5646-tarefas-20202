# UFSC - CTC - INE - INE5646 Programação para Web :: Exercício App Visitantes

A aplicação mostra um gráfico de barras que exibe quantas pessoas visitaram um site fictício em um conjunto de meses. Os dados, fictícios e aleatórios, são obtidos do servidor.

## Objetivo do Exercício

Mostrar uma aplicação do tipo SPA (*Single Page Application*) que utiliza a bilioteca de componentes React [PrimeReact](https://www.primefaces.org/primereact/#/). O componente que exibe o gráfico utiliza a bilioteca [Chart.js](https://www.chartjs.org/)

## Bug do Exercício

A aplicação não mostra nenhuma informação ao usuário enquanto está obtendo os dados do servidor. Como esta tarefa é demorada
o usuário pode pensar que a aplicação parou de funcionar. É preciso então mostrar algum aviso enquanto os dados estão
sendo pesquisados.

## Configuração no seu computador

O progrma Docker Desktop precisa estar instalado e em execução na sua máquina. Acesse [https://www.docker.com/get-started](https://www.docker.com/get-started) para saber como fazer isso.

Se o VSCode for utilizado então é preciso instalar a extensão [Remote Development da Microsoft](https://marketplace.visualstudio.com/items?itemName=ms-vscode-remote.vscode-remote-extensionpack).

## Instruções

### Durante o desenvolvimento com VSCode

#### Preparação Inicial

##### Configurando arquivo .env

Crie, no diretório raiz do projeto ***no seu computador local***, o arquivo **.env** com o seguinte conteúdo

```bash
LOCAL=sim
```

A variável `LOCAL`, quando presente e com o valor *sim*  indica que a aplicação será executada localmente. Se ausente ou com outro valor indica que a aplicação será executada no Heroku.

##### Instalando bibliotecas JavaScript

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

A imagem, aqui chamada de ***ine5646-app_visitantes:*** conterá a versão executável da aplicação. Execute o seguinte comando para gerar a imagem (note que o comando termina com um ponto depois de ine5646-app_visitantes):

```bash
docker build -t ine5646-app_visitantes .
```

#### Executando a aplicação localmente

Crie um container para executar a aplicação. Execute o seguinte comando para instanciar o container e colocá-lo no ar.

```bash
docker run -d --name ine5646-app_visitantes --env-file .env -p 4000:3000 ine5646-app_visitantes
```

Para acessar a aplicação basta digitar `https://localhost:4000` no seu navegador.

Naturalmente, pode-se utilizar outras portas (por exemplo, -p 4500:3000). Neste caso, a aplicação seria acessada via `https://localhost:4500`.
