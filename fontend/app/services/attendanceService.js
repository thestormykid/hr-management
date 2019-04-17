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

        getSelectedEmployees: function(filter, pno, itemsPerPage) {
            var promise = $q.defer();

            $http({
                url:`${BACKEND}/getSelectedEmployee?filter=${JSON.stringify(filter)}&pno=${pno}&itemsPerPage=${itemsPerPage}`,
                headers: setHeaders(),
                method:'GET',

            }).then(function(success) {
                promise.resolve(success.data);

            }, function(failure) {
                promise.reject(failure.data);

            })

            return promise.promise;
        },

        getUserAttendance: function(userId, filter, pno, itemsPerPage) {
            var promise = $q.defer();

            console.log(filter);

            $http({
                url: `${BACKEND}/getUserAttendance?uId=${userId}&pno=${pno}&itemsPerPage=${itemsPerPage}&filter=${JSON.stringify(filter)}`,
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
        },

        applyFilter: function(filter, userId, pno, itemsPerPage) {
            var promise = $q.defer();

            $http({
                url: `${BACKEND}/apply-filter?filter=${JSON.stringify(filter)}&userId=${userId}&pno=${pno}&itemsPerPage=${itemsPerPage}`,
                method: 'GET',
                headers: setHeaders()

            }).then(function(success) {
                promise.resolve(success.data);

            }, function(failure) {
                promise.reject(failure.data);

            })

            return promise.promise;
        },

        getAttendanceCount: function(userId, filter) {
            var promise  = $q.defer();

            $http({
                url: `${BACKEND}/getAttendanceCount?userId=${userId}&filter=${JSON.stringify(filter)}`,
                method: 'GET',
                headers: setHeaders()

            }).then(function(success) {
                promise.resolve(success.data);

            }, function(failure) {
                promise.reject(failure.data);

            })

            return promise.promise;
        },

        getHeaders: function() {
            var promise = $q.defer();

            $http({
                url: `${BACKEND}/get-headers`,
                method: 'GET',
                headers: setHeaders()

            }).then(function(success) {
                promise.resolve(success.data);

            }, function(failure) {
                promise.reject(failure.data);

            })

            return promise.promise;
        }
    }
}])