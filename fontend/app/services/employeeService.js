management.factory('employeeService', ['$q', '$http', function($q, $http) {

    return {

        addEmployee: function(employee) {
            var promise = $q.defer();

            $http({
                url:`${BACKEND}/addEmployee`,
                method:'POST',
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
                method: 'DELETE'
            }).then(function(success) {
                promise.resolve(success.data);

            }, function(error) {
                promise.reject(error.data);

            })

            return promise.promise;
        }

    }

}])