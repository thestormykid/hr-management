management.controller('employeeRegistrationCtrl',['$scope', 'designationService', 'createShiftService', 'employeeService', function($scope, designationService, createShiftService, employeeService) {

    $scope.allEmployees = [];
    $scope.allDesignations = [];
    $scope.allShifts = [];
    $scope.employee = {};
    $scope.toggleButton = 'add';

    $scope.selectShiftId = function() {
        if (!$scope.employee.shiftName) {
            return;
        }

        var shiftName = _.find($scope.allShifts, function(_shift) {
            return _shift.shiftName == $scope.employee.shiftName;
        })

        $scope.employee.shiftId = shiftName.id;
        console.log($scope.employee);
    }

    $scope.selectDesignationId = function() {
        if(!$scope.employee.designationName) {
            return;
        }

        var designation = _.find($scope.allDesignations, function(_designation) {
            return _designation.name == $scope.employee.designationName;
        })


        $scope.employee.designationId = designation.id;
    }

    $scope.createEmployee = function() {
        var _employee = {};
        Object.assign(_employee, $scope.employee);

        employeeService.addEmployee(_employee)
            .then(function(allEmployees) {
                $scope.allEmployees = allEmployees;
                flushDetails();
                console.log($scope.allEmployees);

            }, function(error) {
                console.log('not able to add employees');

            })
    }


    function flushDetails() {
        $scope.employee = {};
        $scope.toggleButton = 'add';
        $scope.myForm.$setPristine();

    }


    function getData() {

        employeeService.getAllEmployee()
            .then(function(allEmployees) {
                $scope.allEmployees = allEmployees;
                console.log($scope.allEmployees);

            }, function(error) {
                console.log('not able to fetch employee');

            })

        designationService.getAllDesignations()
            .then(function (fetchedDesignations) {
                $scope.allDesignations = fetchedDesignations.allDesignation;
                console.log('all designations', $scope.allDesignations);

            }, function(error) {
                console.log('not able to fetch desinations');

            })

        createShiftService.getAllShifts()
            .then(function(fetchedShifts) {
                $scope.allShifts = fetchedShifts.allShifts;
                console.log('all shifts');

            }, function (error) {
                console.log('not able to fetch shifts');

            })
    }

    getData();
}])