(function(){

	'use strict';

	var ytPaging = {
		bindings: {
			item: '<',
			pos: '@'
		},
		controller: ['PlaylistService', '$state', function(PlaylistService, $state, $cacheFactory){
			this.paging = function(pagingToken){
				PlaylistService.getList(pagingToken).then(function(data){
					$state.go('list', {page: pagingToken}, {notify: false});
				}.bind(this));
			};
		}],
		templateUrl: './yt-paging.template.html'
	};

	angular
		.module('components.yt')
		.component('ytPaging', ytPaging);

}());