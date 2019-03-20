window.management = angular.module('myApp', ['ui.bootstrap', 'ngAnimate', 'ui.router']);


management.config(['$stateProvider', function($stateProvider) {
    $stateProvider
        .state('home', {
            url: '/home',
            templateUrl: './app/templates/home.html',
            controller: 'homeCtrl'
        })
        .state('attendance-capturing', {
            url: '/attendance-capturing',
            templateUrl: './app/templates/attendanceCapturing.html',
            controller: 'attendanceCapturingCtrl'
        })
        .state('designation', {
            url: '/designation',
            templateUrl: './app/templates/designations.html',
            controller: 'designationCtrl'
        })
        .state('employee-registration', {
            url: '/employee-registration',
            templateUrl: './app/templates/employeeRegistration.html',
            controller: 'employeeRegistrationCtrl'
        })
        .state('reports', {
            url: '/reports',
            templateUrl: './app/templates/reports.html',
            controller: 'reportsCtrl'
        })
        .state('salary-component', {
            url: '/salary-component',
            templateUrl: './app/templates/salaryComponents.html',
            controller: 'salaryComponentsCtrl'
        })
        .state('working-shifts', {
            url: '/working-shifts',
            templateUrl: './app/templates/workingShifts.html',
            controller: 'workingShiftsCtrl'
        })
        .state('create-shifts', {
            url: '/create-shifts',
            templateUrl: './app/templates/createShifts.html',
            controller: 'createShiftsCtrl'
        })
        // .state('/')

}])

// management.filter('startswith', )

// management.controller()