//require('angular-spinners');

var app = angular.module('myApp', []);

//HTML5 is required for query param search
app.config( [ '$locationProvider', function( $locationProvider ) {
   // In order to get the query string from the
   // $location object, it must be in HTML5 mode.
   $locationProvider.html5Mode( true );
}]);

app.controller('productControl', ['$scope', '$http', '$location',
	function($scope, $http, $location) {

	//Data
	$scope.password = "";
	$scope.username = "";
	$scope.loggedIn = false;
	$scope.hideSpinner = true;
	$scope.customersChecked = false;
	$scope.message = "";
	$scope.previousMessage = "";
	$scope.version = {};

	//Message
	var testProduct = {
	 	method: 'GET',
	 	 url: 'product_response.json',
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
	 	},
	 	withCredentials: true
	}

	var customersMsg = {
 	method: 'Get',
 	url: 'http://republiq.yellowtwig.nl/Cerberus-1.0.0/admin/a4f/check-customers',
 	headers: {
	   	'Accept': 'application/json',
	   	'Content-Type' : 'application/json'
	 	},
	 	withCredentials: true
	}

	var checkProductsMsg = {
 	method: 'POST',
 	url: 'http://republiq.yellowtwig.nl/Cerberus-1.0.0/admin/af4/productcs/check',
 	headers: {
	   	'Accept': 'application/json',
	   	'Content-Type' : 'application/json'
	 	},
	 	withCredentials: true
	}

	var updateProductsMsg = {
 	method: 'POST',
 	url: 'http://republiq.yellowtwig.nl/Cerberus-1.0.0/admin/af4/productcs/update',
 	headers: {
	   	'Accept': 'application/json',
	   	'Content-Type' : 'application/json'
	 	},
	 	withCredentials: true
	}

	var syncOrdersMsg = {
 	method: 'POST',
 	url: 'http://republiq.yellowtwig.nl/Cerberus-1.0.0/admin/a4f/orders/sync',
 	headers: {
	   	'Accept': 'application/json',
	   	'Content-Type' : 'application/json'
	 	},
	 	withCredentials: true
	}

	var versionMsg = {
 	method: 'Get',
 	url: 'http://republiq.yellowtwig.nl/Cerberus-1.0.0/admin/version',
 	headers: {
	   	'Accept': 'application/json',
	   	'Content-Type' : 'application/json'
	 	},
	 	withCredentials: true
	}

	$scope.setMessage = function (newMessage) {
		$scope.previousMessage = $scope.message;
		$scope.message = newMessage;

	};

	//callback
	$scope.checkProducts  = function() {
		if($scope.test == 'true') {
			$http(testProduct)
	  		.success(function (response) {$scope.products = response.a4fProducts;
	  		});

		} else {
			$http(checkProductsMsg)
	  		.success(function (response) {$scope.products = response.a4fProducts;
	  		});
  		}
	};

	$scope.updateProducts  = function() {
		$http(upateProductsMsg)
  		.success(function (response) {$scope.products = response.a4fProducts;
  		});
	};

	//callback
	$scope.checkCustomers  = function() {
		$scope.customersChecked = false;
		$scope.setMessage("Getting customers");
		$http(customersMsg)
  		.success(function (response) {
  			$scope.customers = response.customers;
  			$scope.customersChecked = true;
  			$scope.setMessage("Found " + response.nrOfCusomers + " customers.");
  		});
	};

	$scope.updateCustomers  = function() {
		$scope.setMessage("Updating customers");
		$scope.customers = [];
		$http(updateCustomersMsg)
  		.success(function (response) {
  			if(response.success) {
  				$scope.customers = response.customers;
  				$scope.setMessage("Updated " + response.nrOfCusomers + " customers.");
  			}
  			else {
  				$scope.setMessage( "Updating failed. Computer says:\"" + response.message + "\"")
  			}
  			
  		});
	};

	$scope.syncOrders  = function() {
		$scope.setMessage("Syning orders");
		$scope.syncMessages = [];
		$http(syncOrdersMsg)
  		.success(function (response) {
  				$scope.syncMessages = response.results;
  				$scope.setMessage("Updated orders");
  			
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

	$scope.hideUpdateCustomers = function() {
		return !$scope.customersChecked;
	};

	$scope.getVersion = function() {
		$http(versionMsg)
  		.success(function (response) {
  			$scope.version = response;
  			
  		});

	}

	//get query parameters

	var urlParams = $location.search();
	$scope.username = urlParams['username'];
	$scope.password = urlParams['password'];
	$scope.test = urlParams['test'];
	if($scope.test == 'true') {
		$scope.loggedIn = true;
	}

	console.log(urlParams);
	$scope.getVersion();

}
]);