(function(){

	'use strict';

	var ytPlayer = {
		bindings: {
		  videoid: '<'
		},
		controller: ['$window',function($window){


			this.$onInit = function() {
				this.player;
				$window.onYouTubeIframeAPIReady();
			};

			$window.onYouTubeIframeAPIReady = function () {

				this.player = new YT.Player('player', {
				  height: '390',
				  width: '640',
				  videoId: this.videoid
				  // events: {
				  //   'onReady': onPlayerReady,
				  //   'onStateChange': onPlayerStateChange
				  // }
				});

			}.bind(this);


		}],
		template:'<div id="player"></div>'
	};

	angular
		.module('components.yt')
		.component('ytPlayer', ytPlayer);

}());