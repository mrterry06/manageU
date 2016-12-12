angular.module('man-ctrl', ["man-serv"])

.controller('homeCtrl', function($scope, $http, $location, $rootScope, homeServ){
	$scope.title = "ManageU";
	var expression = /\S/g;
	$scope.user = {};

	

	$scope.userSignUp = function(){
		
		
		if ($scope.user.pass !== $scope.user.confirm){
			window.alert('Passwords need to match');
		
		} else {
		
		  for (var key in $scope.user){
		  	
		  	if (!$scope.user[key] || !expression.test($scope.user[key])){
		  		window.alert("All fields need a value");
		  		return;
		  	}

		  }	

		  homeServ.signUp($scope.user);
		
		}
	
	}


	$scope.userSignIn = function(){
		homeServ.signIn($scope.user)
	}

	
})
.controller('accountCtrl', function($scope, $rootScope, $http, accountServ){
	$scope.accountInfo = {};	
	$scope.user = {};
		function refresh(){	


				var id = $rootScope.id;
				$http.get('/bills/' + id)
				.success(function(response){
					
					$scope.username = response.user;
					$scope.bills = response.bills;
					$scope.days = response.daily;
					$scope.weekly = response.weekly;
					$scope.poss = response.have;
					$scope.wants = response.wants;
					$scope.free = response.free;
					$scope.emergency = response.emergency;
					$scope.paid = response.paid;
					$scope.investment = response.investment;
					$rootScope.bills = response.bills;
					$rootScope.currentUser = response.user;
			

					$scope.accountInfo = response;
				})
				.error(function(err){
					console.warn("User not yet validated or created");
				});

		};

		refresh();

		// $scope.handleRequest = function(req, obj, route){
 	// 		var id   = $rootScope.id;
		// 	var make = {user: $scope.accountInfo.user, have: $scope.make };
		// 	var reqStorage = {
		// 		get: function(){

		// 		},
		// 		post: function(){} ,
		// 		put: function(){
		// 			route += id;
		// 			$http.put(route, obj )
		// 			.success(function(){
		// 				obj = '';
		// 				refresh();
		// 			});
		// 		},
		// 	};

		// }


		$scope.makeSubmit = function(){
			
			var make = {
				user: $scope.accountInfo.user,
				have: $scope.make
			}

			var id = $rootScope.id;
			

			$http.put('/maker/' + id, make)
			.success(function(err, data){
			$scope.make = '';
				refresh();
			});
		};

		$scope.addFree = function(){
			var make = {
				user: $scope.accountInfo.user,
				free: $scope.freeAdd
			};
			var id = $rootScope.id;
			

			$http.put('/free/' + id, make)
			.success(function(err, data){
			$scope.freeAdd = '';
				refresh();
			});
		};
		
		$scope.changeEmer = function(){

			var make = {
				user: $scope.accountInfo.user,
				emergency: $scope.emerInput
			};
			var id = $rootScope.id;
			
     
			$http.put('/emer/' + id, make)
			.success(function(err, data){
			$scope.emerInput= '';
				refresh();
			});

		};
		
	//months add					
		$scope.addBill = function(){
			var billed = {
				user: $scope.accountInfo.user,
				item: $scope.bill.item,
				amount: $scope.bill.amount,
				date: $scope.bill.date
			}

			$http.put('/bills', billed)
			.success(function(response){
				
				$scope.bill = '';
				refresh();
			});
		};

		$scope.removeBill = function(){

			var id = $rootScope.id;
			$http.put('/bill/' + id).success(function(response){
				
				refresh();
			});

		};

		$scope.addDay = function(){

			var day = {
				user: $rootScope.currentUser,
				item: $scope.day.item,
				amount: $scope.day.amount
			}
			
			$http.post('/day', day)
			.success(function(response){
				
				$scope.day = '';
				refresh();
		});
	};

		$scope.removeDay = function(){

			var id = $rootScope.id;
			$http.put('/day/' + id).success(function(response){
				
				refresh();
			});

		};

		$scope.addWeek = function(){

			var week = {
				user: $rootScope.currentUser,
				item: $scope.week.item,
				amount: $scope.week.amount
			};
		
			$http.post('/week', week)
			.success(function(response){
				
				$scope.week = '';
				refresh();
		});
		};

		$scope.removeWeek = function(){

			var id = $rootScope.id;
			$http.put('/week/' + id).success(function(response){
				
				refresh();
			});

		};


		//investment
		$scope.addInvestment = function(){

			var day = {
				user: $rootScope.currentUser,
				place: $scope.invest.place,
				amount: $scope.invest.amount
			}
			
			$http.post('/invest', day)
			.success(function(response){
				
				$scope.invest = '';
				refresh();
		});

		};
		
		$scope.removeInvestment = function(){

			var id = $rootScope.id;
			$http.put('/invest/' + id).success(function(response){
				
				refresh();
			});

		};


		$scope.addWant = function(){
			var wants = {
				user: $rootScope.currentUser,
				item: $scope.want.item,
				amount: $scope.want.amount
			};

			
			$http.post('/wants', wants)
			.success(function(response){
				
				$scope.want = '';
				refresh();
			});
		};
		
	$scope.removeWant = function(){

			var id = $rootScope.id;
			$http.put('/wants/' + id).success(function(response){
				
				refresh();
			});

		};


			refresh();

})
.controller('footerCtrl', function($scope, $route){

	//$route.current.templateUrl

})
.controller('email',['$scope', '$http', function($scope, $http){
			
		$scope.mailSubmit = function(){
			$scope.response = '';
			console.time("mail");
			$http.post('/email', $scope.mail)
			.success(function(response){
					console.timeEnd("mail");
				if(response === true){
					$scope.response = "Thank you! Your message was sent. I hope to get back to you soon!";
					$scope.mail = ''; 
				} else {
					$scope.mail = '';
					$scope.response = "I'm sorry your message failed to send. Please try again!";
				}
			})
			.error(function(){
				$scope.response = "I'm sorry your message failed to send. Please try again!";
			});
		};

}]);

