# UFSC - CTC - INE - INE5646 Programação para Web :: Exercício App Vulcões

A aplicação permite que o usuário cadastre e visualize imagens sobre vulcões. As imagens são armazenadas em um banco de dados MongoDB.

## Objetivo do Exercício

No lado front-end, mostrar como obter imagens armazenadas no dispositivo (computador ou celular) e também o gerenciamento de usuários via JWT. No lado back-end, mostrar como ler e armazenar imagens em um banco de dados MongoDB.

Outro objetivo, válido tanto para o lado front-end quanto para o back-end, é mostrar como a ferramenta [Flow](https://flow.org/) pode auxiliar na qualidade do software por meio do uso e criação de tipos (para variáveis, classes e funções) que são analisados em tempo de compilação. É uma solução alternativa ao [PropTypes](https://reactjs.org/docs/typechecking-with-proptypes.html), que verifica os tipos em tempo de execução, e também à linguagem de programação [TypeScript](https://www.typescriptlang.org/). O Flow, conceitualmente, é semelhante à TypeScript.

A aplicação utiliza tokens no formato JWT (JSON Web Token) gerados pela
biblioteca *jsonwebtoken*. A documentação desta biblioteca está disponível em
[https://github.com/auth0/node-jsonwebtoken#readme](https://github.com/auth0/node-jsonwebtoken#readme).

## Bug do Exercício

Não há nenhum bug no exercício. Sua tarefa é disponibilizar a aplicação no Heroku.

## Configuração no seu computador

O progrma Docker Desktop precisa estar instalado e em execução na sua máquina. Acesse [https://www.docker.com/get-started](https://www.docker.com/get-started) para saber como fazer isso.

Se o VSCode for utilizado então é preciso instalar a extensão [Remote Development da Microsoft](https://marketplace.visualstudio.com/items?itemName=ms-vscode-remote.vscode-remote-extensionpack).

## Instruções

### Durante o desenvolvimento com VSCode

#### Preparação Inicial

Os procedimentos a seguir devem ser realizados uma única vez.

##### Configurando arquivo .env

Crie, no diretório raiz do projeto ***no seu computador local***, o arquivo **.env** com o seguinte conteúdo

```bash
BD_URL=mongodb://...

SENHA_JWT=os grandes dias da senha secreta

DURACAO_TOKEN=3h

LIMITE_IMAGEM=3072000

LOCAL=sim
```

Para a base de dados, como sugestão, acesse [https://www.mongodb.com/](https://www.mongodb.com/)  e crie sua base de dados.

O valor da variável BD_URL deve ser a URL que dá acesso à sua base de dados.

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

A imagem, aqui chamada de ***ine5646-app_vulcoes:*** conterá a versão executável da aplicação. Execute o seguinte comando para gerar a imagem (note que o comando termina com um ponto depois de ine5646-app_vulcoes):

```bash
docker build -t ine5646-app_vulcoes .
```

#### Executando a aplicação localmente

Crie ou utilize um arquivo chamado ***.env*** com o mesmo conteúdo indicado acima.

Crie um container para executar a aplicação. Execute o seguinte comando para instanciar o container e colocá-lo no ar.

```bash
docker run -d --name ine5646-app_vulcoes -p 4000:3000 --env-file .env ine5646-app_vulcoes
```

Para acessar a aplicação basta digitar `https://localhost:4000` no seu navegador.

Naturalmente, pode-se utilizar outras portas (por exemplo, -p 4500:3000) e o arquivo **.env** pode estar localizado em qualquer diretório. Neste caso, a aplicação seria acessada via `https://localhost:4500`.
