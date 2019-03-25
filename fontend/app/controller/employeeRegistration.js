management.controller('employeeRegistrationCtrl',['$scope', 'designationService', 'createShiftService', 'employeeService',
    '$uibModal', function($scope, designationService, createShiftService, employeeService, $uibModal) {

        var hulla = new hullabaloo();
        $scope.allEmployees = [];


    $scope.deleteEmployee = function(employee) {

        employeeService.removeEmployee(employee)
            .then(function(allEmployees) {
                $scope.allEmployees = getData();
                hulla.send('employee successfully deleted', 'success');

            }, function(error) {
                console.log("can't able to delete employee")

            })
    }

    $scope.edit = function(employee) {
        var modalInstance = $uibModal.open({
            animation: true,
            ariaLabelledBy: 'modal-title',
            ariaDescribedBy: 'modal-body',
            templateUrl: 'myModalContent.html',
            controller: 'ModalInstanceCtrl',
            controllerAs: '$scope',
            windowClass: 'show',
            resolve: {
                employee: function () {
                    return employee;
                }
            }
        })

        modalInstance.result.then(function(allEmployee) {
            $scope.allEmployees = getData();
            hulla.send('employee details updated', 'info');

        }, function() {

        });

    }

    $scope.open = function (employee) {
        var dataNeedToBeSend = {}
        dataNeedToBeSend.button = 'add';

        if (employee) {
            dataNeedToBeSend.employeeDetails = {};
            Object.assign(dataNeedToBeSend.employeeDetails, employee)
            dataNeedToBeSend.button = 'update';
        }


        var modalInstance = $uibModal.open({
            animation: true,
            ariaLabelledBy: 'modal-title',
            ariaDescribedBy: 'modal-body',
            templateUrl: 'myModalContent.html',
            controller: 'ModalInstanceCtrl',
            controllerAs: '$scope',
            windowClass: 'show',
            resolve: {
                data: function () {
                    return dataNeedToBeSend;
                }
            }
        });

        modalInstance.result.then(function (allEmployees) {
            $scope.allEmployees = getData();
            hulla.send('employees added successfully', 'success');

        }, function() {

        });
    };


    function getData() {

        employeeService.getAllEmployee()
            .then(function(allEmployees) {
                $scope.allEmployees = allEmployees;
                console.log($scope.allEmployees);

            }, function(error) {
                console.log('not able to fetch employee');

            })

    }

    getData();

}])

management.controller('ModalInstanceCtrl', function ($uibModalInstance, designationService, createShiftService, employeeService, $scope, data) {

    $scope.allDesignations = [];
    $scope.allShifts = [];
    $scope.employee = {};
    $scope.toggleButton = 'add';
    $scope.employee = data.employeeDetails;
    var hulla = new hullabaloo();
    $scope.toggleButton  = data.button;

    $scope.selectShiftId = function() {
        if (!$scope.employee.shiftName) {
            return;
        }

        var shiftName = _.find($scope.allShifts, function(_shift) {
            return _shift.shiftName == $scope.employee.shiftName;
        })

        $scope.employee.shiftId = shiftName.id;
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
                $uibModalInstance.close(allEmployees);

            }, function(error) {
                console.log('not able to add employees');

            })
    }

    $scope.editEmployee = function() {
        var _employee = {};
        Object.assign(_employee, $scope.employee);

        employeeService.updateEmployee(_employee)
            .then(function(allEmployees) {
                $uibModalInstance.close(allEmployees)

            }, function () {

            })
    }

    $scope.cancelUpdation = function() {
        $uibModalInstance.dismiss('cancel');

    }

    function getData() {

        designationService.getAllDesignations()
            .then(function (allDesignation) {
                $scope.allDesignations = allDesignation;
                console.log('all designations', $scope.allDesignations);

            }, function(error) {
                console.log('not able to fetch desinations');

            })

        createShiftService.getAllShifts()
            .then(function(allShifts) {
                $scope.allShifts = allShifts;
                console.log($scope.allShifts);

            }, function (error) {
                console.log('not able to fetch shifts');

            })
    }

    getData();
});
