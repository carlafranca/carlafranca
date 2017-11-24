/**
 *
 * @name evtDelegate
 *
 *
 * @description
 *
 * Event Delegation directive.
 * This directive accept an object with the event settings.
 * {selector="trigger as class", action = "function to be called on controller", item = 'info to be passed to the function', [,eventType] },
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
					item = evtObject.item;

				//This should be converted to vanila JS
				//Using jquery for prototype
				iElem.on(eventType+'.evtDelegate', selector, function(e){

					e.preventDefault();

					//Due to using debugInfoEnabled(false) disabled the scope()
					//Item should be passed via directive attr obj

					//If item can't be passed via directive I added the solution below
					//to pass the item index.
					//This should be improved to a more reusable solution
					if(!item){
						var eleId = $(e.target).parents('[data-id]').attr('data-id');
						item = scope.$ctrl.list.items[eleId];
					}

					//Call function(action) in controller and pass the item
					scope.$ctrl[action](item);

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
	angular.module('utils')
		.directive('evtDelegate', evtDelegate);

}());
