management.factory('attendanceService', ['$http', '$q', function($http, $q) {

    var headers = { authorization: localStorage.getItem('token') }

    return {

        markAttendance: function(attendanceDetails) {
            var promise = $q.defer();

            $http({
                url: `${BACKEND}/markAttendance`,
                method: 'POST',
                headers: headers,
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

        getUserAttendance: function(userId) {
            var promise = $q.defer();

            // console.log(userId);
            $http({
                url: `${BACKEND}/getUserAttendance?uId=${userId}`,
                method: 'GET',
                headers: headers

            }).then(function(success) {
                promise.resolve(success.data);

            }, function(error) {
                promise.reject(error.data);

            })

            return promise.promise;
        },

        deleteAttendance: function(id) {
            var promise = $q.defer();

            $http({
                url:`${BACKEND}/deleteAttendance/${id}`,
                method: 'DELETE',

            }).then(function(success) {
                promise.resolve(success.data);

            }, function(error) {
                promise.reject(error.data);

            })

            return promise.promise;
        }
    }
}])