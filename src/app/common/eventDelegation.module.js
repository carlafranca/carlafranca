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
