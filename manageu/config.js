

var app = angular.module("manageUApp", ['ngRoute', "man-serv", "man-ctrl"]);

	
	app.config(function($routeProvider){
		$routeProvider
			.when('/', {
				templateUrl: './views/home.html',
				controller: 'homeCtrl'
			})
			.when('/manage', {
				// 		resolve: {
				// 	"check": function($location, $rootScope){
				// 		if(!$rootScope.manage){
				// 			$location.path('/');
				// 		}
				// 	}
				// },
				templateUrl: 'views/manage.html',
				controller: 'accountCtrl'
			})
			.when('/help',{
				templateUrl: 'views/help.html'
			})
			.when('/contact',{
				templateUrl: 'views/contact.html',
				controller: 'email'
			})
			.otherwise({
				redirectTo: '/'
			})
		});
