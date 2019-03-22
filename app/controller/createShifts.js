management.controller('createShiftsCtrl', ['$scope', 'createShiftService', function($scope, createShiftService) {

    $scope.shift = {};
    $scope.allShifts = [];
    $scope.toggleButton = 'add';
    var hulla = new hullabaloo();

    $scope.createShift = function() {
        if (checkForDuplicateShiftName()) {
            hulla.send('this component name already exists enter different name','danger')
            return;

        }
        var timeStatus = timeValidation();

        if(timeStatus.status) {
            hulla.send(timeStatus.message, 'danger');
            return;
        }

        // add shift
        createShiftService.createShift($scope.shift)
            .then(function(shift) {
                if (shift.status == 200) {
                    $scope.allShifts = shift.allShifts;
                    flushDetails();
                    console.log('shift added successfully');
                    hulla.send()
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

        _.forEach($scope.allShifts, function(singleShift) {

            if (!shift || shift.id != singleShift.id) {
                if (Date.parse($scope.shift.startingTime) >= Date.parse(singleShift.startingTime) && Date.parse($scope.shift.startingTime)
                    <= Date.parse(singleShift.endingTime)) {
                    checkStatus.status = true;
                    checkStatus.message = 'the time range you want is occupied';

                }

                if (Date.parse($scope.shift.endingTime) >= Date.parse(singleShift.startingTime) && Date.parse($scope.shift.endingTime) <= Date.parse(singleShift.endingTime)) {
                    checkStatus.status = true;
                    checkStatus.message = 'the time range you want is occupied';
                }

                if (Date.parse($scope.shift.startingTime) <= Date.parse(singleShift.startingTime) && Date.parse($scope.shift.endingTime) >= Date.parse(singleShift.endingTime)) {
                    checkStatus.status = true;
                    checkStatus.message = 'the time range you want is occupied';
                }
            }

        })

        if ($scope.shift.startingTime > $scope.shift.endingTime) {
            checkStatus.status = true;
            checkStatus.message = "starting time can't be more than ending time";
        }

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
            hulla.send('shift name already exists','danger');
            return;
        }

        var timeStatus = timeValidation(_shift);

        if (timeStatus.status) {
            hulla.send(timeStatus.message, 'danger');
            return;

        }

        Object.assign(_shift, $scope.shift);

        createShiftService.updateShift($scope.allShifts, _shift)
            .then(function(status) {
                if (status == 200) {
                    hulla.send('shift updated successfully', 'success');
                    flushDetails();

                }
            }, function(errorStatus) {
                hulla.send('item not updated successfully', 'danger');

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
            hulla.send('shift deleted successfully','success');

        }, function(error) {
            hulla.send('item not deleted', 'danger')

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

        }, function(error) {
            hulla.send('something went wrong','success');

        })
    }


    $scope.getData();
}])