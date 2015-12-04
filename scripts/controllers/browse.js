'use strict';

app.controller('BrowseController', function($scope, $routeParams, toaster, Task, Auth, Comment, Offer, $http, NgMap) {

	$scope.map = '';
	$scope.searchTask = '';		
	$scope.tasks = Task.all;

	$scope.user = Auth.user;
	$scope.signedIn = Auth.signedIn;

	$scope.listMode = true;

	if($routeParams.taskId) {
		Task.getTask($routeParams.taskId).$asObject().$loaded().then(function(task) {
			$scope.listMode = false;
			setSelectedTask(task);
			});
		}
		
	NgMap.getMap().then(function(map) {
  
  	});
	
	function setSelectedTask(task) {
		$scope.selectedTask = task;
	
		if($scope.signedIn()) {
			
			Offer.isOfferred(task.$id).then(function(data) {
				$scope.alreadyOffered = data;
			});

			$scope.isTaskCreator = Task.isCreator;
			$scope.isOpen = Task.isOpen;	
			
			$scope.isAssignee = Task.isAssignee;
			$scope.isCompleted = Task.isCompleted;

		}
		
		$scope.comments = Comment.comments(task.$id);
		$scope.offers = Offer.offers(task.$id);	
		$scope.block = false;	
		$scope.isOfferMaker = Offer.isMaker;

		
	};

	$scope.cancelTask = function(taskId) {
		Task.cancelTask(taskId).then(function() {
			toaster.pop('success', 'This task is cancelled successfully.');
		});
	};

	$scope.addComment = function() {
		var comment = {
			content: $scope.content,
			name: $scope.user.profile.name,
			gravatar: $scope.user.profile.gravatar
		};

		Comment.addComment($scope.selectedTask.$id, comment).then(function() {				
			$scope.content = '';		
		});		
	};

	$scope.makeOffer = function() {
		var offer = {
			total: $scope.total,
			uid: $scope.user.uid,			
			name: $scope.user.profile.name,
			gravatar: $scope.user.profile.gravatar 
		};

		Offer.makeOffer($scope.selectedTask.$id, offer).then(function() {
			toaster.pop('success', 'Your offer has been placed');
			$scope.alreadyOffered = true;
			$scope.total = '';
			$scope.block = true;			
		});		
	};

	$scope.cancelOffer = function(offerId) {
		Offer.cancelOffer($scope.selectedTask.$id, offerId).then(function() {
			toaster.pop('success', 'Your offer has been cancelled');
			$scope.alreadyOffered = false;
			$scope.block = false;			
		});
	};

	$scope.acceptOffer = function(offerId, runnerId) {
		Offer.acceptOffer($scope.selectedTask.$id, offerId, runnerId).then(function() {
			toaster.pop('success', 'You have accepted an offer')
		});
	};

	$scope.completeTask = function(taskId) {
		Task.completeTask(taskId).then (function() {
			toaster.pop('success', 'Task Complete');
		});
	};

 });
	
