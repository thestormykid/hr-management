management.controller('reportsCtrl', ['$scope', 'employeeService', 'designationService', 'createShiftService', 'attendanceService',
    function($scope, employeeService, designationService, createShiftService, attendanceService) {

    $scope.allEmployees = [];
    $scope.allShifts = [];
    $scope.allDesignations = [];
    var hulla = new hullabaloo();


    $scope.findEmployees = function() {
        var filter = {};

        if ($scope.filter.designation) {
            filter.designationId = JSON.parse($scope.filter.designation)._id;
        }

        if ($scope.filter.shift) {
            filter.shiftId = JSON.parse($scope.filter.shift)._id;
        }

        attendanceService.getSelectedEmployees(filter)
            .then(function(allEmployees) {
                hulla.send('employee fetched', 'info');
                $scope.allEmployees = allEmployees;
                console.log(allEmployees);

            }, function(error) {
                console.log(error);

            })
    }

    $scope.formatTime = function(time) {
      return moment(time).format('HH:mm');

    }

    $scope.formatDate = function(date) {
        return moment(date).format('DD/MM/YYYY');

    }

    function getAllDesignations() {
        designationService.getAllDesignations()
            .then(function(allDesignations) {
                $scope.allDesignations = allDesignations;

            }, function(failure) {
                console.log("can't fetch all designations");

            })
    }

    function getAllShifts() {
        createShiftService.getAllShifts()
            .then(function(allShifts) {
                $scope.allShifts = allShifts;

            }, function(failure) {
                console.log("can't fetch shift details");

            })
    }

    getAllDesignations();
    getAllShifts();

}])