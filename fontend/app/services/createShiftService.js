management.factory('createShiftService', ['$q', '$http', function($q, $http) {

    function setHeaders() {
        var headers = { authorization: localStorage.getItem('token') }
        return headers;
    }

    return {

        createShift: function(singleShift) {
            var promise = $q.defer();
            singleShift.factor = [];

            $http({
                url: `${BACKEND}/addShift`,
                method: 'POST',
                headers: setHeaders(),
                data :{
                    shift: singleShift
                }

            }).then(function(success) {
                promise.resolve(success.data);

            }, function(error) {
                promise.reject('shift not created');

            })

            return promise.promise;
        },

        getAllShifts: function() {
            var promise = $q.defer();

            $http({
                url: `${BACKEND}/getAllShifts`,
                headers: setHeaders(),
                method: 'GET'

            }).then(function(allShifts) {
                promise.resolve(allShifts.data);

            }, function(error) {
                promise.reject(error.data);

            })

            return promise.promise;
        },

        removeShift: function(shiftNeedToBeRemoved) {
            var promise = $q.defer();

            $http({
                url: `${BACKEND}/removeShift/${shiftNeedToBeRemoved._id}`,
                headers: setHeaders(),
                method: 'DELETE',
            }).then(function(success) {
                promise.resolve(success.data);

            }, function(error) {
                promise.reject(error.data);

            })

            return promise.promise;
        },

        updateShift: function(shift) {
            var promise = $q.defer();

            $http({
                url:`${BACKEND}/updateShift`,
                headers: setHeaders(),
                method: 'PUT',
                data: {
                    shift: JSON.stringify(shift)
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