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
					item = evtObject.item;

				//This should be converted to vanila JS
				//Using jquery for prototype
				iElem.on(eventType+'.evtDelegate', selector, function(e){

					e.preventDefault();

					//using debugInfoEnabled(false) disabled the scope()
					//in this case plus not passing the item via the directive
					//use the solution below (should make it more reusable)
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
	angular.module('eventDelegation', [])
		.directive('evtDelegate', evtDelegate);

}());
