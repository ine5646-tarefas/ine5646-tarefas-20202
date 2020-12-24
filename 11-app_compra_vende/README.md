# UFSC - CTC - INE - INE5646 Programação para Web :: Exercício Apps Compra e Vende

Este exercício é composto de duas aplicações para web independentes. Uma delas é destinada ao usuário que deseja comprar produtos e a outra ao usuário que deseja vender produtos.

O usuário comprador pode enviar vários pedidos de compra ao usuário vendedor. Em cada pedido, ele especifica o nome do produto desejado e a quantidade.

O usuário vendedor tem acesso aos pedidos e define os preços que deseja cobrar.

O usuário comprador pode então verificar as cotações (preços) para os pedidos de compra.

## Objetivo do Exercício

Este exercício explora a situação onde duas aplicações para web independentes precisam trocar dados. E, por serem independentes, não há nenhuma garantia que ambas estejam funcionando no momento da troca de dados. No exercício as aplicações trocam dados por meio de uma **fila de mensagens**. Ambas enviam e consomem mensagens usando o software [RabbitMQ](https://www.rabbitmq.com/), que implementa o protolo **Advanced Message Queuing Protocol** [AMQP](https://www.amqp.org/).

Ambas as aplicações utilizam o serviço de troca de mensagens fornecido pela empresa [CloudAMQP](https://www.cloudamqp.com/).

## Bug do Exercício

Não há nenhum bug no exercício. Sua tarefa é compreender como as duas aplicações interagem e disponibilizá-las no Heroku.

## Instruções

Acesse o serviço CloudAMQP, crie uma conta, selecione um plano gratuito e por fim crie uma instância. Preste atenção no endereço (`amqp://...`) que dá acesso a essa instância. Este endereço deverá ser usado nas duas aplicações.

Em cada aplicação, o arquivo *README.md* contém instruções específicas sobre como editar e colocar no ar o código.

## Colocando no ar via docker-compose

O programa *docker-compose* pode ser usado para colocar no ar as duas aplicações na sua máquina local. Para isso abra um terminal na raiz deste exercício e digite `docker-compose up`. As aplicações poderão então serem acessadas por meio dos endereços `https://localhost:3100` (app_compra) e `https://localhost:3200` (app_venda).
