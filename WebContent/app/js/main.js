angular.module('main', ['ui.bootstrap', 'chart.js'])
.config(['$httpProvider', function ($httpProvider) {
	$httpProvider.defaults.useXDomain = true;
    delete $httpProvider.defaults.headers.common['X-Requested-With'];
}])
.controller("MainCtrl", function($scope, mainService){
	$scope.region = "Select Region";
	$scope.matchList = {};
	$scope.curMatch = "";
	$scope.gameType = "NORMAL_5X5";
	$scope.items511 = {};
	$scope.items514 = {};
	
	$scope.labels =["Ranked", "Normals", "Sleeping"];

	  $scope.data = [
	    [65, 59, 54],
	    [28, 48, 22]
	  ];
	
	$scope.getUserIPInfo = function(){
		
		for(var i = 0; i < 5; i++) {
			$scope.curMatch = pickRandomMatch($scope.matchlist);
			
			mainService.pullData($scope.region, $scope.curMatch).then(function(data){
				if(data.data.message == 'invalid query'){
					$scope.ipinfo = {message: data.data.message};
				} else {
					$scope.ipinfo = data.data.participants;
					
					mainService.pullItemInfo($scope.ipinfo,$scope.items511)
				}
			});
		}

		console.log($scope.items511);
	};
	
	$scope.setRegion = function(newR) {
		$scope.region = newR;
		
		mainService.getMatches($scope.region, $scope.gameType).then(function(data){
			if(data.data.message == 'invalid query'){
				$scope.matchlist = {message: data.data.message};
			} else {
				$scope.matchlist = data.data;
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
	
	function pullData(region, curMatch){
		var apiKey = "";
		
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
	
	function getMatches(region, gameType) {
		if(region == ("Select Region" || null)){
			region = "NA";
		}
		
		var url = 'app/assets/AP_ITEM_DATASET/5.11/GAMETYPE/REGION.json';
		url = url.replace('GAMETYPE', gameType).replace('REGION', region)
		
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
	
	function pullItemInfo(players, items){
		for(var i = 0; i < players.length; i++){
			for(var j = 0; j < 6; j++){
				if((items[players[i].stats["item"+j]] == undefined)){
					items[players[i].stats["item"+j]] = 1;
				} else {
					items[players[i].stats["item"+j]] = items[players[i].stats["item"+j]] + 1;
				}
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