management.factory('workingShiftService', ['$http', '$q',  function($http, $q) {

    function setAllFactors(allFactors) {
        localStorage.setItem('shiftFactor', JSON.stringify(allFactors));

    }

    function getAllFactors() {
        return JSON.parse(localStorage.getItem('shiftFactor'));

    }

    function getAllShifts() {
        return JSON.parse(localStorage.getItem('workingShifts'));

    }

    return {

        createShiftFactor: function(singleFactor) {
            var promise = $q.defer();

                $http({
                    url: `${BACKEND}/addFactor`,
                    method: 'POST',
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