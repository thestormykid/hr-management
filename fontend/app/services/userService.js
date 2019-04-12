management.factory('userService', ['$http', '$q', function($http, $q) {

    function setHeaders() {
        var headers = { authorization: localStorage.getItem('token') }
        return headers;
    }

    return {

        addUser: function(userDetails) {
            var promise = $q.defer();

            $http({
                url: '/addUser',
                method: 'POST',
                headers: setHeaders(),
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