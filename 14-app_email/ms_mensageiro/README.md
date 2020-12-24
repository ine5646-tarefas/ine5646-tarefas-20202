# UFSC - CTC - INE - INE5646 Programação para Web :: App email -- Microserviço Mensageiro

Programa que implementa um microserviço utilizando a biblioteca [Moleculer](https://moleculer.services/). O microserviço faz parte da aplicação **app_email** e disponibiliza
os seguintes serviços:

## Serviço mensageiro.informaMaxMsgsLidas

O serviço que retorna qual é o número máximo de mensagens já enviadas que podem ser solicitadas. É uma forma tosca de evitar que um usuário solicite muitas mensagens do banco de dados. Este serviço não necessita de parâmetros.

O serviço retorna:

* `number` indicando o número máximo de mensagens que pode ser lida

## Serviço mensageiro.enviaEmailDePara

Serviço que envia uma mensagem de um usuário para outro usuário. Necessita dos seguintes parâmetros:

* `token: string` = token JWT do usuário que está enviando a mensagem
* `para: string` = e-mail do destinatário da mensagem
* `assunto: string` = assunto da mensagem
* `texto: string` = texto da mensagem

O serviço retorna:

* `{ok: true, token: string}` caso tenha sido possível enviar a mensagem. O token é um token JWT renovado (com novo prazo de validade). Uma cópia da mensagem é armazenada em um banco de dados.
* `{ok: false, motivo: string}` caso não tenha sido possível enviar a mensagem. Motivos típicos: o token já expirou; o destinatário não está cadastrado no sistema; banco de dados inacessível.

## Serviço mensageiro.leEmailsEnviados

Serviço que retorna as últimas mensagens já enviadas pelo usuário. Necessita dos seguintes parâmetros:

* `token: string` = token JWT do usuário que enviou as mensagens
* `qtd: number` = quantidade de mensagens que devem ser lidas do banco de dados. A quantidade efetivamente lida está limitada ao valor definido em *process.env.MAX_MSGS_LIDAS*.

O serviço retorna:

* `{ok: true, token: string, emails: [{quando: number, de: string, para: string, assunto: string, texto: string}]}` caso tenha sido possível ler as mensagens. O token é um token JWT renovado (prazo de validade extendida).
* `{ok: false, motivo: string}` caso não tenha sido possível obter as mensagens. Motivos típicos: o token já expirou; não foi possível acessar o banco de dados.

## Evento usuario.removido

Caso o microserviço seja notificado com o evento *usuario.removido* então ele reagirá removendo todas as mensagens armazenadas para o usuário indicado no parâmetro. O evento contém o seguinte parâmetro:

* `email: string` = e-mail do usuário que foi removido.

## Instruções

### Variáveis de ambiente

O arquivo *.env* localizado dentro do diretório *ms_mensageiro* deve conter:

```bash
RABBITMQ_URL=amqps://...

URL_BANCO=mongodb://...

MAX_MSGS_LIDAS=10
```

A variável `RABBITMQ_URL` indica o endereço de acesso do serviço de mensagens do software **RabbitMQ**. O microserviço lê e envia mensagens por meio deste software.

A variável `URL_BANCO` indica qual a URL que permite ao microserviço acessar o banco de dados que armazenará as mensagens enviadas pelos usuários.

A variável *MAX_MSGS_LIDAS* deve ser um número que indica o número máximo de mensagens que podem ser lidas do banco de dados.

### Durante o desenvolvimento

Em um terminal, digite `npm install` para instalar as bibliotecas utilizadas pelo microserviço.

Para iniciar o desenvolvimento digite `npm start`.

Sempre que um arquivo for alterado e salvo o microserviço irá reiniciar automaticamente graças ao software *nodemon*.

### Em produção

Depois que o código do microserviço está pronto é preciso gerar a **imagem docker**. Para isso, acesse um terminal, vá para o diretório raiz do projeto e digite (note o ponto no final do comando):

`docker build -t ms_mensageiro_app_email .`

No comando acima o nome da imagem docker será **ms_mensageiro_app_email**.

### Executando o microserviço em produção

Para executar o microserviço em modo produção é preciso instanciar um container a partir da imagem gerada no comando acima. Abra um terminal e digite:

`docker run -d --name ms_mensageiro_app_email --env-file .env ms_mensageiro_app_email`

No comando acima, o nome do container é igual ao nome da imagem e o arquivo `.env` está localizado no diretório onde o comando é executado.
