management.factory('employeeService', ['$q', '$http', function($q, $http) {

    function setHeaders() {
        var headers = { authorization: localStorage.getItem('token') }
        return headers;
    }

    return {

        addEmployee: function(employee) {
            var promise = $q.defer();

            $http({
                url:`${BACKEND}/addEmployee`,
                method:'POST',
                headers: setHeaders(),
                data : {
                    employee: employee
                }

            }).then(function(success) {
                promise.resolve(success.data);

            }, function(error) {
                promise.reject(error.data);

            })

            return promise.promise;

        },

        updateEmployee: function(updatedEmployee) {
            var promise = $q.defer();

            $http({
                url: `${BACKEND}/updateEmployee`,
                method: 'PUT',
                headers: setHeaders(),
                data : {
                    employee: updatedEmployee
                }

            }).then(function(success) {
                promise.resolve(success.data);

            }, function(error) {
                promise.reject(error.data);

            })

            return promise.promise;
        },

        getAllEmployee: function() {
            var promise = $q.defer();

            $http({
                url:`${BACKEND}/getAllEmployee`,
                method: 'GET',
                headers: setHeaders(),

            }).then(function(allEmployee) {
                promise.resolve(allEmployee.data);

            }, function(error) {
                promise.reject(error.data);

            })

            return promise.promise;
        },

        removeEmployee: function(_employee) {
            var promise = $q.defer();

            $http({
                url: `${BACKEND}/removeEmployee/${_employee._id}`,
                headers: setHeaders(),
                method: 'DELETE'
            }).then(function(success) {
                promise.resolve(success.data);

            }, function(error) {
                promise.reject(error.data);

            })

            return promise.promise;
        },

        employeeDetails: function() {
            var promise = $q.defer();

            $http({
                url: `${BACKEND}/employee-details`,
                method: 'GET',
                headers: setHeaders()

            }).then(function(success) {
                promise.resolve(success.data);

            }, function(failure) {
                promise.reject(failure.data);

            })

            return promise.promise;
        },

        login: function(employee) {
            var promise = $q.defer();;

            $http({
                url: `${BACKEND}/signin`,
                method: 'POST',
                headers: setHeaders(),
                data: {
                    code: employee.code,
                    password: employee.password
                }

            }).then(function(success) {
                promise.resolve(success.data);

            }, function(failure) {
                promise.reject(failure.data);

            })

            return promise.promise;
        },

        sendEmail: function(admin) {
            var promise = $q.defer();

            $http({
                url: `${BACKEND}/sendEmail`,
                method: 'POST',
                data: {
                    mail: admin.email
                }

            }).then(function(success) {
                promise.resolve(success.data);

            }, function(error) {
                promise.reject(error.data);

            })

            return promise.promise;
        },

        updatePassword: function(password) {
            var promise  = $q.defer();

            $http({
                url: `${BACKEND}/update-password`,
                method: 'PUT',
                headers: setHeaders(),
                data: {
                  password: password
                }

            }).then(function(success) {
                promise.resolve(success.data);

            }, function(failure) {
                promise.reject(failure.data);

            })


            return promise.promise;
        }
        //
        // checkEmail: function(admin) {
        //     var promise = $q.defer();
        //
        //     $http({
        //         url: `${BACKEND}/checkEmail`,
        //         method: 'POST',
        //         data: {
        //             admin: admin
        //         }
        //
        //     }).then(function(success) {
        //         promise.resolve(success.data);
        //
        //     }, function(error) {
        //         promise.reject(error.data);
        //
        //     })
        //
        //     return promise.promise;
        // }
    }
}])