# UFSC - CTC - INE - INE5646 Programação para Web :: App email -- Microserviço Email

Programa que implementa um microserviço utilizando a biblioteca [Moleculer](https://moleculer.services/). O microserviço faz parte da aplicação **app_email** e disponibiliza
os seguintes serviços:

## Serviço email.enviaEmail

Serviço que envia um e-mail usando os seguintes parâmetros:

* `para: string` = e-mail do destinatário da mensagem
* `assunto: string` = assunto da mensagem
* `texto: string` = a mensagem

O serviço retorna:

* `{ok: true}` caso tenha sido possível enviar o e-mail.
* `{ok: false, motivo: string}` caso não tenha sido possível enviar o e-mail.

## Serviço email.validaEmail

Serviço que verifica se um e-mail realmente existe usando os seguintes parâmetros:

* `email: string`= e-mail a ser validado

O serviço retorna:

* `{ok: true}` caso o e-mail seja válido
* `{ok: false, motivo: string}` caso o e-mail não seja válido

## Instruções

### Configuração

#### Do Serviço de envio e-mail

Os emails são enviados via uma conta Google. Para isso tome as seguintes providências:

1. Crie uma conta de e-mail no Gmail. Não utilize a sua conta pessoal!

1. Entre na conta criada.

1. Clique em *Google Account* (canto superior direito da tela).

1. Clique em *Security*.

1. Habilite a opção *Less secure app access*.

O serviço usa a biblioteca [nodemailer](https://nodemailer.com/about/) para enviar e-mails.
Dentro do seu código, configure o *transport* conforme definido a seguir:

```javascript
const transport = nodemailer.createTransport({
  host: 'smtp.gmail.com',
  port: 465,
  secure: true,
  auth: {
    user: EMAIL,
    pass: EMAIL_PASSWORD
  }
})
```

As variáveis **EMAIL** e **EMAIL_PASSWORD** são, respectivamente, a conta criada e a senha.

#### Do Serviço de validação de e-mail

O microserviço também permite que seja feita uma análise que verifica a validade do e-mail com o objetivo
de tentar garantir que o e-mail realmente existe.

A empresa [IPQUALITYSCORE](https://www.ipqualityscore.com/documentation/email-validation/overview)
fornece um serviço que verifica a validade de um e-mail. Crie uma conta e será informado o valor da API_KEY (a chave é enviada por email) necessária para acessar este serviço.

### Variáveis de ambiente

O arquivo *.env* localizado dentro do diretório *ms_email* deve conter:

```bash
RABBITMQ_URL=amqps://...

EMAIL=conta.criada.por.voce@gmail.com

EMAIL_PASSWORD=senha_da_conta_criada_por_voce

IPQUALITYSCORE_API_KEY=MiE2oGCMde7kkkaaacccJ7oB1hWKXdNF
```

A variável `RABBITMQ_URL` indica o endereço de acesso do serviço de mensagens do software **RabbitMQ**. O microserviço lê e envia mensagens por meio deste software.

### Durante o desenvolvimento

Em um terminal, digite `npm install` para instalar as bibliotecas utilizadas pelo microserviço.

Para iniciar o desenvolvimento digite `npm start`.

Sempre que um arquivo for alterado e salvo o microserviço irá reiniciar automaticamente graças ao software *nodemon*.

### Em produção

Depois que o código do microserviço está pronto é preciso gerar a **imagem docker**. Para isso, acesse um terminal, vá para o diretório raiz do projeto e digite (note o ponto no final do comando):

`docker build -t ms_email_app_email .`

No comando acima o nome da imagem docker será **ms_email_app_email**.

### Executando o microserviço em produção

Para executar o microserviço em modo produção é preciso instanciar um container a partir da imagem gerada no comando acima. Abra um terminal e digite:

`docker run -d --name ms_email_app_email --env-file .env ms_email_app_email`

No comando acima, o nome do container é igual ao nome da imagem e o arquivo `.env` está localizado no diretório onde o comando é executado.
