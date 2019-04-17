management.controller('attendanceCtrl',['$scope', 'employeeService', 'designationService', 'createShiftService', '$uibModal', 'attendanceService', '$location', '$rootScope', function($scope, employeeService,
     designationService, createShiftService, $uibModal, attendanceService, $location, $rootScope) {

    $scope.userDetails = {};
    $scope.userId;
    $scope.attendanceList;
    $scope.allEmployees = [];
    $scope.allDesignations = [];
    $scope.allShifts = [];
    var dt = new Date();
    $scope.filter = {
        startingDate: new Date(dt.setDate(dt.getDate()-7)),
        endingDate: new Date(Date.now())
    };

    var hulla = new hullabaloo();
    $scope.propertyName = 'amount';
    $scope.reverse = true;

    $scope.pagination = {};
    $scope.pagination.itemsPerPage = 10;
    $scope.pagination.totalItems = 64;
    $scope.pagination.currentPage = 1;

    $scope.sortBy = function(propertyName) {
        $scope.reverse = ($scope.propertyName === propertyName) ? !$scope.reverse : false;
        $scope.propertyName = propertyName;
    };

    $scope.pageChanged = function() {
        getData();
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
        getData();

    }

    $scope.updateDatePicker2 = function() {
        $scope.options2.maxDate = $scope.filter.endingDate;
        getData();

    }

    $scope.deleteAttendance = function(attendanceId) {
        attendanceService.deleteAttendance(attendanceId)
            .then(function(message) {
                hulla.send(message, 'success');
                getData();

            }, function(error) {
                console.log(error);

            })
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
                getData();
            }

        }, function() {

        });
    };

    function getCount(userId) {
        attendanceService.getAttendanceCount(userId, $scope.filter)
            .then(function(success) {
                console.log(success.totalItems);
                $scope.pagination.totalItems = success.totalItems;

            }, function(failure) {
                console.log(failure);

            })
    }

    function getAttendance(user) {
        attendanceService.getUserAttendance(user, $scope.filter, $scope.pagination.currentPage, $scope.pagination.itemsPerPage)
            .then(function(userInfo) {
                $scope.userDetails = userInfo.user;
                $scope.attendanceList = userInfo.attendanceList;

            }, function() {

            })
    }

    function getData() {
        // when reports are watched by the admin
        if ($rootScope.isAdmin) {
            var userDetails = $location.search().userData;
            $scope.userId = JSON.parse(userDetails).employeeDetails;
            getAttendance(userDetails);
            getCount($scope.userId);

        } else {
            getAttendance();
            getCount();
        }
    }

    getData();

}])

management.controller('attendanceMarkingCtrl', function ($uibModalInstance, designationService, createShiftService, employeeService,
                                                         $scope, workingShiftService, data, attendanceService) {
    $scope.allFactors = [];
    $scope.employee = data;
    $scope.attendance = {};
    $scope.attendance.factor = [];
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
        addFactors();


        attendanceService.markAttendance($scope.attendance)
            .then(function(attendanceStatus) {
                console.log(attendanceStatus);
                if (attendanceStatus == 'attendance present') {
                    hulla.send('attendance already marked', 'info');
                    $scope.attendance.factor = [];

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
        if ($scope.factor[0]) {
            var allowance = $scope.factor[0].type == 'allowance' ? $scope.factor[0] : $scope.factor[1];
            var reduction = $scope.factor[0].type == 'reduction' ? $scope.factor[0] : $scope.factor[1];
            if (!allowance) {
                allowance = 0;
            }
            if (!reduction) {
                reduction = 0;
            }
        } else {
            allowance = 0;
            reduction = 0;
        }
        var allowanceAmount = 0;
        var reductionAmount = 0;

        if (allowance) {
           allowanceAmount =  allowance.amount/allowance.time;
        }

        if (reduction) {
            reductionAmount = reduction.amount/reduction.time;
        }

        if (endingTime< expectedStartingTime || startingTime>expectedEndingTime) {
            addFactorToAttendance('reduction', amountPerDay)
            amountPerDay = Math.abs((endingMinutes - startingMinutes)*allowanceAmount);
            addFactorToAttendance('allowance', amountPerDay)

        } else if (startingTime > expectedStartingTime && endingTime < expectedEndingTime) {
            var reducedAmount = (startingMinutes-expectedStartingMinutes)*reductionAmount + (expectedEndingMinutes-endingMinutes)*reductionAmount;
            amountPerDay += -reducedAmount;
            amountPerDay = amountPerDay <= 0 ? 0: amountPerDay;
            addFactorToAttendance('reduction', Math.min(reducedAmount, amountPerDay));

        } else if (startingTime < expectedStartingTime && endingTime > expectedEndingTime) {
            var allowedAmount = ((expectedStartingMinutes-startingMinutes) + (endingMinutes - expectedEndingMinutes))*allowanceAmount;
            amountPerDay += allowedAmount;
            addFactorToAttendance('allowance', allowedAmount);

        } else if (startingTime > expectedStartingTime && endingTime > expectedEndingTime) {
            var allowedAmount = (endingMinutes-expectedEndingMinutes)*allowanceAmount;
            var reducedAmount = (startingMinutes - expectedStartingMinutes)*reductionAmount
            amountPerDay += allowedAmount - reducedAmount;
            addFactorToAttendance('allowance', allowedAmount);
            addFactorToAttendance('reduction', reducedAmount);

        } else if (startingTime < expectedStartingTime && endingTime < expectedEndingTime) {
            var allowedAmount = (expectedStartingMinutes - startingMinutes)*allowanceAmount;
            var reducedAmount = (expectedEndingMinutes-endingMinutes)*reductionAmount;
            amountPerDay += allowedAmount - reducedAmount;
            addFactorToAttendance('allowance', allowedAmount);
            addFactorToAttendance('reduction', reducedAmount);

        }

        return amountPerDay.toFixed(2);
    }

    $scope.cancelUpdation = function() {
        $uibModalInstance.dismiss('cancel');

    }

    function addFactorToAttendance(type, amount) {
        $scope.attendance.factor.push({
            componentType: type,
            salaryValue: amount,
            componentName: type,
            salaryType: 'amount'
        })
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

    function addFactors() {
        var components = $scope.employee.designationId.components;

        _.forEach(components, function(singleComponent) {
            if (singleComponent.salaryType == 'amount') {
                singleComponent.salaryValue = (singleComponent.salaryValue/30);
            }

            $scope.attendance.factor.push(singleComponent);
        })
    }

    getFactor();
    getSelectedFactors();

});
