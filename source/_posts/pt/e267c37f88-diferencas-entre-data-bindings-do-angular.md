title: Diferenças entre os data bindings do AngularJS
lang: pt
date: 2015-09-07 02:43:30
type: angular
tags:
- scope
- api
---

O framework fornece 3 formas distintas de criar um trecho de código dinâmico, que é atualizado automaticamente quando
os dados mudam.

<!-- more -->

Antes de ver a sintaxe, uma coisa é importante lembrar: o AngularJS não escreve o conteúdo HTML de uma expressão ao
atualizar o DOM. Em vez disso, ele usa o resultado como texto puro. Então, qualquer expressão que retornar HTML vai
ter seu valor expresso em forma de texto, sem a marcação.

## Usando chaves: {% raw %}{{ }}{% endraw %}

Esse é formato mais comum. Simplesmente escreva uma expressão entre chaves duplas: {% raw %}“{{” e “}}“.{% endraw %}

```
<div>{{ model.property }}</div>
```

A sintaxe de chaves não serve só para atualizar o conteúdo das tags; ela pode ser usada dentro de valores de atributos
também:

## Usando um atributo: ng-bind

Em alguns casos pode ser necessário usar um atributo da tag para expressar seu conteúdo. O resultado é o mesmo do
primeiro exemplo, só a forma de escrever que muda:

```
<div ng-bind="model.property"></div>
```

## Usando um atributo para exibir HTML: ng-bind-html

Finalmente, temos o caso em que precisamos exibir HTML gerado dinamicamente. Um exemplo de uso é a renderização de
Markdown. Nesse caso, é necessário carregar um módulo a mais na aplicação, chamado ngSanitize.

A sintaxe é semelhante à segunda, porém o nome do atributo muda:

```
<div ng-bind-html="model.property"></div>
```

Leia também a documentação do módulo para ver mais detalhes.

## Casos especiais

Além dessas três formas, ainda tem uma outra, com poucos casos de uso: ngBindTemplate.
Nesse formato, podemos usar mais de uma interpolação na mesma expressão. Quando o AngularJS encontra um binding de
chaves dentro do texto de uma tag, esse trecho é substituído por uma tag SPAN. O problema é que algumas tags HTML
não podem conter outras tags dentro delas, como OPTION e TITLE. Para esses casos, usamos o atributo, como no exemplo
abaixo:

```
<html ng-app="my-app">
<head>
	<title ng-bind-template="{{page.title}} - {{site.name}}"></title>
	<!-- ...  -->
</head>
<body>
	<!-- ...  -->
</body>
</html>
```

Todos esses detalhes podem ser vistos na documentação. Os links estão abaixo:

 - https://code.angularjs.org/1.2.12/docs/api/ng.directive:ngBind
 - https://code.angularjs.org/1.2.12/docs/api/ng.directive:ngBindHtml
 - https://code.angularjs.org/1.2.12/docs/api/ng.directive:ngBindTemplate
