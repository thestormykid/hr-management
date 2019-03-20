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

        getAllEmployee: function() {
            var promise = $q.defer();

            var allEmployees = getAllEmployee();
            if (allEmployees == null || allEmployees == "" || allEmployees == undefined) {
                promise.resolve([]);
            }

            promise.resolve(allEmployees);

            return promise.promise;
        }
    }

}])