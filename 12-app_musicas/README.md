# UFSC - CTC - INE - INE5646 Programação para Web :: Exercício App Músicas

A aplicação mostra quais são cantores que estão entre os 10 primeiros colocados segundo o site [LastFM](https://www.last.fm/). São mostrados, para cada cantor, o seu nome, uma fotografia e um link para um site com mais informações.

## Objetivo do Exercício

Mostrar uma aplicação do tipo PWA (**Progressive Web Application**) que funciona mesmo quando não há conexão com a Internet. A aplicação utiliza a biblioteca [workbox](https://developers.google.com/web/tools/workbox/) para gerenciar os conteúdos offline. A aplicação também utiliza o conceito de *hooks* para modelar os componentes React. Assim todos os componentes React são modelados como funções e não como classes.

## Bug do Exercício

Não há bug no exercício. Sua tarefa é compreender como o conceito de PWA materializa-se no código fonte, tanto no lado cliente como no lado servidor, e também
disponibilizar a aplicação no Heroku.

## Instruções

### Durante o desenvolvimento com VSCode

#### Preparação Inicial

Os procedimentos a seguir devem ser realizados uma única vez.

##### Configurando arquivo .env

Crie, no diretório raiz do projeto ***no seu computador local***, o arquivo **.env** com o seguinte conteúdo:

```bash
LASTFM_API_KEY=88xdsc4...
FANART_TV_API_KEY=dg65cv32...
LOCAL=sim
```

O valor da variável *LASTFM_API_KEY* é obtido no endereço [https://www.last.fm/api](https://www.last.fm/api). Isso permitirá que sua aplicação acesse o webservice do Last.fm para consultar os artistas top 10.

O valor da variável *FANART_TV_API_KEY* é obtido no endereço [https://fanart.tv/get-an-api-key/](https://fanart.tv/get-an-api-key/). Isso permitirá que sua aplicação acesse imagens dos artistas indicados pelo site Last.FM.

Obs: A identificação dos artistas é feita por meio do identificador [MBID](https://musicbrainz.org/).

A variável `LOCAL`, quando presente e com o valor *sim*  indica que a aplicação será executada localmente. Se ausente ou com outro valor indica que a aplicação será executada no Heroku.

O conteúdo do arquivo **.env** deve ser protegido. Somente o desenvolvedor da aplicação pode conhecer as variáveis e seus respectivos valores. Essas informações nunca devem ser armazenadas em locais públicos como repositórios git ou repositórios de imagens docker.

##### Instalando bibliotecas JavaScript

Entre no container gerado pelo VSCode e execute os comandos a seguir.

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

### Durante o desenvolvimento

O desenvolvimento da aplicação envolve duas frentes de trabalho: a programação necessária para o lado cliente e a programação necessária para o lado servidor.

Para colocar a aplicação no ar durante o seu desenvolvimento proceda da seguinte forma.

Abra um terminal e inicie a execução do lado cliente (os arquivos serão monitorados pelo webpack):

```bash
cd cliente
npm start
```

Cada vez que um arquivo no lado cliente for alterado o webpack será acionado para gerar uma nova versão de todos os arquivos (*index.html* e *arquivos JavaScript*) necessários para a execução do lado cliente da aplicação. Estes arquivos serão armazenados dentro do diretório `servidor/publico`.

Abra um segundo terminal e inicie a execução do lado servidor (os arquivos serão monitorados pelo babel):

```bash
cd servidor
npm start
```

A partir de agora altere os arquivos JavaScript como desejar.

Sempre que um arquivo for salvo a aplicação irá reiniciar automaticamente (graças ao software **nodemon**).

### Em produção

Depois que a aplicação está pronta é preciso gerar "uma versão executável". Para isso é preciso gerar uma imagem docker e depois instanciar e executar um container a partir da imagem gerada.

#### Gerando a imagem

A imagem, aqui chamada de ***ine5646-app_musicas:*** conterá a versão executável da aplicação. Abra um terminal e entre no diretório raiz da aplicação. Execute o seguinte comando para gerar a imagem (note que o comando termina com um ponto depois de ine5646-app_musicas):

```bash
docker build -t ine5646-app_musicas .
```

#### Executando a aplicação localmente

Crie ou utilize um arquivo chamado ***.env*** com o mesmo conteúdo indicado acima.

Crie um container para executar a aplicação. Execute o seguinte comando para instanciar o container e colocá-lo no ar.

```bash
docker run -d --name app_musicas -p 3099:3000 --env-file .env ine5646-app_musicas
```

Para acessar a aplicação basta digitar `https://localhost:3099` no seu navegador.

## Executando offline

Por ser uma PWA, a aplicação está disponível para o usuário mesmo quando o container docker não estiver mais sendo executado.

Execute a aplicação uma vez (para que os dados sejam armazenados no navegador) e depois encerre ou remova o container (`docker stop app_musicas`). Em seguida use o navegador para acessar a aplicação como se estivesse tudo funcionando normalmente.
