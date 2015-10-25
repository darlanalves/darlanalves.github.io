title: Usando $http no AngularJS
lang: pt
date: 2015-09-08 21:47:25
type: angular
tags:
- api
---
O AngularJS vem com um serviço essencial nos apps SPA: $http. Ele fornece uma API para fazer requisições AJAX. Mas o
que ele pode fazer além disso?

<!-- more -->

Nos casos mais simples, só executar uma requisição e pegar seu resultado já é suficiente. O serviço fornece alguns
métodos para fazer as requisições HTTP mais comuns: .get(), .post(), .put(), .delete(), .head() e .patch(). Também
há um método para requisições “JSON-with-padding”, o .jsonp(). Em todos os casos, o último parâmetro é um objeto
(opcional) com algumas configurações menos comuns.

Na maioria dos casos você só vai precisar executar um desses métodos e usar o valor retornado por eles: uma Promise.

Veja alguns exemplos de uso desse serviço:

```
// request com o verbo GET
$http.get('/some/url').then(function(response) {
    // response é um objeto se a resposta do servidor estiver no formato JSON
});

// postando dados
var profile = {
    name: 'John Doe',
    email: 'foo@email.com'
};

$http.post('/form/signup', profile).then(function() {
    alert('OK!');
});

// passando parâmetros para GET (como em uma busca)
var config = {};
config.params = {
    keywords: 'foo'
};
$http.get('/search', config).then(/* ... */);
// executa uma request GET no endereço "/search?keywords=foo"
```

## Cache de respostas

O framework também vem com um serviço de cache bem simples, o $cacheFactory. Ele pode ser usado para criar um cache
local do conteúdo carregado no $http. Isto pode ser muito útil para evitar chamadas desnecessárias ao backend.

Por exemplo, digamos que nós temos um recurso, disponível na URL “/resource/:id”, e um serviço para buscar este
recurso. Se os dados não mudam com frequência, podemos usar uma instância do cache para evitar requests desnecessárias:

```
angular.factory('ResourceService', function($cacheFactory, $http) {
    var resourceCache = $cacheFactory('resource');

    function getResource(id) {
        return $http.get('/resource/' + id, {
            cache: resourceCache
        });
    }

    return {
        getResource: getResource
    };
});

// ...
// chamadas consecutivas a esse método com o mesmo ID vão usar
// os dados que estão no cache em vez de buscar novamente no backend
ResourceService.getResource(123).then(/* ... */);
```

O próprio AngularJS faz uso desse esquema de cache ao carregar os templates usados nas diferentes páginas do
aplicativo. Após carregado, via AJAX, um template é salvo em um cache chamado $templateCache.
