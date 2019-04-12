management.controller('updatePasswordCtrl', ['$scope', '$rootScope', 'employeeService', '$location', function($scope, $rootScope,
    employeeService, $location) {

    var hulla = new hullabaloo();

    $scope.updatePassword = function() {

        employeeService.updatePassword($scope.employee.password)
            .then(function(passwordUpdated) {
                hulla.send('password updated successfully', 'success');
                $location.path('/attendance');

            }, function(failure) {
                hulla.send('something went wrong', 'danger');

            })
    }

}])