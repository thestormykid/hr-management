management.factory('attendanceService', ['$http', '$q', function($http, $q) {

    return {
        markAttendance: function(attendanceDetails) {
            var promise = $q.defer();

            $http({
                url: `${BACKEND}/markAttendance`,
                method: 'POST',
                data: {
                    attendanceDetails: attendanceDetails
                }

            }).then(function(success) {
                promise.resolve(success.data);

            }, function(failure) {
                promise.reject(failure.data);

            })

            return promise.promise;
        },

        getSelectedEmployees: function(filter) {
            var promise = $q.defer();

            $http({
                url:`${BACKEND}/getSelectedEmployee?filter=${JSON.stringify(filter)}`,
                method:'GET'

            }).then(function(success) {
                promise.resolve(success.data);

            }, function(failure) {
                promise.reject(failure.data);

            })

            return promise.promise;
        }
    }
}])