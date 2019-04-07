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

    $scope.open = function (employee) {
        var dataNeedToBeSend = {}
        dataNeedToBeSend.button = 'add';
        dataNeedToBeSend.allEmployees = $scope.allEmployees;

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

        modalInstance.result.then(function(status) {
            if (status=='update') {
                hulla.send('details updated', 'success');

            } else {
                hulla.send('employees added successfully', 'success');

            }

            $scope.allEmployees = getData();
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
    $scope.allEmployees = data.allEmployees

    $scope.selectShiftId = function() {
        if (!$scope.employee.shiftName) {
            return;
        }

        var shiftName = _.find($scope.allShifts, function(_shift) {
            return _shift.shiftName == $scope.employee.shiftName;
        })

        $scope.employee.shiftId = shiftName._id;
    }

    $scope.selectDesignationId = function() {
        if(!$scope.employee.designationName) {
            return;
        }

        var designation = _.find($scope.allDesignations, function(_designation) {
            return _designation.name == $scope.employee.designationName;
        })

        $scope.employee.designationId = designation._id;
    }

    $scope.createEmployee = function() {

        if(checkEmployeeCodeForDuplication()) {
            hulla.send('Employee code exists', 'info');
            return;
        }

        var _employee = {};
        Object.assign(_employee, $scope.employee);

        _employee.isAdmin = false;
        _employee.password = "12345"

        employeeService.addEmployee(_employee)
            .then(function(allEmployees) {
                $uibModalInstance.close('add');

            }, function(error) {
                console.log('not able to add employees');

            })
    }

    function checkEmployeeCodeForDuplication() {

        for(var x = 0;x < $scope.allEmployees.length;x++) {
            if ($scope.allEmployees[x].code == $scope.employee.code) {
                if ($scope.allEmployees[x]._id != $scope.employee._id) {
                    return true;

                }
            }
        }

        return false;
    }

    $scope.editEmployee = function() {
        if (checkEmployeeCodeForDuplication()) {
            hulla.send('Employee code exists', 'info');
            return;
        }

        var _employee = {};
        Object.assign(_employee, $scope.employee);

        employeeService.updateEmployee(_employee)
            .then(function(allEmployees) {
                $uibModalInstance.close('update');

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

            }, function (error) {
                console.log('not able to fetch shifts');

            })
    }

    getData();
});
