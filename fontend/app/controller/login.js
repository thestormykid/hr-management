management.controller('loginCtrl',['$scope', function($scope) {

    $scope.user = {}
    $scope.user.isAdmin = false;

    $scope.addUser = function() {

        console.log($scope.user)

    }

}])