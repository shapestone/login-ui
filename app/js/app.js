'use strict';

// Declare app level module which depends on filters, and services
angular.module('Login', ['Login.filters', 'Login.services', 'Login.directives', 'Login.controllers','ui.bootstrap']).
  config(['$routeProvider','$locationProvider', '$httpProvider',function($routeProvider,$locationProvider, $httpProvider) {
    $routeProvider.when('/home', {templateUrl: 'partials/home.html', controller: 'homeCtrl'})
   .when('/landing', {templateUrl: 'partials/landing.html', controller: 'landingCtrl'})
    //.when('/sign-up', {templateUrl: 'partials/sign-up.html', controller: 'signUpCtrl'})
    .otherwise({redirectTo: '/home'});

    $locationProvider.html5Mode(true);

    var interceptor = ['$location', '$q', function ($location, $q) {

        function success(response) {
            return response;
        }

        function error(response) {
            if (response.status === 401) {
                $location.path('/login');
                return $q.reject(response);
            }
            else {
                return $q.reject(response);
            }
        }

        return function (promise) {
            return promise.then(success, error);
        }
    }];

    $httpProvider.responseInterceptors.push(interceptor);
  }]);

//Defining services module
angular.module('Login.services', ['ngResource']);

//Defining empty controller module
angular.module('Login.controllers',[ ]);

//Defining directives module
angular.module('Login.directives', [ ]);

//Defining filters module
angular.module('Login.filters', [ ]);
