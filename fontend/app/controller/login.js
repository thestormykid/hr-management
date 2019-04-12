management.controller('loginCtrl',['$scope', '$rootScope', 'employeeService', '$location', function($scope, $rootScope,
                                                                                                    employeeService, $location) {

    $scope.user = {};

    var hulla = new hullabaloo();

    $scope.login = function() {

        employeeService.login($scope.user)
            .then(function(success) {
                hulla.send(`Welcome ${success.user.name}`, 'success');
                $rootScope.setEmployee(success);

            }, function(error) {
                hulla.send('Employee code or password is incorrect', 'info');

            })
    }

}])