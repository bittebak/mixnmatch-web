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
	$scope.nrOfProducts=0;
	$scope.nrOfCustomers=0;
	$scope.productsChecked=false;
	$scope.apiMessage="Nothing yet."

	var urlParams = $location.search();

	$scope.getApiUrl = function() {
		apiParam = urlParams['api'];
		switch(apiParam) {
			case "int":
			$scope.apiBaseUrl = "http://localhost:8080/Cerberus-1.0.0";

			break;

			default:
			apiBaseUrl = 'http://republiq.yellowtwig.nl/Cerberus-1.0.0';
			break;

		}
	}

	$scope.getApiUrl();
	//Message
	

	
	loginMsg = {
 	method: 'POST',
 	url: $scope.apiBaseUrl + '/login',
 	headers: {
	   	'Accept': 'application/json',
	   	'Content-Type' : 'application/json'
	 	},
	 	withCredentials: true
	}

	var customersMsg = {
 	method: 'Get',
 	url: $scope.apiBaseUrl + '/admin/check-customers',
 	headers: {
	   	'Accept': 'application/json',
	   	'Content-Type' : 'application/json'
	 	},
	 	withCredentials: true
	}


	var replaceProductsMsg = {
 	method: 'POST',
 	url: $scope.apiBaseUrl + '/admin/products/replace',
 	headers: {
	   	'Accept': 'application/json',
	   	'Content-Type' : 'application/json'
	 	},
	 	withCredentials: true
	}

	var updateProductsMsg = {
 	method: 'POST',
 	url: $scope.apiBaseUrl + '/admin/products/update',
 	headers: {
	   	'Accept': 'application/json',
	   	'Content-Type' : 'application/json'
	 	},
	 	withCredentials: true
	}

	var seasonReplaceProductsMsg = {
 	method: 'POST',
 	url: $scope.apiBaseUrl + '/admin/products/season',
 	headers: {
	   	'Accept': 'application/json',
	   	'Content-Type' : 'application/json'
	 	},
	 	withCredentials: true
	}

	var updateCustomersMsg = {
 	method: 'POST',
 	url: $scope.apiBaseUrl + '/admin/update-customers',
 	headers: {
	   	'Accept': 'application/json',
	   	'Content-Type' : 'application/json'
	 	},
	 	withCredentials: true
	}

	var syncOrdersMsg = {
 	method: 'POST',
 	url: $scope.apiBaseUrl + '/admin/orders/sync',
 	headers: {
	   	'Accept': 'application/json',
	   	'Content-Type' : 'application/json'
	 	},
	 	withCredentials: true
	}

	var versionMsg = {
 	method: 'Get',
 	url: $scope.apiBaseUrl + '/admin/version',
 	headers: {
	   	'Accept': 'application/json',
	   	'Content-Type' : 'application/json'
	 	},
	 	withCredentials: true
	}

	var checkConfigMsg = {
 	method: 'Get',
 	url: $scope.apiBaseUrl +'/admin/config/check',
 	headers: {
	   	'Accept': 'application/json'
	   	
	 	},
	 	withCredentials: true
	}

	$scope.setMessage = function (newMessage) {
		$scope.previousMessage = $scope.message;
		$scope.message = newMessage;
	};

	$scope.replaceProducts  = function() {
		$scope.setMessage("Start replacing all products. Have patience, wait 1 hour.");
		$http(replaceProductsMsg)
  		.success(function (response) {
  			
  			$scope.setMessage("Products replaced.");
  			$scope.errorText = response.count;
  		});
	};

	//Incremental update
	$scope.incrementalUpdateProducts  = function() {
		$scope.setMessage("Start incremental product update (wait 4 minutes).");
		$http(updateProductsMsg)
  		.success(function (response) {
  			$scope.setMessage("Products updated incrementally.");
  			$scope.errorText = response.count;
  		});
	};

	//Seasonal full update
	$scope.replaceSeasonProducts  = function() {
		$scope.setMessage("Replacing seasonal products.");
		$http(seasonReplaceProductsMsg)
  		.success(function (response) {
  			
  			$scope.setMessage("Seasonal products are updated.");
  		});
	};

	//callback
	$scope.checkCustomers  = function() {
		$scope.customersChecked=false;
		$scope.setMessage("Getting customers");
		$http(customersMsg)
  		.success(function (response) {
  			$scope.customers = response.customers;
  			$scope.customersChecked=true
  			$scope.setMessage("Found " + response.nrOfCusomers + " customers.");
  			$scope.nrOfCustomers = $scope.customers.length;
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
		$scope.setMessage("Start syncing orders");
		$scope.syncMessages = [];
		$http(syncOrdersMsg)
  		.success(function (response) {
  				$scope.syncMessages = response.results;
  				$scope.setMessage("Updated orders");
  				$scope.apiMessage=response.results;
  			
  		});
	};

	$scope.checkConfig  = function() {
		$scope.customersChecked=false;
		$scope.setMessage("Checking config.");
		$http(checkConfigMsg)
  		.success(function (response) {
  			$scope.setMessage("Done. Check log file for results.");
  			
  			if(response.allOk) {
  				$scope.apiMessage=response.resultMap;
  			} else {
  				$scope.apiMessage=response.errorText;
  			}
  		}).error(function (response) {
  			$scope.setMessage("Config check failed");
  			$scope.apiMessage=resultMap;
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

	$scope.areProductsChecked = function() {
		return $scope.productsChecked;
	};

	$scope.getVersion = function() {
		$http(versionMsg)
  		.success(function (response) {
  			$scope.version = response;
  			
  		});

	}
	$scope.username = urlParams['username'];
	$scope.password = urlParams['password'];
	$scope.test = urlParams['test'];
	if($scope.test == 'true') {
		$scope.loggedIn = true;
	}
	
	$scope.getVersion();

}
]);