title: $rootScope vs $scope
lang: pt
date: 2015-09-08 21:33:30
type: angular
tags:
- scope
- api
---
Uma das coisas que todo front precisa entender sobre o AngularJS é o funcionamento dos escopos, pois eles são parte
da “mágica” do two-way binding.

<!-- more -->

## O que é

Todo aplicativo começa em um elemento raiz, chamado $rootElement, onde também começa uma hierarquia de objetos que
relacionam-se em forma de árvore.

O mais importante a se entender sobre escopos é a herança por protótipo, que é um recurso da linguagem Javascript e
não do framework. Todo escopo do aplicativo (exceto os isolados) herda características do escopo que o originou, e
todos os escopos herdam de ou apontam para o $rootScope.

DICA: já que todos os escopos herdam valores do $rootScope, não é uma boa prática associar coisas ao $rootScope, já
que esses dados são propagados no aplicativo inteiro. Se você estiver usando um código como esse, tome bastante cuidado:

```
// ...
$rootScope.name = value;
```

## Scope

O constructor interno do AngularJS, chamado Scope, é a base de todos os escopos do aplicativo, e tem alguns métodos no
seu protótipo. Os mais importantes são $watch, $watchCollection, $on, $emit e $broadcast. Os detalhes de cada um deles
pode ser visto na documentação oficial.

## $rootScope

O $rootScope é uma instância de Scope, criado quando o aplicativo é executado. Todo escopo da aplicação terá uma ligação
com essa instância, direta ou indiretamente.

## $scope

Todo elemento da página dentro de um aplicativo com AngularJS está ligado a um escopo.

O framework fornece algumas formas de interagir com esses objetos, e uma delas é o Controller. O escopo na verdade é
uma “cola” entre o DOM (View) e o modelo de dados (Model). Por isso, dizemos que o AngularJS é um framework
MVVM (Model, View e View-Model). Diferentemente do modelo MVC, em que o Controller é uma camada independente,
no AngularJS temos um controller que somente aumenta as propriedades do escopo.

Além dos controllers, temos um elemento especial framework, chamado de diretiva, que também tem o poder de interagir
com esses objetos, ou até requisitar um novo escopo para si, criando uma nova árvore de propriedades herdadas.

## Isolated Scope

Algumas diretivas podem requisitar um tipo especial de escopo, que não herda propriedades do $rootScope. Essas
diretivas ainda têm ligação com o root, somente a herança por protótipo que muda.

Esse tipo de isolamento é muito útil quando criamos componentes reusáveis para nossos apps. Para poder criar componentes
que não conhecem o ambiente ao seu redor, mas que ainda possam interagir com os escopos, deve-se usar o sistema de eventos do escopo.
