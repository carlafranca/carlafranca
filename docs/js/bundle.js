(function(angular){
'use strict';
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

			   $compileProvider.commentDirectivesEnabled(false);
            $compileProvider.cssClassDirectivesEnabled(false);
		}

}());})(window.angular);
(function(angular){
'use strict';
/**
 *
 * @name evtDelegate
 *
 *
 * @description
 *
 * This directive will add event delegation.
 * It accepts the select as class, the event type,
 * the function it will call and the ele/item to be manipulated
 *
 **/

(function () {

	'use strict';

	function evtDelegate($parse) {

			function link( scope, iElem, iAttrs ) {

				var evtObject = scope.$eval(iAttrs['evtDelegate']),
					eventType = evtObject.eventType || 'click',
					selector = evtObject.selector,
					action = evtObject.action,
					item = evtObject.item || null;


				//This should be converted to vanila JS
				//Using jquery for prototype
				iElem.on(eventType+'.evtDelegate', selector, function(e){

					e.preventDefault();

					var scopeItem = $( e.target ).scope();

					//Call function in controller and pass the item
					scope.$ctrl[action](item || scopeItem.$ctrl);
				});

				scope.$on( "$destroy", function( event ) {
						selector = null;
						iElem.off( eventType+'.evtDelegate' );
				});
			}

			return({
				link: link,
				restrict: 'A'
			});
		}

	evtDelegate.$inject = ['$parse'];
	angular.module('eventDelegation', [])
		.directive('evtDelegate', evtDelegate);

}());
})(window.angular);
(function(angular){
'use strict';
/*global angular */
(function(){

	'use strict';

	angular
		.module('components', ['components.yt']);

}());})(window.angular);
(function(angular){
'use strict';
/*global angular */
(function(){
	'use strict';

	angular
		.module('components.yt', ['ui.router', 'eventDelegation']);

}());})(window.angular);
(function(angular){
'use strict';
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
}());})(window.angular);
(function(angular){
'use strict';
/*global angular */
(function(){
	'use strict';

	angular
		.module('components.yt')
		.factory('PlaylistService', PlaylistService);

	PlaylistService.$inject = ['$http', '$filter', '$window'];

	function PlaylistService($http, $filter, $window){

		var playlist = {};
		var API = 'https://www.googleapis.com/youtube/v3/playlistItems',
			params = {
				key: "AIzaSyCuv_16onZRx3qHDStC-FUp__A6si-fStw",
				playlistId: "PLSi28iDfECJPJYFA4wjlF5KUucFvc0qbQ",
				part: 'snippet,contentDetails,status',
				maxResults: '10'
			};

		function getList(pagingToken){

			//To use with paging component
			if(pagingToken){
				params.pageToken =  pagingToken;
			}

			return $http
					.get(API, {
						params: params
					})
					.then(function(data){

						if (data.data.items.length === 0) {
							return 'No results found!';
						}

						//Filter data to remove deleted videos
						//Using $filter here to reduce $watchs on template (create truncate description).
						playlist.pageInfo = data.data.pageInfo;
						playlist.nextPageToken = data.data.nextPageToken || null;
						playlist.prevPageToken = data.data.prevPageToken || null;

						playlist.items = data.data.items
							.filter(function(item){
								return item.snippet.title !== 'Deleted video';
							})
							.map(function(item){
								var resultList = {};
									resultList.id = item.id;
									resultList.videoId = item.snippet.resourceId.videoId;
									resultList.title = item.snippet.title;
									resultList.thumbs = item.snippet.thumbnails;
									resultList.desc = item.snippet.description;

									resultList.descTruncated = item.snippet.description && $filter('limitTo')(item.snippet.description, 100) +'...';
									resultList.date = $filter('date')(item.snippet.publishedAt);

								return resultList;

							});


						return playlist;

					}, function(data){

						return data;
					});
		}

		function getVideoById(videoId, pagingToken){

			var getResult,
				result = !!(playlist.items) ? getResult() : null,
				videoDetail = $window.localStorage.getItem('detailStore');


			//On reload get data from localStorage.
			//Pass the pagingToken to use in the backlink
			if(videoDetail && angular.fromJson(videoDetail).videoId === videoId){
				return {video: angular.fromJson(videoDetail), pgparam: pagingToken};
			}

			//Loop through playlist and get the specific video
			//Save the video in the localStorage to reuse on load
			function getResult(){
				var result;
				playlist.items.some(function(item) {
					if(item.videoId === videoId){
						$window.localStorage.setItem('detailStore', JSON.stringify(item));
						result = {video: item, pgparam: pagingToken};
					}
				});

				return result;
			}


		   //If there's no data available
		   //Make a call to the api and grab the specific data
			return getList(pagingToken).then(function(data){
				return getResult();
			});

		}

		return{
			getList: getList,
			getVideoById: getVideoById
		};

	}

}());})(window.angular);
(function(angular){
'use strict';
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

}());})(window.angular);
(function(angular){
'use strict';
(function(){
	'use strict';

	var ytItem = {
		bindings: {
			item: '<'
		},
		controller: function(){},
		templateUrl: './yt.item.template.html'
	};

	angular
		.module('components.yt')
		.component('ytItem', ytItem);

}());})(window.angular);
(function(angular){
'use strict';
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

}());})(window.angular);
(function(angular){
'use strict';
(function(){

	'use strict';

	ListCtrl.$inject = ["PlaylistService", "$state", "$stateParams"];
	function ListCtrl(PlaylistService, $state, $stateParams){

		this.param = $stateParams.page;

		this.videoDetail = function(item){
			$state.go('video', {video: item.item.videoId, page : this.param});
		};

	}

	angular
		.module('components.yt')
		.controller('ListCtrl', ListCtrl);

}());})(window.angular);
(function(angular){
'use strict';
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

}());})(window.angular);
(function(angular){
'use strict';
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

}());})(window.angular);