(function(){

	'use strict';

	var ytPlaylist = {
		bindings: {
			list: '<'
		},
		controller: 'ListCtrl',
		templateUrl: './yt.list.template.html'
	};

	angular
		.module('components.yt')
		.component('ytPlaylist', ytPlaylist)
		.config(Playlist);

		Playlist.$inject = ['$stateProvider', '$locationProvider'];
		function Playlist($stateProvider, $locationProvider){
			$stateProvider
				.state('list',{
					url: '/playlist?page',
					component: 'ytPlaylist',
					params: {
						page: {
							value: null,
							squash: true
						}
					},
					resolve: {
						list: ['PlaylistService', '$transition$','$stateParams' , function(PlaylistService, $transition$, $stateParams, pagingToken) {
							if($stateParams.page){
								return PlaylistService.getList($transition$.params().page);
							}else{
								return PlaylistService.getList();
							}
						}]
					}
				});

			// use the HTML5 History API
			$locationProvider.html5Mode(true);
		}

}());