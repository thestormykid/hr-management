management.controller('createShiftsCtrl', ['$scope', 'createShiftService', function($scope, createShiftService) {

    $scope.shift = {};
    $scope.allShifts = [];
    $scope.toggleButton = 'add';


    $scope.createShift = function() {
        if (checkForDuplicateShiftName()) {
            alert('this component name already exists enter different name');
            return;

        }
        var timeStatus = timeValidation();
        console.log(timeStatus);

        if(timeStatus.status) {
            alert(timeStatus.message);
            return;
        }

        // add shift
        createShiftService.createShift($scope.shift)
            .then(function(shift) {
                if (shift.status == 200) {
                    $scope.allShifts = shift.allShifts;
                    flushDetails();
                    console.log('shift added successfully');

                }

            }, function(error) {
                console.log('error in adding a new shift');

            })

    }

    function timeValidation(shift) {
        var checkStatus = {
            status: false,
            message:""
        }

        if ($scope.shift.startingTime > $scope.shift.endingTime) {
            checkStatus.status = true;
            checkStatus.message = "starting time can't be more than ending time";
        }

        _.forEach($scope.allShifts, function(singleShift) {
            // partial overlap
            if (!shift || shift.id != singleShift.id) {
                if (Date.parse($scope.shift.startingTime) >= Date.parse(singleShift.startingTime) && Date.parse($scope.shift.startingTime)
                    <= Date.parse(singleShift.endingTime)) {
                    checkStatus.status = true;
                    checkStatus.message = 'the time range you want is occupied';
                }

                if ($scope.shift.endingTime >= singleShift.startingTime && $scope.shift.endingTime <= singleShift.endingTime) {
                    checkStatus.status = true;
                    checkStatus.message = 'the time range you want is occupied';


                }

                if ($scope.shift.startingTime <= singleShift.startingTime && $scope.shift.endingTime >= singleShift.endingTime) {
                    checkStatus.status = true;
                    checkStatus.message = 'the time range you want is occupied';
                }
            }

        })

        return checkStatus;
    }

    function checkForDuplicateShiftName(shift) {
        var x = _.find($scope.allShifts, function(singleShift) {
            if (shift != singleShift) {
                return $scope.shift.shiftName == singleShift.shiftName;
            }

        })

        return x;
    }

    $scope.editShift = function(_shift) {
        $scope.shift = {};
        $scope.shift.startingTime = new Date(_shift.startingTime);
        $scope.shift.endingTime = new Date(_shift.endingTime);
        $scope.shift.id = _shift.id;
        $scope.shift.shiftName = _shift.shiftName;
        $scope.toggleButton = 'update';

    }

    $scope.editShiftDetails = function() {
        var _shift = _.find($scope.allShifts, function(singleShift) {
            return $scope.shift.id == singleShift.id;
        })

        if (checkForDuplicateShiftName(_shift)) {
            alert('this component name already exists enter different name');
            return;
        }

        var timeStatus = timeValidation(_shift);

        if (timeStatus.status) {
            alert(timeStatus.message);
            return;

        }

        Object.assign(_shift, $scope.shift);

        createShiftService.updateShift($scope.allShifts, _shift)
            .then(function(status) {
                if (status == 200) {
                    console.log('item updated successfully');
                    flushDetails();

                }
            }, function(errorStatus) {
                console.log('item not updated successfully');

            })

    }

    $scope.deleteSingleShift = function(shiftNeedToBeDeleted) {
        var findUpdatedShift;

        if ($scope.shift.id) {
            findUpdatedShift = _.find($scope.allShifts, function(singleShift) {
                return $scope.shift.id == singleShift.id;
            })

        }

        createShiftService.removeShift(shiftNeedToBeDeleted).then(function(removedShift) {
            if (shiftNeedToBeDeleted == findUpdatedShift) {
                flushDetails()
            }

            $scope.allShifts = removedShift.allShifts;

            console.log('shift deleted successfully');

        }, function(error) {
            console.log("item not deleted");
        })

    }

    $scope.cancelShift = function() {
        flushDetails();

    }

    function flushDetails() {
        $scope.shift = {}
        $scope.myForm.$setPristine();
        $scope.toggleButton = 'add';
    }

    $scope.startsWith = function (actual, expected) {
        console.log(actual, expected);
        var lowerStr = (actual + "").toLowerCase();
        return lowerStr.indexOf(expected.toLowerCase()) === 0;
    }

    $scope.getData = function() {
        createShiftService.getAllShifts().then(function(data) {
            console.log(data);
            $scope.allShifts = data.allShifts;
            console.log($scope.allShifts);

        }, function() {
            alert('something went wrong');
        })
    }


    $scope.getData();

}])