angular.module('templates', []).run(['$templateCache', function($templateCache) {$templateCache.put('./root.html','<div ui-view><span class="loader">Loading...</span></div>');
$templateCache.put('./yt.videodetail.template.html','<a ui-sref="list({page: $ctrl.video.pgparam})" tabindex="0" class="yt-video__link yt-btn smooth-effect icon-before" data-icon="&#xf053;">Back to list of videos</a><div class="yt-video yt"><header class="yt-video__header"><h1 class="yt-video__title yt__title">{{ ::$ctrl.video.video.title }}</h1><p class="yt-video__date yt__date">Published on <span>{{ ::$ctrl.video.video.date }}</span></p></header><div class="yt-video__body"><yt-player class="yt-video__player" videoid="::$ctrl.video.video.videoId"></yt-player><div class="yt-video__desc yt__desc">{{$ctrl.desc}} <a ng-if="$ctrl.desc.length >= ($ctrl.initLimit - 1)" role="button" href="" ng-click="::$ctrl.readMore(); $event.stopPropagation();" class="yt-video__readmore">{{$ctrl.readMoreLabel}}</a></div></div></div>');
$templateCache.put('./yt.item.template.html','<figure class="yt-card__media"><img class="evt__target smooth-effect" role="button" tabindex="0" aria-label="watch {{::$ctrl.item.title}}" alt="" ng-src="{{ ::$ctrl.item.thumbs.medium.url }}"></figure><div class="yt-card__body"><h2 class="yt-card__title yt__title"><a href="" class="evt__target icon-after" role="button" data-icon="&#xf054;" ng-bind="::$ctrl.item.title"></a></h2><p class="yt-card__date yt__date">Published on <span ng-bind="::$ctrl.item.date"></span></p><p class="yt-card__desc yt__desc" ng-bind="::$ctrl.item.descTruncated"></p></div>');
$templateCache.put('./yt.list.template.html','<header class="yt-header"><h1 class="yt-header__title">My YouTube playlist</h1></header><yt-paging item="$ctrl.list" pos="top"></yt-paging><main><ul class="list-unstyled" evt-delegate="{selector: \'.evt__target\', action: \'videoDetail\', paging: $ctrl.param}"><li ng-repeat="item in $ctrl.list.items track by item.id" data-id="{{$index}}"><yt-item item="item" class="yt-card yt"></yt-item></li></ul></main><yt-paging item="$ctrl.list" pos="bottom"></yt-paging>');
$templateCache.put('./yt-paging.template.html','<nav aria-label="pagination {{$ctrl.pos}}" class="yt-paging"><button ng-class="{\'yt-paging__btn-disabled\': $ctrl.item.prevPageToken == undefined}" class="yt-paging__btn yt-btn smooth-effect" ng-click="$ctrl.paging($ctrl.item.prevPageToken);">Prev</button> <button ng-class="{\'yt-paging__btn-disabled\': $ctrl.item.nextPageToken == undefined}" class="yt-paging__btn yt-btn smooth-effect" ng-click="$ctrl.paging($ctrl.item.nextPageToken);">Next</button></nav>');}]);