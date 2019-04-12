management.controller('rootPageCtrl', ['$scope', 'employeeService', '$location', function($scope, employeeService, $location) {

    $scope.admin = {};
    $scope.isDisabled = false;

    var hulla = new hullabaloo();

    $scope.sendEmail = function() {
        $scope.isDisabled = true;
        employeeService.sendEmail($scope.admin)
            .then(function(success) {
                hulla.send('email sent', 'info');
                $location.path('/success');
                console.log(success.token);


            }, function(failure) {
                hulla.send('something went worng', 'danger');

            })

        // employeeService.sendEmail($scope.admin)
        //     .then(function(success) {
        //         hulla.send('email send', 'info');
        //
        //     }, function(error) {
        //         hulla.send('something went wrong', 'danger');
        //     })
    }

}])