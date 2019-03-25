management.factory('createShiftService', ['$q', '$http', function($q, $http) {

    function addAllShifts(allShifts) {
        localStorage.setItem('workingShifts', JSON.stringify(allShifts));

    }

    function getAllShifts() {
        return JSON.parse(localStorage.getItem('workingShifts'));

    }

    return {

        createShift: function(singleShift) {
            var promise = $q.defer();
            singleShift.factor = [];

            $http({
                url: `${BACKEND}/addShift`,
                method: 'POST',
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