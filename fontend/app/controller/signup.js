management.controller('signupCtrl',['$scope', 'employeeService', '$rootScope', '$location', function($scope, employeeService,
                                                                                                     $rootScope, $location) {

    $scope.user = {};
    $scope.user.code = null;
    var hulla = new hullabaloo();

    $scope.addAdmin = function() {
        $scope.user.isAdmin = true;

        employeeService.addEmployee($scope.user)
            .then(function(success) {
                if (success.message == 'exists') {
                    hulla.send('employee code exists', 'info')

                } else {
                    hulla.send('new Admin created', 'success');
                    $rootScope.setEmployee(success);

                }
            }, function(error) {
                console.log('something went wrong');

            })
    }

}])