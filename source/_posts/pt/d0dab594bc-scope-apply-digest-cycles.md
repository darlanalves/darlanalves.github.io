title: 'Escopos, $apply(), $digest e digest cycle'
lang: pt
date: 2015-09-08 21:35:09
type: angular
tags:
- scope
- api
---

Uma das coisas mais fantásticas do AngularJS é a “mágica” que ele faz entre o modelo e a view, atualizando os dados no
DOM sempre que o modelo é alterado. Isso acontece através de uma técnica chamada dirty checking. Mas como isso funciona?

<!-- more -->

Dirty checking é um processo usado para verificar alterações em um valor, seja ele parte de um objeto ou o resultado
de uma expressão. No AngularJS, funciona assim: o framework calcula e salva o valor de uma expressão e compara com o
valor salvo anteriormente. Se os valores forem diferentes, ele marca essa expressão como “dirty”, ou suja.
Esse processo acontece em todos escopos ligados à página atual, partindo da raiz da aplicação, ou seja, o $rootScope.
Ao final do processo, se alguma expressão dirty for encontrada, o ciclo é reiniciado, até que todas as expressões não
tenham mais modificações.

Esse processo continua até que todos os valores estabilizem, o que pode facilmente gerar um loop infinito. Para que
isso não aconteça, dois cuidados foram tomados, que vamos conferir a seguir:

### 1. limite de ciclos executados

Para evitar um loop infinito, o framework limita o número de ciclos a 10 iterações. Após isso o framework vai
lançar uma exceção como essa:

```
10 $digest() iterations reached. Aborting!
Watchers fired in the last 5 iterations: ...
```

Este valor pode ser alterado se necessário, mas precisa de uma boa justificativa.

### 2. $apply ou $digest não podem ser executados durante um ciclo

Os métodos de escopo que invocam um ciclo de verificações não podem ser chamados se um ciclo já está em execução.

Mas o que é exatamente `$apply()`?

Todas as coisas que acontecem dentro do “mundo do AngularJS” invocam esse método depois de executadas, sejam elas um
event handler (como o ng-click) ou serviços do framework (como $http ou $timeout). Isso significa que: toda ação que
o usuário ou algum serviço executar vai iniciar um novo digest cycle, caminhando por todos os escopos e verificando
alterações. Logo, tudo que acontece através do framework já atualiza a view de forma automática.

No entanto, em alguns casos, nós executamos coisas que o AngularJS não sabe. Somente nesses casos é que usamos
$scope.$apply(), para avisar o framework que alguma coisa mudou. Um exemplo disso é uma integração de plugins jQuery
com o sistema de diretivas do AngularJS. O plugin não tem conhecimento do framework, e vice-versa. Sempre que
alguma coisa muda no plugin, nós precisamos notificar o Angular desta alteração.

## Recapitulando

Tudo que acontece no modelo passa por uma verificação de modificações, ou dirty checking, que atualiza a view se
necessário. Em alguns casos, precisamos iniciar um ciclo manualmente, através do método $apply().

## Quando usar $digest

Este método tem a mesma função que $apply, com uma diferença importante: ele parte do escopo em que foi chamado,
não da raiz do aplicativo. Isso é mais eficiente, já que a verificação vai ser feita em menos objetos.
Este detalhe pode ser bem útil para realizar otimizações no aplicativo.
