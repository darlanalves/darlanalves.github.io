$(function() {
	'use strict';
	var loader = new Uloader();

	loader.load(['https://ajax.googleapis.com/ajax/libs/angularjs/1.4.5/angular.min.js']).then(function() {
		$('[ng-app]').each(function() {
			var appName = $(this).attr('ng-app') || 'ng';
			angular.bootstrap(this, [appName]);
		});
	});
});
