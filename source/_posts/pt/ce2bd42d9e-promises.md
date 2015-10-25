title: Promises
lang: pt
date: 2015-09-08 21:45:41
type: angular
tags:
- promises
- api
---
Promise não é um conceito novo do AngularJS. Elas já existiam em libs como o jQuery antes do framework nascer.
No entanto, entendê-las é essencial para desenvolver web apps.

<!-- more -->

Promise é exatamente o que este termo significa: uma promessa! Quando trabalhamos com requisições HTTP ou com
callbacks, as coisas podem dar certo ou errado em um momento futuro que desconhecemos. Para exemplificar, vamos
crirar uma história e pensar em um análogo do dia a dia: a previsão do tempo.

Hoje pela manhã eu precisei tomar uma decisão: sair de casa com ou sem guarda-chuva. Quando eu olhei pela janela, o
tempo parecia bom, mas tinha algumas nuvens indicando que eu poderia me enganar. Pra me garantir, já que eu tenho
um azar pra essas coisas, seria melhor verificar a previsão do tempo e pensar nas possibilidades, ou em linguagem
de programador, tratar as exceções.

Vamos tentar escrever essas possibilidades em forma de um objeto Promise, tratando a exceção. O AngularJS já vem
com uma implementação das Promises, em um serviço chamado $q. Este serviço tem um método, chamado defer, que retorna
um objeto Deferred. É com ele que vamos criar nossa “promessa”:

Service: PrevisaoDoTempo

```
angular.module('myApp').factory('PrevisaoDoTempo', function ($q) {

    function previsaoDoTempo() {
        // método mágico que verifica a previsão do tempo em algum lugar

        return {
            temperatura: 20,
            umidade: 40,
            chuva: false
        };
    }

    function hojeTemTempoBom() {
        var deferred = $q.defer();

        previsao = previsaoDoTempo();

        if (previsao.chuva === false) {
            deferred.resolve(previsao);
        } else {
            deferred.reject(previsao)
        }

        return deferred.promise;
    }

    return {
        hojeTemTempoBom: hojeTemTempoBom
    }

});

```

Controller: PegarGuardaChuva

```
angular.module('myApp').controller('PegarGuardaChuva', function (PrevisaoDoTempo) {
    PrevisaoDoTempo.hojeTemTempoBom().then(function (tempoBom) {

        // esqueça o guarda-chuva, não vai chover hoje!
        // A promessa de tempo bom foi garantida

    }, function (previsaoDeChuva) {

        // Opa! Deu problema no método e a promessa de tempo bom foi rejeitada

    }).finally(function() {
        // Decisão tomada! Agora eu posso sair de casa
    });
});
```

## API em detalhes

### Promise

Nós criamos um serviço para buscar a previsão do tempo. Este serviço tem um método hojeTemTempoBom que retorna uma
Promise. Este objeto retornado (a Promise) também tem alguns métodos. O mais usado é o .then(), que recebe três
argumentos: uma função, que será executada se tudo der certo (vamos chamar de callback), outra função, que será
executada se algum erro ocorrer (vamos chamar de errorback), e finalmente uma função chamada sempre que o
progresso da resolução muda (que vamos chamar de notifier). Este comportamento é análogo a um bloco
try/catch/finally. Existe ainda um callback chamado depois que promise é despachada, tanto com sucesso quanto com erro.

Os argumentos passados para .then() são opcionais. Você pode pular um argumento usando `null`

Como citei anteriormente, a sintaxe da Promise simula o tratamento de exceções. Veja no exemplo abaixo:

```
// método padrão
promise.then(callback, errorback, notifier).finally(cleanup);

// sintaxe alternativa
promise
    .then(callback, null, notifier)
    .catch(errorback)
    .finally(cleanup);

// callback é chamado se tudo ocorrer bem
// errorback é chamado se algum erro ocorrer
// durante a resolução, podemos notificar o progresso através do notifier
// depois da resolução ou rejeição, cleanup é chamado para terminar o processamento
```

### Deferred

Chamando $q.defer() nós criamos um objeto Deferred, que tem 3 métodos: resolve(result), reject(reason) e
notify(progress). Veja os detalhes abaixo:

```
var deferred = $q.defer();

// resolve a Promise, invocando nosso callback
deferred.resolve(result);

// rejeita a Promise, invocando nosso errorback (seria o mesmo que um comando throw)
deferred.reject(error);

// notifica sobre o progresso da Promise
deferred.notify(progress)
```

## Voltando ao controller

No nosso controller eu fiz o tratamento da exceção. Se a previsão do tempo for de sol, nós continuamos para a
 primeira função, deixando o guarda-chuva em casa. Se a previsão for de chuva, consideramos isso como uma “exceção”,
  e vamos pela segunda função para lidar com este caso.

Vou reescrever nosso controller, agora com uma sintaxe que seria executada de forma síncrona. O funcionamento é
equivalente ao da Promise, porém nós usaremos try/catch/finally e uma exceção:

```
angular.module('myApp').controller('PegarGuardaChuva', function (PrevisaoDoTempo) {
    try {
        var tempoBom = PrevisaoDoTempo.hojeTemTempoBom();
        // esqueça o guarda-chuva, não vai chover hoje!
        // A promessa de tempo bom foi garantida
    } catch (previsaoDeChuva) {
        // Opa! Deu problema no método e a promessa de tempo bom foi rejeitada
    } finally {
        // Decisão tomada! Agora eu posso sair de casa
    }
});
```

Vou reescrever também o serviço, para lançar uma exceção em vez de retornar uma Promise:

```
angular.module('myApp').factory('PrevisaoDoTempo', function () {

    function previsaoDoTempo() {
        return {
            temperatura: 20,
            umidade: 40,
            chuva: false
        };
    }

    function hojeTemTempoBom() {
        previsao = previsaoDoTempo();

        if (previsao.chuva === false) {
            return previsao;
        }

        throw new Error('Vai chover!');
    }

    return {
        hojeTemTempoBom: hojeTemTempoBom
    }

});
```

Note que agora tudo é linear: nós pegamos a previsão, retornamos um valor (ou lançamos uma exceção) e o controlador
trata isso de forma linear também.

A vantagem das promises é não ter que esperar pela resposta de um método para continuar. Eventualmente, a resposta
vai existir, e só então nós precisaremos lidar com ela. Dessa forma nossos aplicativos podem responder mais rápido
visualmente, sem ter que travar a tela para o usuário.

## Usando uma cadeia de promessas: Promise chain

A sintaxe de Promise não se limita a um callback. Podemos fazer uma cadeia de funções sendo chamadas em sequência.
Vamos mudar um pouco nosso exemplo e adicionar mais ações ao final da Promise:

```
// considere que esses parâmetros são funções
PrevisaoDoTempo.hojeTemTempoBom()
    .then(deixarGuardaChuva)
    .then(pegarOculosSolar)
    .then(fecharCortinas)

    .catch(pegarGuardaChuva)

    .finally(sairDeCasa);
```

Um detalhe muito importante sobre promise chain: o valor que uma função retorna é passado para a próxima função da
lista. Se uma função que trata erros (no bloco catch) retornar um valor qualquer, a promise NÃO é mais considerada
como rejeitada, voltando para o status de “resolved”. Para tratar uma exceção e continuar rejeitando valores,
precisamos usar uma sintaxe especial. Acompanhe abaixo o uso do método $q.reject():

```
// considere que esses parâmetros são funções
PrevisaoDoTempo.hojeTemTempoBom()
    .then(deixarGuardaChuva)
    .then(pegarOculosSolar)
    .then(fecharCortinas)

    // todas estas funções precisam retornar um valor especial!
    .catch(pegarGuardaChuva)
    .catch(fecharAsJanelas)
    .catch(deixarOsOculos)

    .finally(sairDeCasa);

// exemplo de continuação do erro
function pegarGuardaChuva(previsao) {
    // faça alguma coisa com o erro e continue rejeitando
    return $q.reject(previsao);
}

// exemplo de tratamento de erro (não quer dizer que deixar os óculos vai parar a chuva,
// mas a título de exemplo, digamos que sim)
function deixarOsOculos(previsao) {
    // faça alguma coisa que reverta o problema
    previsao.chuva = false;

    return previsao;
}
```

Uma prática que adotei em quase todos os métodos de serviço é retornar uma Promise. Vamos ver um caso de uso bem
comum: passar um ID para um método e pedir que ele busque um item no backend. Usaremos o serviço $http e uma rota
hipotética “/item/:itemId”.

Se um ID não for passado para o método, retornamos uma Promise rejeitada. Caso contrário, buscamos o item no servidor
e retornamos a própria Promise criada pelo $http:

```
$module.factory('Service', function($q, $http) {
    return {
        getItem: function(id) {
            if (!id) {
                return $q.reject(new Error('Invalid id'));
            }

            return $http.get('/item/' + id);
        }
    };
});

$module.controller('Controller', function(Service) {
    // ...
    Service.getItem(123).then( successFunction, errorFunction );
});
```

## Syntax sugar

Você pode unificar as respostas dos serviços retornando uma Promise em todas as chamadas de métodos. Assim, você não
precisa se preocupar se a resposta vindo do serviço é um erro ou o tipo de dados que você esperava. Você sempre vai
trabalhar com uma promise, mesmo na validação de inputs.

Com esse padrão, no exemplo acima o Controller não precisa se preocupar com mudanças no tipo de resposta do serviço:
ele sempre espera uma Promise, e o serviço trata os erros de forma assíncrona, tornando o fluxo de trabalho mais
uniforme. O “tratamento” da exceção é feito no service, que só mantém regras de validação e negócio, e a interação
com o usuário (exibir uma mensagem, mudar alguma coisa no escopo, …) é feita no controller, que é responsável pela
interação entre a view e a camada de serviço.

Um detalhe interessante: você pode usar outros métodos do serviço $q para retornar promises sempre, seja um resultado
ou um erro. No exemplo abaixo, getFoo() sempre retorna uma Promise:

```
app.factory('FooService', function($q, $http) {
    // assuming you have a cache object like this one
    var internalCache = {};

    // ...
    return {
        getFoo: function(fooId) {
            if (!fooId) {
                return $q.reject(new Error('You forgot fooId'));
            }

            if (fooId in internalCache) {
                return $q.when(internaCache[fooId]);
            }

            return $http.get('/foo/' + fooId);
        }
    };
});
```

## Bônus

- Fiz [um Plunker com algumas variações](http://embed.plnkr.co/bQlNjX/preview) da API de Promises para exemplificar as
 opções fornecidas pelo AngularJS.

- E [outro Plunker](http://embed.plnkr.co/JH3yzRj3eu3O9CboFQF0/preview) demonstrando o tratamento de erros dentro do
Service.

__ In promise we trust! __

