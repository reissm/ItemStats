angular.module('main', ['ui.bootstrap'])
.config(['$httpProvider', function ($httpProvider) {
	$httpProvider.defaults.useXDomain = true;
    delete $httpProvider.defaults.headers.common['X-Requested-With'];
}])
.controller("MainCtrl", function($scope, mainService){
	$scope.region = "Select Region";
	$scope.matchList = {};
	$scope.curMatch = "";
	$scope.gameType = "NORMAL_5X5";
	$scope.items = {};
	
	$scope.getUserIPInfo = function(){
		mainService.pullData($scope.region, $scope.curMatch, $scope.gameType).then(function(data){
			if(data.data.message == 'invalid query'){
				$scope.ipinfo = {message: data.data.message};
			} else {
				$scope.ipinfo = data.data.participants;
				console.log($scope.ipinfo);
				$scope.items = mainService.pullItemInfo($scope.ipinfo);
			}
		});
	};
	
	$scope.setRegion = function(newR) {
		$scope.region = newR;
		
		mainService.getMatches($scope.region).then(function(data){
			if(data.data.message == 'invalid query'){
				$scope.matchlist = {message: data.data.message};
			} else {
				$scope.matchlist = data.data;
				$scope.curMatch = pickRandomMatch($scope.matchlist);
			}
		});
	};

})
.service("mainService", function($http){
	return {
		pullData: pullData,
		getMatches: getMatches,
		pullItemInfo: pullItemInfo
	};
	
	function pullData(region, curMatch, gameType){
		var apiKey = "4e635d25-7bde-453f-bcd3-8777ef544e7b";
		
		if(region == ("Select Region" || null)){
			region = "na";
		}
		
		region = region.toLowerCase();
		
		var url = 'https://na.api.pvp.net/api/lol/' + region + '/v2.2/match/' + curMatch + '?api_key='+apiKey;
		
		var request = $http({
			method: 'GET',
			url: url
		}).error(function(data){
			alert("Invalid Game ID");
			console.log(data);
		});
		
		return request.then(function(data){
			return data;
		});
	}
	
	function getMatches(region) {
		if(region == ("Select Region" || null)){
			region = "NA";
		}
		var url = 'app/assets/AP_ITEM_DATASET/5.11/RANKED_SOLO/' + region + ".json";
		
		var request = $http({
			method: 'GET',
			url: url
		}).error(function(data){
			alert("Invalid Game ID");
			console.log(data);
		});
		
		return request.then(function(data){
			return data;
		});
	}
	
	function pullItemInfo(players){
		var items = {};
		for(var i = 0; i < players.length; i++){
			for(var j = 0; j < 6; j++){
				items["item"+((i*6)+j)] = players[i].stats["item"+j]
			}
		}
		console.log(items);
		return items;
	}
});

function pickRandomMatch(matchlist){
	list = JSON.stringify(matchlist).replace('[', '').replace(']', '').split(',');
	return list[Math.floor(Math.random() * list.length)];
}