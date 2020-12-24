# UFSC - CTC - INE - INE5646 Programação para Web :: App Email

## Aplicação para web

A aplicação tem por objetivo permitir que usuários cadastrados enviem mensagens para outros usuários cadastrados. Além disso o usuário cadastrado pode ver as mensagens que já enviou. **O transporte dessas mensagens é feito via e-mail**.

Um usuário se cadastra fornecendo seu e-mail, seu  nome e uma senha para acesso à aplicação. A aplicação então envia um e-mail para o endereço fornecido contendo um link que, quando clicado, confirmará o cadastro.

Um usuário que esqueceu sua senha pode solicitar para a aplicação que envie e-mail com instruções para cadastrar nova senha.

## Instruções

### Preparação

## Configuração no seu computador

O progrma Docker Desktop precisa estar instalado e em execução na sua máquina. Acesse [https://www.docker.com/get-started](https://www.docker.com/get-started) para saber como fazer isso.

Se o VSCode for utilizado então é preciso instalar a extensão [Remote Development da Microsoft](https://marketplace.visualstudio.com/items?itemName=ms-vscode-remote.vscode-remote-extensionpack).

### Durante o desenvolvimento com VSCode

#### Preparação Inicial

Os procedimentos a seguir devem ser realizados uma única vez.

##### Configurando arquivo .env

Crie, no diretório raiz do projeto ***no seu computador local***, o arquivo **.env** com o seguinte conteúdo:

```bash
RABBITMQ_URL=amqp://...@lion.rmq.cloudamqp.com/...
LOCAL=sim
```

O valor da variável `RABBITMQ_URL` é definido pelo serviço oferecido pelo **CloudAMQP**.

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

A imagem, aqui chamada de ***ine5646-app_email:*** conterá a versão executável da aplicação. Execute o seguinte comando para gerar a imagem (note que o comando termina com um ponto depois de ine5646-app_email):

```bash
docker build -t ine5646-app_email .
```

#### Executando a aplicação localmente

Crie ou utilize um arquivo chamado ***.env*** com o mesmo conteúdo indicado acima.

Crie um container para executar a aplicação. Execute o seguinte comando para instanciar o container e colocá-lo no ar.

```bash
docker run -d --name ine5646-app-email -p 4000:3000 --env-file .env ine5646-app_email
```

Para acessar a aplicação basta digitar `https://localhost:4000` no seu navegador.

Naturalmente, pode-se utilizar outras portas (por exemplo, -p 4500:3000) e o arquivo **.env** pode estar localizado em qualquer diretório. Neste caso, a aplicação seria acessada via `https://localhost:4500`.
