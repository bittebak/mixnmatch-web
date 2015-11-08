var app = angular.module('myApp', []);

app.controller('productControl', function($scope, $http) {

	//Data
	$scope.password = "";
	$scope.username = "";
	$scope.loggedIn = false;

	//Message
	var req = {
	 	method: 'GET',
	 	url: 'http://republiq.yellowtwig.nl/Cerberus-1.0.0/admin/check-a4f-products',
	 	headers: {
		   
		   	'Accept': 'application/json'
		 	},
	 	data: { test: 'test' },
	 	withCredentials: true
	}

	var loginMsg = {
 	method: 'POST',
 	url: 'http://republiq.yellowtwig.nl/Cerberus-1.0.0/login',
 	headers: {
	   	'Accept': 'application/json',
	   	'Content-Type' : 'application/json'
	 	}
	}


	//callback
	$scope.products  = function() {
		$http(req)
  		.success(function (response) {$scope.products = response.a4fProducts;
  		});
	};

	$scope.login = function() {
		
		loginMsg['data'] =  { "username": $scope.username,
 								"password": $scope.password }
 		//We are starting a spinner because the http call can take a while	
 		//****your code here******					
		$http(loginMsg).success( function (response) {	
			console.log(response);
			$scope.loggedIn = true;	
		//Well, just hope for the best and stop spinner
		//***your code here****
		});
		
	};

	$scope.hideLoggedIn = function() {
		return $scope.loggedIn;
	};


});