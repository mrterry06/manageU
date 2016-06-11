

var app = angular.module('myApp', ['ngRoute']);

	app.controller('myCtrl',['$scope', '$http', '$location', '$rootScope', function($scope, $http, $location, $rootScope){
			$scope.title = "ManageU";
			var expression = /\S/g;


			

			$scope.userSignUp = function(){
				console.log($scope.user);
				if($scope.user.pass !== $scope.user.confirm){
					window.alert('Passwords need to match');
				}else if($scope.user.user === undefined || expression.test($scope.user.user) === false || $scope.user.pass === undefined || expression.test($scope.user.pass) === false || $scope.user.confirm === undefined || expression.test($scope.user.confirm) === false){
					window.alert('All fields need a value');
				}else{
					var person = {
						user: $scope.user.user,
						pass: $scope.user.pass,
						bills: [],
						have: 0,
						free: 0,
						daily:[],
						weekly:[],
						monthly:[],
						retirement: [],
						emergency: 0,
						investment: [],
						wants: [],
						paid: true
					};
				$http.post('/add', person)
					.success(function(response){
					
					window.localStorage.setItem('user', $scope.user.user);
					window.localStorage.setItem('pass', $scope.user.pass);
					$rootScope.manage = true;

					$location.path('/manage');
					
				
				})
				.error(function(err){
					console.log("There an error at " + err);
				});
				}
			};

		

			function refresh(){	
								if(window.localStorage !== 0){
									$scope.user = window.localStorage
								};
								console.log($rootScope.id);
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
									console.log(response.want  + "  here too");
								})
								.error(function(err){
									console.log("User not yet validated or created");
								});

					};


			$scope.userSignIn = function(){
				$http.put('/storage', $scope.user)
				.success(function(response){
					console.log(response);
					console.log(response.user);
					
					if(response !== false){
					$location.path('/manage');
					$rootScope.manage = true;
					$rootScope.currentUser = response.user;
					$rootScope.id = response._id;
					refresh();
					every();
				} else {
                    window.alert('Invalid Username or Password');
				 };
				});
			};

			$scope.makeSubmit = function(){
				var make = {
					user: $scope.currentUser,
					have: $scope.make
				};
				var id = $rootScope.id;
				

				$http.put('/maker/' + id, make)
				.success(function(err, data){
				$scope.make = '';
					refresh();
				});
			};

			$scope.addFree = function(){
				var make = {
					user: $scope.currentUser,
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
					user: $scope.currentUser,
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
					user: $rootScope.currentUser,
					item: $scope.billss.item,
					amount: $scope.billss.amount,
					date: $scope.billss.date
				};
				console.log(billed);
				$http.put('/bills', billed)
				.success(function(response){
					console.log(response);
					$scope.billss = '';
					refresh();
				});
			};

			$scope.removeBill = function(){

				var id = $rootScope.id;
				$http.put('/bill/' + id).success(function(response){
					console.log(response);
					refresh();
				});

			};

			$scope.addDay = function(){

				var day = {
					user: $rootScope.currentUser,
					item: $scope.day.item,
					amount: $scope.day.amount
				};
				console.log(day);
				$http.post('/day', day)
				.success(function(response){
					console.log(response);
					$scope.day = '';
					refresh();
			});
		};

			$scope.removeDay = function(){

				var id = $rootScope.id;
				$http.put('/day/' + id).success(function(response){
					console.log(response);
					refresh();
				});

			};

			$scope.addWeek = function(){

				var week = {
					user: $rootScope.currentUser,
					item: $scope.week.item,
					amount: $scope.week.amount
				};
				console.log(week);
				$http.post('/week', week)
				.success(function(response){
					console.log(response);
					$scope.week = '';
					refresh();
			});
			};

			$scope.removeWeek = function(){

				var id = $rootScope.id;
				$http.put('/week/' + id).success(function(response){
					console.log(response);
					refresh();
				});

			};


			//investment
			$scope.addInvestment = function(){

					var day = {
					user: $rootScope.currentUser,
					place: $scope.invest.place,
					amount: $scope.invest.amount
				};
				console.log(day);
				$http.post('/invest', day)
				.success(function(response){
					console.log(response);
					$scope.invest = '';
					refresh();
			});

			};
			
			$scope.removeInvestment = function(){

				var id = $rootScope.id;
				$http.put('/invest/' + id).success(function(response){
					console.log(response);
					refresh();
				});

			};


			$scope.addWant = function(){
				var wants = {
					user: $rootScope.currentUser,
					item: $scope.want.item,
					amount: $scope.want.amount
				};

				console.log(wants);
				$http.post('/wants', wants)
				.success(function(response){
					console.log(response);
					$scope.want = '';
					refresh();
				});
			};
			
		$scope.removeWant = function(){

				var id = $rootScope.id;
				$http.put('/wants/' + id).success(function(response){
					console.log(response);
					refresh();
				});

			};


			refresh();
		}]);
	app.controller('email',['$scope', '$http', function($scope, $http){
			
		$scope.mailSubmit = function(){
			console.log($scope.mail);
			$http.post('/email', $scope.mail)
			.success(function(response){
				console.log(response);
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
	
	app.config(function($routeProvider){
		$routeProvider
			.when('/', {
				templateUrl: './views/home.html',
				controller: 'myCtrl'
			})
			.when('/manage', {
						resolve: {
					"check": function($location, $rootScope){
						if(!$rootScope.manage){
							$location.path('/');
						}
					}
				},
				templateUrl: './views/manage.html',
				controller: 'myCtrl'
			})
			.when('/help',{
				templateUrl: './views/help.html'
			})
			.when('/contact',{
				templateUrl: './views/contact.html',
				controller: 'email'
			})
			.otherwise({
				redirectTo: '/'
			})
		});
