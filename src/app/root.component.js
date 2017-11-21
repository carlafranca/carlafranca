/*global angular */
(function(){

	'use strict';

	var root = {
		templateUrl: './root.html'
	};

	angular
		.module('root')
		.component('root', root)
		.config(AppConfig);

		AppConfig.$inject = ['$stateProvider', '$urlRouterProvider','$locationProvider'];

		function AppConfig($stateProvider, $urlRouterProvider, $locationProvider) {
			$stateProvider
				.state('app', {
					redirectTo: 'list',
					url: '/',
					component: 'root'
				});

			$urlRouterProvider.otherwise('/');

			// use the HTML5 History API
			$locationProvider.html5Mode(true);
		}
}());