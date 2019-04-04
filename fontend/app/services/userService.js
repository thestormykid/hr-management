management.factory('userService', ['$http', '$q', function($http, $q) {

    return {

        addUser: function(userDetails) {
            var promise = $q.defer();

            $http({
                url: '/addUser',
                method: 'POST',
                data: {
                    user: userDetails
                }
            }).then(function(success) {
                promise.resolve(success.data);

            }, function(error) {
                promise.reject(error.data);

            })

            return promise.promise;
        }

    }

}])