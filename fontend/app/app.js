window.management = angular.module('myApp', ['ui.bootstrap', 'ngAnimate', 'ui.router']);

management.controller('mainCtrl', ['$scope', '$rootScope', '$location', function($scope, $rootScope, $location) {

    $rootScope.isAdmin = localStorage.getItem('isAdmin');
    $rootScope.containsUser = localStorage.getItem('token');

    if (!$rootScope.isAdmin || $rootScope.isAdmin=="" || $rootScope.isAdmin==undefined) {

    } else {
        $rootScope.isAdmin = JSON.parse($scope.isAdmin);

    }

    $scope.logout = function() {
        localStorage.setItem('isAdmin', false);
        localStorage.setItem('token', "");
        $rootScope.isAdmin = false;
        $rootScope.containsUser = "";
        $location.path('/');
    }

    $rootScope.setEmployee = function(employee) {
        var token = employee.token;
        $rootScope.isAdmin = JSON.parse(employee.user.isAdmin);
        $rootScope.containsUser = true;
        localStorage.setItem('token', token);
        localStorage.setItem('isAdmin', $rootScope.isAdmin);
        $location.path('/reports');
    }

}])


management.config(['$stateProvider', function($stateProvider) {
    $stateProvider
        .state('index', {
            url: '/',
            templateUrl:'./app/templates/login.html',
            controller: 'loginCtrl'
        })
        .state('signup', {
            url: '/signup',
            templateUrl: './app/templates/signup.html',
            controller: 'signupCtrl'
        })
        .state('home', {
            url: '/home',
            templateUrl: './app/templates/home.html',
            controller: 'homeCtrl',
            resolve: {
                redirectIfNotAuthenticated: _redirectIfNotAuthenticated
            }
        })
        .state('attendance', {
            url: '/attendance',
            templateUrl: './app/templates/attendance.html',
            controller: 'attendanceCtrl',
            resolve: {
                redirectIfNotAuthenticated: _redirectIfNotAuthenticated
            }
        })
        .state('designation', {
            url: '/designation',
            templateUrl: './app/templates/designations.html',
            controller: 'designationCtrl',
            resolve: {
                redirectIfNotAuthenticated: _redirectIfNotAuthenticated
            }
        })
        .state('employee-registration', {
            url: '/employee-registration',
            templateUrl: './app/templates/employeeRegistration.html',
            controller: 'employeeRegistrationCtrl',
            resolve: {
                redirectIfNotAuthenticated: _redirectIfNotAuthenticated
            }
        })
        .state('reports', {
            url: '/reports',
            templateUrl: './app/templates/reports.html',
            controller: 'reportsCtrl',
            resolve: {
                redirectIfNotAuthenticated: _redirectIfNotAuthenticated
            }
        })
        .state('salary-component', {
            url: '/salary-component',
            templateUrl: './app/templates/salaryComponents.html',
            controller: 'salaryComponentsCtrl',
            resolve: {
                redirectIfNotAuthenticated: _redirectIfNotAuthenticated
            }
        })
        .state('working-shifts', {
            url: '/working-shifts',
            templateUrl: './app/templates/workingShifts.html',
            controller: 'workingShiftsCtrl',
            resolve: {
                redirectIfNotAuthenticated: _redirectIfNotAuthenticated
            }
        })
        .state('create-shifts', {
            url: '/create-shifts',
            templateUrl: './app/templates/createShifts.html',
            controller: 'createShiftsCtrl',
            resolve: {
                redirectIfNotAuthenticated: _redirectIfNotAuthenticated
            }
        })
        // .state('/')

}]).run(function($rootScope, $location, $state) {
    // console.log(error);
        $state.defaultErrorHandler(function(error) {
            // This is a naive example of how to silence the default error handler.
            console.log(error);
        });
    })


function _redirectIfNotAuthenticated($q, $state, $timeout) {
    var defer = $q.defer();

    var user = localStorage.getItem('token');

    if(user) {
        defer.resolve();

    } else {
        $timeout(function () {
            $state.go('index');
        });

        defer.reject();
    }

    return defer.promise;
}