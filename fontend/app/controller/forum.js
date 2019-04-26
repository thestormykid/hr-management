management.controller('forumCtrl', ['$scope', '$rootScope', 'socketService', 'forumService',
    function($scope, $rootScope, socketService, forumService) {

    var hulla = new hullabaloo();
    $scope.notif = {};
    $scope.adminSocket = socketService.getAdminSocket()

    $scope.sendNotification = function() {
        console.log('asdhaslkdjaslkdjlaskjdlsakjd');
        forumService.sendNotification($scope.adminSocket, $scope.notif)
            .then(function(success) {
                hulla.send(success, 'successs');
                flushDetails()

            }, function(error) {
                hulla.send(error, 'danger');

            })
    }

    function flushDetails() {
        $scope.notif = {};
        $scope.myForm.$setPristine();
    }

}])