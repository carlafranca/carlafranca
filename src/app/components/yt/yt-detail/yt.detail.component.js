(function(){

	'use strict';

	var ytDetails = {
		bindings: {
			video: "<"
		},
		controller: function(){},
		templateUrl: './yt.videodetail.template.html'
	};

	angular
		.module('components.yt')
		.component('ytDetails', ytDetails)
		.config(Video)
		.run(function() {
			var tag = document.createElement('script');
			tag.src = "https://www.youtube.com/iframe_api";
			var firstScriptTag = document.getElementsByTagName('script')[0];
			firstScriptTag.parentNode.insertBefore(tag, firstScriptTag);
		});

		Video.$inject = ['$stateProvider', '$locationProvider'];

		function Video($stateProvider, $locationProvider){
			$stateProvider
				.state('video',{
					url: '/watch?:video&page',
					component: 'ytDetails',
					params: {
						page: {
							value: null,
							squash: true
						}
					},
					resolve: {
						video: ['PlaylistService', '$transition$', function(PlaylistService, $transition$) {
							return PlaylistService.getVideoById($transition$.params().video, $transition$.params().page);
						}]
					}
				});

			// use the HTML5 History API
			$locationProvider.html5Mode(true);
		}

}());