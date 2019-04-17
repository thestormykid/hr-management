management.controller('reportsCtrl', ['$scope', 'employeeService', 'designationService', 'createShiftService', 'attendanceService', '$location', '$state',
    function($scope, employeeService, designationService, createShiftService, attendanceService, $location, $state) {

        $scope.allEmployees = [];
        $scope.allShifts = [];
        $scope.allDesignations = [];
        $scope.filter = {};
        var hulla = new hullabaloo();

        $scope.pagination = {};
        $scope.pagination.itemsPerPage = 10;
        $scope.pagination.totalItems = 64;
        $scope.pagination.currentPage = 1;
        $scope.propertyName = 'amount';
        $scope.reverse = true;
        var dt = new Date();
        $scope.filter = {
            startingDate: new Date(dt.setDate(dt.getDate()-7)),
            endingDate: new Date(Date.now())
        };

        $scope.sortBy = function(propertyName) {
            $scope.reverse = ($scope.propertyName === propertyName) ? !$scope.reverse : false;
            $scope.propertyName = propertyName;
        };


        $scope.pageChanged = function() {
            $scope.findEmployees();
            console.log($scope.pagination.currentPage);

        }

        $scope.formatTime = function(time) {
            return moment(time).format('HH:mm');

        }

        $scope.formatDate = function(date) {
            return moment(date).format('DD/MM/YYYY');

        }

        $scope.open2 = function() {
            $scope.popup2.opened = true;
        }

        $scope.popup2 = {
            opened: false
        }

        $scope.open3 = function() {
            $scope.popup3.opened = true;
        }

        $scope.popup3 = {
            opened: false
        }

        $scope.updateDatePicker3 = function() {
            $scope.options3.minDate = $scope.filter.startingDate;

        }

        $scope.updateDatePicker2 = function() {
            $scope.options2.maxDate = $scope.filter.endingDate;

        }

        $scope.findEmployees = function() {
            var filter = {};

            if ($scope.filter&&$scope.filter.designation) {
                filter.designationId = JSON.parse($scope.filter.designation)._id;

            }

            if ($scope.filter&&$scope.filter.shift) {
                filter.shiftId = JSON.parse($scope.filter.shift)._id;

            }

            if ($scope.filter.startingDate) {
                filter.startingDate = $scope.filter.startingDate;

            }

            if ($scope.filter.endingDate) {
                filter.endingDate = $scope.filter.endingDate;

            }

            attendanceService.getSelectedEmployees(filter, $scope.pagination.currentPage, $scope.pagination.itemsPerPage)
                .then(function(allEmployees) {
                    $scope.allEmployees = allEmployees;
                    getAttendanceCount();

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

        $scope.getTableFieldData = function(employee, header) {
            console.log(header);
            for (var i=0;i<employee.factor.length;i++) {
                if (employee.factor[i].componentName == header) {
                    return employee.factor[i].salaryValue;
                }
            }

            return 0;
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

        function getAttendanceCount() {
            var filter = {};

            if ($scope.filter&&$scope.filter.designation) {
                filter.designationId = JSON.parse($scope.filter.designation)._id;

            }

            if ($scope.filter&&$scope.filter.shift) {
                filter.shiftId = JSON.parse($scope.filter.shift)._id;

            }

            if ($scope.filter.startingDate) {
                filter.startingDate = $scope.filter.startingDate;

            }

            if ($scope.filter.endingDate) {
                filter.endingDate = $scope.filter.endingDate;

            }

            attendanceService.getAttendanceCount(undefined, filter)
                .then(function (success) {
                    console.log(success.totalItems);
                    $scope.pagination.totalItems = success.totalItems;

                }, function (failure) {
                    console.log(failure);
                })
        }

        function getHeaders() {
            attendanceService.getHeaders()
                .then(function(tableHeaders) {
                    $scope.tableHeaders = _.filter(tableHeaders, function(header) {
                        if (header!='basic'&&header!='allowance'&&header!='reduction') {
                            return header;
                        }
                    })

                }, function(failure) {
                    console.log(failure);
                })

        }

        getAttendanceCount();
        getAllDesignations();
        getAllShifts()
        getHeaders();
}])