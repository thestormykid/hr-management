management.controller('employeeSettingCtrl', [ '$scope', '$rootScope', 'employeeService', function($scope, $rootScope, employeeService) {

    $scope.employee;

    function getEmployee() {
        employeeService.employeeDetails()
            .then(function(employeeInfo) {
                $scope.employee = employeeInfo;

            }, function(error) {
                console.log(error);

            })
    }

    getEmployee();

}])