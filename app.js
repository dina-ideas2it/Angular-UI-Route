var routerApp = angular.module('routerApp', ['ui.router']);

routerApp.run(function ($rootScope, UserService, $state) {

  $rootScope.$on('$stateChangeStart', function (event, toState, toParams) {
    console.log(toState);
    var authPage = toState.data.authPage;

    if (authPage && !UserService.isUserLoggedIn()) {
      event.preventDefault();
      $state.go('login');
      // get me a login modal!
    }else if(!authPage && UserService.isUserLoggedIn()){
        event.preventDefault();
        $state.go('home.list');
    }
  });

  /*resolve : {
                'checkAuthentication' : function(UserService, $state){
                    if(!UserService.isUserLoggedIn()){
                        $state.go('login');
                    }
                }
            }*/

});

routerApp.config(function($stateProvider, $urlRouterProvider) {
    
    $urlRouterProvider.otherwise('/login');
    
    $stateProvider
        
        // HOME STATES AND NESTED VIEWS ========================================
        .state('login',{
            url : '/login',
            templateUrl: 'login.html',
            controller: 'LoginController',
            data : {
                authPage : false
            }
           
        })
        .state('home', {
            abstract : true,
            url: '/home',
            templateUrl: 'partial-home.html',
            data : {
                authPage : true
            }
            
        })
        
        // nested list with custom controller
        .state('home.list', {
            url: '/list',
            templateUrl: 'partial-home-list.html',
            controller: function($scope) {
                $scope.dogs = ['Bernese', 'Husky', 'Goldendoodle'];
            },
        })
        
        // nested list with just some random string data
        .state('home.paragraph', {
            url: '/paragraph',
            template: '<a ui-sref=".about">I could sure use a drink right now.</p><div ui-view></div>',
            
        })
        
        // ABOUT PAGE AND MULTIPLE NAMED VIEWS =================================
        .state('home.paragraph.about', {
            url: '/about',
            views: {
                '': { templateUrl: 'partial-about.html' },
                'columnOne@about': { template: 'Look I am a column!' },
                'columnTwo@about': { 
                    templateUrl: 'table-data.html',
                    controller: 'scotchController'
                }
            }
            
        });
        
})

routerApp.controller('scotchController', function($scope) {
    
    $scope.message = 'test';
   
    $scope.scotches = [
        {
            name: 'Macallan 12',
            price: 50
        },
        {
            name: 'Chivas Regal Royal Salute',
            price: 10000
        },
        {
            name: 'Glenfiddich 1937',
            price: 20000
        }
    ];
    
});

routerApp.controller('LoginController', function($scope, $state, UserService) {
    $scope.user = {};
    $scope.doLogin = function(){
        if($scope.user.username && $scope.user.password){
            UserService.setUser({
                'username' : $scope.user.username,
                'password' : $scope.user.password
            });
            $state.go('home.list');
        }else{
            alert('Re-login')
        }
    }
    
});

routerApp.service('UserService', function(){
    var user = {};
    var us = {
        'setUser' : function(authenticatedUser){
            user = authenticatedUser;
        },
        'getUser' : function(){
            return angular.copy(user);
        },
        'isUserLoggedIn' : function(){
            return user.username ? true : false;
        }
    }
    return us;
});

