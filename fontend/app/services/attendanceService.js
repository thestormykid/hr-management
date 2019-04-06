management.factory('attendanceService', ['$http', '$q', function($http, $q) {

    var headers = { authorization: localStorage.getItem('token') }

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
        },

        getUserAttendance: function() {
            var promise = $q.defer();

            $http({
                url: `${BACKEND}/getUserAttendance`,
                method: 'GET',
                headers: headers

            }).then(function(success) {
                promise.resolve(success.data);

            }, function(error) {
                promise.reject(error.data);

            })

            return promise.promise;
        }
    }
}])