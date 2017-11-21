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

}());