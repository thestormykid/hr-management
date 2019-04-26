window.management = angular.module('myApp', ['ui.bootstrap', 'ngAnimate', 'ui.router']);

management.controller('mainCtrl', ['$scope', '$rootScope', '$location', 'forumService', '$uibModal', function($scope, $rootScope, $location, forumService, $uibModal) {

    $rootScope.isAdmin = localStorage.getItem('isAdmin');
    $rootScope.containsUser = localStorage.getItem('token');

    if (!$rootScope.isAdmin || $rootScope.isAdmin=="" || $rootScope.isAdmin==undefined) {

    } else {
        $rootScope.isAdmin = JSON.parse($scope.isAdmin);

    }

    $scope.notificationItems = [];

    $scope.status = {
        isopen: false
    };

    $scope.toggleDropdown = function($event) {
        $event.preventDefault();
        $event.stopPropagation();
        $scope.status.isopen = !$scope.status.isopen;
    };


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
        if ($rootScope.isAdmin) {
            $location.path('/reports');

        } else {
            $location.path('/attendance');
        }
    }


    $scope.checkNotification = function() {

        forumService.getAllNotification()
            .then(function(success) {
                $scope.notificationItems = success.data;
                console.log(success.data);

            }, function(error) {
                console.log(error.data);

            })
    }

    $scope.open = function (notif) {

        var modalInstance = $uibModal.open({
            animation: true,
            ariaLabelledBy: 'modal-title',
            ariaDescribedBy: 'modal-body',
            templateUrl: 'myModalContent.html',
            controller: 'NotifCtrl',
            controllerAs: '$scope',
            windowClass: 'show',
            resolve: {
                data: function () {
                    return notif;
                }
            }
        });

        modalInstance.result.then(function(status) {
            if (status=='update') {
                hulla.send('details updated', 'success');

            } else {
                hulla.send('employees added successfully', 'success');
                getEmployeeCount();

            }

            $scope.allEmployees = getData();
        }, function() {

        });
    };



}])


management.config(['$stateProvider', function($stateProvider) {
    $stateProvider
        .state('index', {
            url: '/',
            templateUrl:'./app/templates/login.html',
            controller: 'loginCtrl',

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
        .state('user-setting', {
            url:'/user-setting',
            templateUrl: './app/templates/userSetting.html',
            controller: 'employeeSettingCtrl',
            resolve: {
                redirectIfNotAuthenticated: _redirectIfNotAuthenticated
            }
        })
        .state('root-page', {
            url: '/root-page',
            templateUrl: './app/templates/rootPage.html',
            controller: 'rootPageCtrl'
        })
        .state('updatePassword',  {
            url: '/update-password',
            templateUrl: './app/templates/updatePassword.html',
            controller: 'updatePasswordCtrl'
        })
        .state('attendance', {
            url: '/attendance',
            templateUrl: './app/templates/attendance.html',
            controller: 'attendanceCtrl',
            resolve: {
                // redirectIfNotAuthenticated: _redirectIfNotAuthenticated,
                employee: checkForPassword
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
        .state('create-admin', {
            url: '/create-admin/:id',
            templateUrl: './app/templates/signup.html',
            controller: 'createAdminCtrl',
            resolve: {
                email: getTokenFromUrl
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
        .state('forum', {
            url: '/forum',
            templateUrl: './app/templates/forum.html',
            controller: 'forumCtrl',
            resolve: {
                redirectIfNotAuthenticated: _redirectIfNotAuthenticated
            }
        })
        .state('success', {
            url: '/success',
            templateUrl: './app/templates/success.html'
        })

    // .state('/')

}]).run(function($rootScope, $location, $state) {
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

function getTokenFromUrl($q,$stateParams, $http, $timeout) {
    var defer = $q.defer();
    var id = $stateParams.id;
    var hulla = new hullabaloo();

    $http({
        url: `${BACKEND}/checkAdmin/${id}`,
        method: 'POST'

    }).then(function(success) {
        if (success.data.status) {
            defer.resolve(success.data.mail);

        } else {
            hulla.send('admin with the email already exists', 'danger');
            defer.reject();

        }

    }, function(failure) {
        defer.reject()
        hulla.send('someting went wrong', 'danger');

    })

    return defer.promise;
}

function checkForPassword($q, $http, $state, $timeout) {
    var defer = $q.defer();

    var headers = { authorization: localStorage.getItem('token') };
    var hulla = new hullabaloo();

    $http({
        url: `${BACKEND}/checkFirstTimeUser`,
        method: 'POST',
        headers: headers

    }).then(function(success) {
        // 1st time user
        if (success.data.status) {
            hulla.send(success.data.info, 'info');
            $timeout(function() {
                $state.go('updatePassword');
            });

            defer.resolve(success.data.user);

        } else {
            defer.resolve();

        }

    }, function(failure) {
        defer.reject();
        hulla.send('something went wrong', 'danger');

    })

    return defer.promise;
}



management.controller('NotifCtrl', function ($uibModalInstance, $scope, data) {

    $scope.notif = data;
    console.log($scope.notif);
    $scope.url= `http://localhost:3000/pixelCode?token=${localStorage.getItem('token')}&id=${$scope.notif._id}`;
});
