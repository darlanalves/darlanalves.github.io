title: 'Uma forma organizada de usar o $stateProvider'
lang: pt
date: 2015-09-08 21:40:26
type: angular
tags:
- states
- route
---

Configurar as rotas é uma coisa bem comum nos aplicativos web. Uma das bibliotecas mais usadas para esse propósito
é a ui-router. Já tentou organizar a declaração de rotas de algum jeito diferente do padrão?

<!-- more -->

Nos artigos sobre a biblioteca, ou na própria documentação, vemos exemplos de uso do $stateProvider para declarar
estados da aplicação e controllers/templates ligados a esses estados. Mas será que existem formas melhores de fazer
isso?

Vamos ver primeiro um exemplo de como normalmente usamos o $stateProvider:

```
angular.module('app').config(function ($stateProvider) {

	$stateProvider.state('home', {
		url: '',
		templateUrl: 'views/home.html',
		controller: 'HomeController'
	});

	$stateProvider.state('contact-list', {
		url: '/contacts',
		templateUrl: 'views/contacts/list.html',
		controller: 'ContactListController'
	});

	// ...
});
```

Note que estamos repetindo a chamada do método $stateProvider.state para cada estado que precisamos declarar.
Além disso, eu considero o código um tanto ruim de ler rapidamente.

Nos apps que eu desenvolvo, adotei um padrão simples e que ajudou na organização das configurações de estados.
A diferença é pequena, mas significativa, pois eu consigo ver claramente o objeto de configuração e o nome do estado
ligado à essa rota.

Veja como eu declaro os estados:

```
angular.module('app').config(function ($stateProvider) {
	var states = {
		'home', {
			url: '',
			templateUrl: '/views/home.html',
			controller: 'HomeController'
		},

		'contact-list': {
			url: '/contacts',
			templateUrl: '/views/contacts/list.html',
			controller: 'ContactListController'
		}
	};

	angular.forEach(states, function (config, name) {
		$stateProvider.state(name, config);
	});
});
```

Ao longo do tempo esse arquivo vai crescer bastante. Ter uma visão rápida e alinhada dos nomes de estados torna a
leitura mais confortável em arquivos longos. Concorda?

