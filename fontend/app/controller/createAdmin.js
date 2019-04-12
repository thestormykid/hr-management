management.controller('createAdminCtrl', ['$scope', 'email', 'employeeService', '$rootScope', function($scope, email, employeeService,
                                                                                                       $rootScope) {

    $scope.admin = {}
    $scope.admin.email = email;

    var hulla = new hullabaloo();

    $scope.addAdmin = function() {
        $scope.admin.isAdmin = true;
        $scope.admin.firstLogin = false;

        employeeService.addEmployee($scope.admin)
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