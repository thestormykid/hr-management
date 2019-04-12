management.factory('attendanceService', ['$http', '$q', function($http, $q) {

    function setHeaders() {
        var headers = { authorization: localStorage.getItem('token') }
        return headers;
    }

    return {

        markAttendance: function(attendanceDetails) {
            var promise = $q.defer();

            $http({
                url: `${BACKEND}/markAttendance`,
                method: 'POST',
                headers: setHeaders(),
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
                headers: setHeaders(),
                method:'GET',

            }).then(function(success) {
                promise.resolve(success.data);

            }, function(failure) {
                promise.reject(failure.data);

            })

            return promise.promise;
        },

        getUserAttendance: function(userId) {
            var promise = $q.defer();

            $http({
                url: `${BACKEND}/getUserAttendance?uId=${userId}`,
                method: 'GET',
                headers: setHeaders()

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
                headers: setHeaders(),
                method: 'DELETE',

            }).then(function(success) {
                promise.resolve(success.data);

            }, function(error) {
                promise.reject(error.data);

            })

            return promise.promise;
        },

        approveAttendance: function(attendanceList) {
            var promise = $q.defer();

            $http({
                url: `${BACKEND}/approveAttendance`,
                method: 'PUT',
                data: {
                    approvedAttendanceList: attendanceList
                }

            }).then(function(success) {
                promise.resolve(success.data);

            }, function(failure) {
                promise.reject(failure.data);

            })


            return promise.promise;
        }
    }
}])