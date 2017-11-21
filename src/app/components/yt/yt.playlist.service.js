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

}());