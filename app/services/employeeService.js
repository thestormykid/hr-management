management.factory('employeeService', ['$q', '$http', function($q, $http) {

    function getAllDesignationData() {
        return JSON.parse(localStorage.getItem('designation'));
    }

    function getAllShifts() {
        return JSON.parse(localStorage.getItem('workingShifts'));

    }

    function getAllEmployee() {
        return JSON.parse(localStorage.getItem('employees'));
    }

    function setAllEmployee(allEmployee) {
        return localStorage.setItem('employees', JSON.stringify(allEmployee));
    }

    return {

        addEmployee: function(employee) {
            var promise = $q.defer();

            var allEmployees = getAllEmployee();
            if (allEmployees == null || allEmployees == "" || allEmployees == undefined) {
                allEmployees = [];
            }

            employee.id = new Date().getTime();

            allEmployees.push(employee);
            setAllEmployee(allEmployees);

            promise.resolve(allEmployees);
            return promise.promise;

        },

        updateEmployee: function(updatedEmployee) {
            var promise = $q.defer();

            if (updatedEmployee) {
                var allEmployees = getAllEmployee();

                var needToBeUpdated = _.find(allEmployees, function (singleEmployee) {
                    return singleEmployee.id = updatedEmployee.id;
                })

                console.log(updatedEmployee, needToBeUpdated);

                Object.assign(needToBeUpdated, updatedEmployee);
                console.log(allEmployees);
                setAllEmployee(allEmployees);

                promise.resolve(allEmployees);

            } else {
                promise.reject(404);

            }

            return promise.promise;
        },

        getAllEmployee: function() {
            var promise = $q.defer();

            var allEmployees = getAllEmployee();
            if (allEmployees == null || allEmployees == "" || allEmployees == undefined) {
                promise.resolve([]);
            }

            promise.resolve(allEmployees);

            return promise.promise;
        },

        removeEmployee: function(_employee) {
            var promise = $q.defer();

            if (_employee) {
                var allEmployee = getAllEmployee();

                _.remove(allEmployee, function (singleEmployee) {
                    return singleEmployee.id == _employee.id;
                })

                setAllEmployee(allEmployee);
                promise.resolve(allEmployee);

            } else {
                promise.reject(404);

            }

            return promise.promise;
        }
    }

}])