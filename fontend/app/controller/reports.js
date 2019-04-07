management.controller('reportsCtrl', ['$scope', 'employeeService', 'designationService', 'createShiftService', 'attendanceService', '$location', '$state',
    function($scope, employeeService, designationService, createShiftService, attendanceService, $location, $state) {

    $scope.allEmployees = [];
    $scope.allShifts = [];
    $scope.allDesignations = [];
    var hulla = new hullabaloo();


    $scope.findEmployees = function() {
        var filter = {};

        if ($scope.filter&&$scope.filter.designation) {
            filter.designationId = JSON.parse($scope.filter.designation)._id;

        }

        if ($scope.filter&&$scope.filter.shift) {
            filter.shiftId = JSON.parse($scope.filter.shift)._id;

        }

        attendanceService.getSelectedEmployees(filter)
            .then(function(allEmployees) {
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

    $scope.singleUserReport = function(employee) {
        $location.path('/attendance').search({userData: JSON.stringify(employee)});

    }

    $scope.deleteAttendance = function(attendanceId) {
        attendanceService.deleteAttendance(attendanceId)
            .then(function(message) {
                hulla.send(message, 'success');
                $scope.findEmployees();

            }, function(error) {
                console.log(error);

            })
    }

    function getAllDesignations() {
        designationService.getAllDesignations()
            .then(function(allDesignations) {
                $scope.allDesignations = allDesignations;
                // console.log($scope.allDesignations);

            }, function(failure) {
                console.log("can't fetch all designations");

            })
    }

    function getAllShifts() {
        createShiftService.getAllShifts()
            .then(function(allShifts) {
                $scope.allShifts = allShifts;
                // console.log($scope.allShifts);

            }, function(failure) {
                console.log("can't fetch shift details");

            })
    }

    getAllDesignations();
    getAllShifts();

}])