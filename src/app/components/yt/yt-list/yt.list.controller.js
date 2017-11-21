(function(){

	'use strict';

	function ListCtrl(PlaylistService, $state, $stateParams){

		this.param = $stateParams.page;

		this.videoDetail = function(item){
			$state.go('video', {video: item.item.videoId, page : this.param});
		};

	}

	angular
		.module('components.yt')
		.controller('ListCtrl', ListCtrl);

}());