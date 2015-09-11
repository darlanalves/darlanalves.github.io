title: 'Module reveal pattern com AngularJS'
lang: pt
date: 2015-09-08 22:15:10
type: angular
tags:
- patterns
---

Ao escrever *services* no AngularJS, um pattern conhecido como "Module Reveal" é muito utilizado. Você talvez até tenha
usado sem saber.

<!-- more -->

Esse pattern é uma técnica usada para esconder funções usadas localmente no serviço ou propriedades, deixando público
só o que representa a API ou a interface de um serviço.

Para exemplificar, vamos criar um serviço que controla sessão e faz login/logout de um usuário. Primeiro, vou escrever
somente o "esqueleto" do que vai ser o código:

```
function AuthService() {
	var $logged = false;

	function login(email, password) {}
	function logout() {}
	function isLogged() {}
}

```

Olhando para esse trecho, dá pra ver que o *service* vai receber um email e senha para autenticar um usuário, tem um
método para encerrar a sessão e outro que retorna se alguém executou o login.

Até agora, esse serviço ainda não é válido, pois nossa função não retorna nem associa essas funções com nenhum valor.
Uma forma de tornar esse serviço válido seria associando cada função com a instância atual do serviço, como está abaixo:

```
function AuthService() {
	var $logged = false;

	this.login = function login() {};
	this.logout = function logout() {};
	this.isLogged = function isLogged() {};
}

```

No trecho acima, todas as funções estão expostas no serviço para uso em outro lugar. Porém, tem uma forma de fazer isso
que eu gosto de usar em todo serviço que eu escrevo. Em vez de associar uma a uma cada propriedade, eu crio a "interface"
inteira do serviço de uma vez só.

Continuando o exemplo acima, vamos adicionar uma função que valida o email informado. Também vamos executar `logout()`
antes de efetuar um novo login. Note que eu vou usar as funções dentro do próprio serviço e também exportar algumas
delas como interfaces "públicas" do nosso serviço:


```
function AuthService() {
	var $logged = false;

	function checkEmail(email) { /* ... */ }

	function login(email, password) {
		if (!checkEmail(email)) return false;

		logout();

		/* ... */

		$logged = true;
	}

	function logout() { /* ... */ }

	function isLogged() { return $logged; }

	return {
		login: login,
		logout: logout,
		isLogged: isLogged
	};
}

```

Ao final da *factory* `AuthService` eu retornei um objeto que será a API pública desse serviço. Essa técnica de
"revelar" somente algumas propriedades ou métodos é o que chamamos de __Module Reveal__ pattern.

Pronto! Agora você já sabe mais um design pattern! Toca aqui \o.
