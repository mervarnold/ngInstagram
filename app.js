'use strict';

angular.module('ngInstagram', ['ngAnimate'])
	.controller('mainCtrl', function($scope, $http, $sce, $timeout) {

		$scope.searching = false;
		$scope.photos = [];

		$scope.search = function(tag) {

			$scope.searching = true;
			$scope.savedTag = $scope.tag;
			$scope.tag = '';
			$scope.searchForm.$setPristine();
			$scope.photos = [];

			$http({
				method: 'JSONP',
				url: 'https://api.instagram.com/v1/tags/' + tag + '/media/recent',
				params: {
					callback: 'JSON_CALLBACK',
					client_id: '00acd288251946e4a843a8332ad470b4'
				}
			})
			.success(function(data, status) {

				if (data.meta.code != 200) {
					$scope.searching = false;
					alert('There was an error. Please try again.');
					return;
				}

				for (var i = 0; i < data.data.length; i++) {
					$scope.photos.push({
						file: data.data[i].images.standard_resolution.url,
						page: $sce.trustAsResourceUrl(data.data[i].link)
					});
				}

				$scope.finished();

			})
			.error(function() {
				$scope.finished();
				alert('There was an error. Please try again.');
			})
						
			//Make sure the loading screen is visible for at least some time
			$scope.finished = function() {
				$timeout(function() {
					$scope.searching = false;
				}, 1500);
			}
		}
	});