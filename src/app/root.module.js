/*global angular */
(function(){

	'use strict';

	angular
		.module('root', [ 'ui.router', 'components', 'templates'])
		.config(RootConfig);

		RootConfig.$inject = ['$compileProvider' , '$httpProvider', '$locationProvider'];

		function RootConfig($compileProvider, $httpProvider, $locationProvider){
			//push $http request resolve (within 10ms) into one queu(sigle digest) to reduce digest cicle
			$httpProvider.useApplyAsync(true);
			//improve page load removing extra classes/attr used by Angular for testing
			$compileProvider.debugInfoEnabled(true);
			$compileProvider.onChangesTtl();
			$compileProvider.commentDirectivesEnabled(false);
            $compileProvider.cssClassDirectivesEnabled(false);
		}

}());