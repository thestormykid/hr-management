management.controller('attendanceCtrl',['$scope', 'employeeService', 'designationService', 'createShiftService', '$uibModal', 'attendanceService', '$location', '$rootScope', function($scope, employeeService,
     designationService, createShiftService, $uibModal, attendanceService, $location, $rootScope) {

    $scope.userDetails = {};
    $scope.userId;
    $scope.attendanceList;
    $scope.allEmployees = [];
    $scope.allDesignations = [];
    $scope.allShifts = [];
    $scope.filter = {};
    var hulla = new hullabaloo();

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
        attendanceService.applyFilter($scope.filter, $scope.userId)
            .then(function(success) {
                $scope.attendanceList = success.filteredList;

            }, function(error) {
                console.log(error);

            })
    }

    $scope.updateDatePicker2 = function() {
        $scope.options2.maxDate = $scope.filter.endingDate;

        attendanceService.applyFilter($scope.filter, $scope.userId)
            .then(function(success) {
                $scope.attendanceList = success.filteredList;
                console.log('filter applied');

            }, function(error) {
                console.log('error');

            })
    }

    function getAttendance(id) {
        attendanceService.getUserAttendance(id)
            .then(function(userInfo) {
                $scope.userDetails = userInfo.user;
                $scope.attendanceList = userInfo.attendanceList;

            }, function() {

            })
    }


    $scope.deleteAttendance = function(attendanceId) {
        attendanceService.deleteAttendance(attendanceId)
            .then(function(message) {
                hulla.send(message, 'success');
                var user = $location.search();
                getAttendance(user.userData);

            }, function(error) {
                console.log(error);

            })
    }

    // when reports are watched by the admin
    if ($rootScope.isAdmin) {
        var userDetails = $location.search().userData;
        $scope.userId = JSON.parse(userDetails).employeeDetails;
        getAttendance(userDetails);

    } else {
        getAttendance();

    }


    $scope.approveAttendance = function() {

        var seggregatedIsApproved = _.groupBy($scope.attendanceList, 'isApproved');
        var helperList = [];

        _.forEach(seggregatedIsApproved.true, function(singleAttendance) {
            helperList.push(singleAttendance._id);
        })

        attendanceService.approveAttendance(helperList)
            .then(function(success) {
                hulla.send(success.message, 'success');

            }, function(failure) {
                hulla.send(success.message, 'danger');

            })

    }

    $scope.open = function () {

        var modalInstance = $uibModal.open({
            animation: true,
            ariaLabelledBy: 'modal-title',
            ariaDescribedBy: 'modal-body',
            templateUrl: 'markAttendance.html',
            controller: 'attendanceMarkingCtrl',
            controllerAs: '$scope',
            windowClass: 'show',
            resolve: {
                data: function () {
                    return $scope.userDetails;
                }
            }
        });

        modalInstance.result.then(function(status) {
            if (status == 'success') {
                hulla.send('attendance marked', 'success');
                getAttendance()
                
            }

        }, function() {

        });
    };
}])

management.controller('attendanceMarkingCtrl', function ($uibModalInstance, designationService, createShiftService, employeeService,
                                                         $scope, workingShiftService, data, attendanceService) {

    $scope.allFactors = [];
    $scope.employee = data;
    $scope.attendance = {};
    $scope.format = 'dd-MMMM-yyyy';
    $scope.factor = [];
    var hulla = new hullabaloo();

    $scope.open1 = function() {
        $scope.popup1.opened = true;

    };

    $scope.popup1 = {
        opened: false
    };

    $scope.markAttendance = function() {
        $scope.attendance.employeeDetails = $scope.employee._id;
        $scope.attendance.amount = calculateSalary();

        attendanceService.markAttendance($scope.attendance)
            .then(function(attendanceStatus) {
                console.log(attendanceStatus);
                if (attendanceStatus == 'attendance present') {
                    hulla.send('attendance already marked', 'info');

                } else {
                    $uibModalInstance.close('success');

                }

            }, function(error) {
                $uibModalInstance.close(error);

            })
    }

    function getTime(time) {
       var newTime = moment(time).format('HH:mm').split(':');

       var minutes = (+newTime[0]) * 60 + (+newTime[1]);
       return minutes;
    }

    function calculateSalary() {
        var expectedStartingTime = Date.parse($scope.employee.shiftId.startingTime);
        var expectedEndingTime = Date.parse($scope.employee.shiftId.endingTime);
        var startingTime = Date.parse($scope.attendance.startingTime);
        var endingTime = Date.parse($scope.attendance.endingTime);
        var amountPerDay = $scope.employee.designationId.amount/30;
        var startingMinutes = getTime(startingTime);
        var endingMinutes = getTime(endingTime);
        var expectedStartingMinutes = getTime(expectedStartingTime);
        var expectedEndingMinutes = getTime(expectedEndingTime);
        var allowance = $scope.factor[0].type == 'allowance' ? $scope.factor[0]: $scope.factor[1];
        var reduction = $scope.factor[0].type=='reduction' ? $scope.factor[0]:$scope.factor[1];
        var allowanceAmount = 0;
        var reductionAmount = 0;

        if (allowance) {
           allowanceAmount =  allowance.amount/allowance.time;
        }

        if (reduction) {
            reductionAmount = reduction.amount/reduction.time;
        }

        if (endingTime< expectedStartingTime || startingTime>expectedEndingTime) {
            amountPerDay = Math.abs((endingMinutes - startingMinutes)*allowanceAmount);

        } else if (startingTime> expectedStartingTime && endingTime< expectedEndingTime) {
            amountPerDay +=  -(startingMinutes-expectedStartingMinutes)*reductionAmount - (expectedEndingMinutes-endingMinutes)*reductionAmount
            amountPerDay = amountPerDay <= 0 ? 0: amountPerDay;

        } else if (startingTime < expectedStartingTime && endingTime > expectedEndingTime) {
            amountPerDay += ((expectedStartingMinutes-startingMinutes) + (endingMinutes - expectedEndingMinutes))*allowanceAmount;

        } else if (startingTime > expectedStartingTime && endingTime > expectedEndingTime) {
            amountPerDay += (endingMinutes-expectedEndingMinutes)*allowanceAmount - (startingMinutes - expectedStartingMinutes)*reductionAmount

        } else if (startingTime < expectedStartingTime && endingTime < expectedEndingTime) {
            amountPerDay += (expectedStartingMinutes - startingMinutes)*allowanceAmount - (expectedEndingMinutes-endingMinutes)*reductionAmount;

        }

        return amountPerDay.toFixed(2);
    }

    $scope.cancelUpdation = function() {
        $uibModalInstance.dismiss('cancel');

    }

    function getSelectedFactors() {
        workingShiftService.getSelectedFactors($scope.employee.shiftId._id)
            .then(function(allFactors) {
                $scope.allFactors = allFactors;

            }, function(failure) {
                console.log('not able to fetch factors');

            })
    }

    function getFactor() {
        workingShiftService.getSelectedFactors($scope.employee.shiftId._id)
            .then(function(factor) {
                $scope.factor = factor;

            }, function(error) {

            })
    }

    getFactor();
    getSelectedFactors();
});
