management.factory('designationService', ['$http','$q', function($http, $q) {

    function setHeaders() {
        var headers = { authorization: localStorage.getItem('token') }
        return headers;
    }

    return {

        getAllDesignations: function() {
            var promise = $q.defer();

            $http({
                url: `${BACKEND}/getAllDesignation`,
                headers: setHeaders(),
                method: 'GET'
            }).then(function(allDesignation) {
                promise.resolve(allDesignation.data);

            }, function(error) {
                promise.reject(error.data);

            })

            return promise.promise;
        },

        addDesignation: function(designation) {
            var promise = $q.defer();

            $http({
                url: `${BACKEND}/addDesignation`,
                headers: setHeaders(),
                method: 'POST',
                data: {
                    designation: designation
                }
            }).then(function(successfullyAdded) {
                promise.resolve(successfullyAdded.data);

            }, function(error) {
                promise.reject(404)

            })


            return promise.promise;
        },

        updateDesignation: function(designation) {
            var promise = $q.defer();

            $http({
                url: `${BACKEND}/updateDesignation`,
                method: 'PUT',
                headers: setHeaders(),
                data: {
                    designation: designation
                }
            }).then(function(success) {
                promise.resolve(success.data);

            }, function(error) {
                promise.reject(error.data);

            })

            return promise.promise;
        },

        deleteDesignation: function(designation_id) {
            var promise = $q.defer();

            $http({
                method: 'DELETE',
                headers: setHeaders(),
                url:`${BACKEND}/deleteDesignation/${designation_id}`
            }).then(function(status) {
                promise.resolve(status.data);

            }, function(error) {
                promise.reject('item not deleted');

            })

            return promise.promise;
        }
    }
}])