angular.module("man-serv", ["man-ctrl"])

.factory('homeServ', function($rootScope, $http, $location){

	var register = function(userInfo, callback){
		var assignArrays = ['bills', 'daily', 'weekly', 'monthly', 'retirement', 'investment'],
		 assignZeros  = ['have', 'free', 'emergency'],
		 assignBool   = ['paid'],
		assignements = [assignArrays, assignZeros, assignBool];

		assignements.forEach(function(arr,i){
			arr.forEach(function(vals, index){
				if ( i === 0){
					userInfo[vals] = [];
				} else if ( i == 1){
					userInfo[vals] = 0;

				} else {
  					userInfo[vals] = true;
				}
			});
		}); 

		$http.post('/add', userInfo)
			.success(function(res){

				$rootScope.id = res._id;
				$rootScope.loggedIn = true;
				$location.path("/manage");		

			})
			.error(function(err){
				console.warn(err);
				callback(err);
			});

	}


	var logIn = function(cred){
		$http.put('/storage', cred)
		.success(function(res){
			if (res){

				$rootScope.loggedIn = true;
				$rootScope.id = res._id;
				$location.path('/manage');
			} else {
				window.alert("Invalid Username or Password");
			}
		})
		.error(function(err){
			console.warn(err);
		});
	}		

	return {

		signUp: register,
		signIn: logIn
	}		


})
.factory('accountServ', function($rootScope, $http){

	return {}	

});