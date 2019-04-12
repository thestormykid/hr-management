management.factory('workingShiftService', ['$http', '$q',  function($http, $q) {

    function setHeaders() {
        var headers = { authorization: localStorage.getItem('token') }
        return headers;
    }

    return {

        createShiftFactor: function(singleFactor) {
            var promise = $q.defer();

                $http({
                    url: `${BACKEND}/addFactor`,
                    method: 'POST',
                    headers: setHeaders(),
                    data: {
                        factor: singleFactor
                    }

                }).then(function(success) {
                    promise.resolve(success.data);

                }, function(error) {
                    promise.reject(error.data);

                })

            return promise.promise;
        },

        removeFactor: function(factorNeedToBeDeleted) {
            var promise = $q.defer();

            $http({
                url: `${BACKEND}/removeFactor/${factorNeedToBeDeleted._id}`,
                headers: setHeaders(),
                method:'DELETE'

            }).then(function(success) {
                promise.resolve(success.data);

            }, function (error) {
                promise.reject(error.data);

            })

            return promise.promise;
        },

        editFactorDetails: function(factor) {
            var promise = $q.defer();

            $http({
                url:`${BACKEND}/updateFactor`,
                headers: setHeaders(),
                method:'PUT',
                data: {
                    factor: factor
                }
            }).then(function(success) {
                promise.resolve(success.data);

            }, function (error) {
                promise.reject(error.data);

            })


            return promise.promise;
        },

        getAllFactors: function() {
            var promise = $q.defer();

            $http({
                url: `${BACKEND}/getAllFactor`,
                headers: setHeaders(),
                method: 'GET'
            }).then(function(success) {
                promise.resolve(success.data);

            }, function(error) {
                promise.reject(error.data);

            })


            return promise.promise;
        },

        getSelectedFactors: function(shiftId) {
            var promise = $q.defer();

            $http({
                url: `${BACKEND}/getSelectedFactors?id=${shiftId}`,
                headers: setHeaders(),
                method: 'GET'

            }).then(function(success) {
                promise.resolve(success.data);

            }, function(error) {
                promise.reject(error.data);

            })

            return promise.promise;
        }
    }
}])