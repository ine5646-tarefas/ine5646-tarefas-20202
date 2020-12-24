# UFSC - CTC - INE - INE5646 Programação para Web :: Exercício App Usuários

A aplicação permite o gerenciamento de usuários de uma aplicação usando o framework [Firebase](https://firebase.google.com/).

## Objetivo do Exercício

Mostrar como usar o Firebase para gerenciar usuários de uma aplicação.

## Bug do Exercício

O exercício não possui bugs. Sua tarefa consiste em configurar o Firebase com base nas instruções a seguir e depois disponibilizar a aplicação no Heroku.

## Instruções

### Criação e Configuração de Projeto no Firebase

Acesse o [console do Firebase](https://console.firebase.google.com) e proceda conforme as instruções a seguir.

### Criar novo projeto

1. Adicione novo projeto e forneça um nome para o projeto.

2. Desative o Google Analytics (não é necessário para o exercício)

3. Clique no botão "Criar Projeto"

### Baixar arquivo firebase-adminskd.json

Com o projeto criado,

1. Clique no botão (ícone roda-dentada) ao lado de "Visão geral do projeto" e selecione a opção "Configurações do Projeto"

2. Selecione a aba "Settings/Contas de Serviço"

3. Na aba "SDK Admin do Firebase", clique em "Gerar nova chave primária" e depois em "Gerar chave". Será gerado um arquivo JSON. Salve este arquivo no diretório raiz da aplicação usando como nome do arquivo **firebase-adminsdk.json**.

O conteúdo do arquivo será um objeto JSON com os seguintes atributos (no lugar de *...* aparecerão os dados específicos do seu projeto):

```bash
{
  "type": "service_account",
  "project_id": "...",
  "private_key_id": "...",
  "private_key": "-----BEGIN PRIVATE KEY-----\n...\n-----END PRIVATE KEY-----\n",
  "client_email": "...",
  "client_id": "...",
  "auth_uri": "https://accounts.google.com/o/oauth2/auth",
  "token_uri": "https://accounts.google.com/o/oauth2/token",
  "auth_provider_x509_cert_url": "https://www.googleapis.com/oauth2/v1/certs",
  "client_x509_cert_url": "..."
}
```  

### Baixar arquivo firebase-config.json

1. Selecione a aba "Settings/Geral".

2. Na seção "Seus aplicativos" (que deverá mostrar a mensagem *Não há apps no seu projeto*) clique no terceiro botão (à direita do botão android), que mostra o símbolo **</>**.

3. Registre o app, preenchendo o campo *Apelido do app*. Coloque qualquer nome, por exemplo, *app-usuarios*.

4. Clique no botão "Registrar app".

5. Clique no botão "Continuar no console".

6. Agora na seção "Seus aplicativos" aparece o nome que você colocou na etapa 3 acima (no exemplo, *app-usuarios*). Na seção "Firebase SDK snippet", selecione a opção "Configuração" (está selecinada a opção "CDN").

7. Copie o valor da constante *firebaseConfig*, que é um objeto JavaScript com vários atributos (apiKey, authDomain, etc).

8. No diretório raiz da aplicação, crie o arquivo **firebase-config.json** (que ficará ao lado do arquivo *firebase-adminsdk.json*) e cole o objeto copiado na etapa 7. Coloque todos os atributos entre aspas (uma vez que é um objeto JSON). O conteúdo do arquivo será (no lugar de *...* devem estar os valores da sua aplicação):

```bash
{
  "apiKey": "...",
  "authDomain": "....firebaseapp.com",
  "databaseURL": "https://....firebaseio.com",
  "projectId": "...",
  "storageBucket": "",
  "messagingSenderId": "...",
  "appId": "..."
}
```

### Definição do arquivo .env

Crie no diretório raiz da aplicação um arquivo chamado `.env` para armazenar as informações contidas nos arquivos **firebase-config.json** e **firebase-adminsdk.json**. Use a seguinte convenção para os nomes das variáveis: prefixe com `FIREBASE_CONFIG_` cada atributo do arquivo **firebase-config.json** e com `FIREBASE_ADMINSDK_` cada atributo do arquivo **firebase-adminsdk.json**.

Assim, por exemplo o atributo `type` do arquivo **firebase-adminsdk.json** e o atributo `messagingSenderId` do arquivo **firebase-config.json** serão representados da seguinte forma:

```bash
FIREBASE_ADMINSDK_type=service_account

FIREBASE_CONFIG_messagingSenderId=334111770965
```

Ao final o arquivo **.env** deverá ter o seguinte conteúdo (os valores dos atributos são fictícios e devem ser substituídos pelos existentes nos dois arquivos *.json*):

```bash
LOCAL=sim


FIREBASE_CONFIG_apiKey=Nb34...K3E
FIREBASE_CONFIG_authDomain=....firebaseapp.com
FIREBASE_CONFIG_databaseURL=https://....firebaseio.com
FIREBASE_CONFIG_projectId=meu-identificador-3e723
FIREBASE_CONFIG_storageBucket=meu-identificador-3e723.appspot.com
FIREBASE_CONFIG_messagingSenderId=607654872265
FIREBASE_CONFIG_appId=1:673649772265:web:77775f41992cbcb0cb9278

FIREBASE_ADMINSDK_type=service_account
FIREBASE_ADMINSDK_project_id=meu-identificador-3e723
FIREBASE_ADMINSDK_private_key_id=3c9f4a7c63a21cc1e89f9340dca95ef9407fd5cb
FIREBASE_ADMINSDK_private_key=-----BEGIN PRIVATE...\n-----END PRIVATE KEY-----\n
FIREBASE_ADMINSDK_client_email=firebase-adminsdk-fqi57@meu-identificador-3e723.iam.gserviceaccount.com
FIREBASE_ADMINSDK_client_id=105956760586354887792
FIREBASE_ADMINSDK_auth_uri=https://accounts.google.com/o/oauth2/auth
FIREBASE_ADMINSDK_token_uri=https://oauth2.googleapis.com/token
FIREBASE_ADMINSDK_auth_provider_x509_cert_url=https://www.googleapis.com/oauth2/v1/certs
FIREBASE_ADMINSDK_client_x509_cert_url=https://www.googleapis.com/robot/v1/metadata/x509/firebase-adminsdk-fqi57%40meu-identificador-3e723.iam.gserviceaccount.com

```

Note que os valores das chaves nunca começam/terminam com aspas (`"`) ou apóstrofes (`'`).

A variável `LOCAL`, quando presente e com o valor *sim*  indica que a aplicação será executada localmente. Se ausente ou com outro valor indica que a aplicação será executada no Heroku.

O conteúdo do arquivo **.env** deve ser protegido. Somente o desenvolvedor da aplicação pode conhecer as variáveis e seus respectivos valores. Essas informações nunca devem ser armazenadas em locais públicos como repositórios git ou repositórios de imagens docker.

Depois que o arquivo `.env` estiver definido você pode apagar os dois arquivos `.json`. Mas antes certifique-se que os valores no *.env* são exatamente os mesmos dos *.json*.

## Habilitar serviço de autenticação de usuários

O Firebase fornece diversos servidos (hospedagem, autenticação, base de dados, etc). No exercício utiliza-se apenas o serviço de autenticação de usuários.

1. Clique na opção "Desenvolver/Authentication".

2. Na aba "Users", clique no botão "Configurar método de login".

3. Selecione a opção "E-mail/senha" e clique no primeiro botão "Ativar" ("Permite que os usuários se inscrevam usando o endereço de e-mail e a senha deles").

4. Clique no botão "Salvar". O provedor "E-mail/senha" agora tem status "Ativado".

5. Clique na aba "Users" e em seguida no botão "Adicionar usuário".

6. Digite um e-mail válido que você tenha acesso (para ler e-mails que o Firebase irá lhe enviar) e uma senha (esta senha é exclusiva para este exercício, não é a senha do e-mail informado). Este e-mail será o administrador no exercício app-usuarios. Clique no botão "Adicionar usuário".

## Cadastrar administrador da aplicação

No exercício o e-mail cadastrado na etapa 6 acima tem a capacidade de cadastrar novos usuários (identifiados por seus respectivos e-mails). Para que isso seja possível:

1. Abra um terminal e entre no diretório *servidor*.

2. Digite **npm run build**.

3. Cadastre o administrador digitando `node build/scripts/cria_admin.js e-mail-do-administrador`.

## Configuração no seu computador

O programa Docker Desktop precisa estar instalado e em execução na sua máquina. Acesse [https://www.docker.com/get-started](https://www.docker.com/get-started) para saber como fazer isso.

Se o VSCode for utilizado então é preciso instalar a extensão [Remote Development da Microsoft](https://marketplace.visualstudio.com/items?itemName=ms-vscode-remote.vscode-remote-extensionpack).

## Durante o desenvolvimento com VSCode

### Preparação Inicial

Os procedimentos a seguir devem ser realizados uma única vez.

#### Instalando bibliotecas JavaScript

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

#### Colocar a aplicação no ar durante o desenvolvimento

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

### Colocar a aplicação no ar em produção (aplicação pronta)

Depois que a aplicação está pronta é preciso gerar "uma versão executável". Para isso é preciso gerar uma imagem e depois instanciar e executar um container a partir da imagem gerada.

#### Gerando a imagem

A imagem, aqui chamada de ***ine5646-app_usuarios:*** conterá a versão executável da aplicação. Execute o seguinte comando para gerar a imagem (note que o comando termina com um ponto depois de ine5646-app_usuarios):

```bash
docker build -t ine5646-app_usuarios .
```

#### Executando a aplicação localmente

Crie ou utilize um arquivo chamado ***.env*** com o mesmo conteúdo indicado acima.

Crie um container para executar a aplicação. Execute o seguinte comando para instanciar o container e colocá-lo no ar.

```bash
docker run -d --name ine5646-app_usuarios -p 4000:3000 --env-file .env ine5646-app_usuarios
```

Para acessar a aplicação basta digitar `https://localhost:4000` no seu navegador.

Naturalmente, pode-se utilizar outras portas (por exemplo, -p 4500:3000) e o arquivo **.env** pode estar localizado em qualquer diretório. Neste caso, a aplicação seria acessada via `https://localhost:4500`.
