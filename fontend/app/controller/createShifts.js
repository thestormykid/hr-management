management.controller('createShiftsCtrl', ['$scope', 'createShiftService', function($scope, createShiftService) {

    $scope.shift = {};
    $scope.shift.shiftType = 'day shift';
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
                hulla.send('shift added successfully', 'success');
                getData();
                flushDetails();

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

        if ($scope.shift.shiftType == 'day shift' && Date.parse($scope.shift.startingTime) > Date.parse($scope.shift.endingTime)) {
            checkStatus.status = true;
            checkStatus.message = "starting time can't be more than ending time";

        } else if ($scope.shift.shiftTyoe=='night shift' && Date.parse($scope.shift.startingTime) < Date.parse($scope.shift.endingTime)) {
            checkStatus.status = true;
            checkStatus.message = "end time can't be less than ending time";
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
        $scope.shift._id = _shift._id;
        $scope.shift.shiftType = _shift.shiftType;
        $scope.shift.shiftName = _shift.shiftName;
        $scope.toggleButton = 'update';

    }

    $scope.editShiftDetails = function() {
        var _shift = _.find($scope.allShifts, function(singleShift) {
            return $scope.shift._id == singleShift._id;
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

        createShiftService.updateShift(_shift)
            .then(function(status) {
                hulla.send('shift updated successfully', 'success');
                $scope.allShifts = getData();
                flushDetails();


            }, function(errorStatus) {
                hulla.send('item not updated successfully', 'danger');

            })

    }

    $scope.deleteSingleShift = function(shiftNeedToBeDeleted) {
        var findUpdatedShift;

        if ($scope.shift._id) {
            findUpdatedShift = _.find($scope.allShifts, function(singleShift) {
                return $scope.shift._id == singleShift._id;
            })

        }

        createShiftService.removeShift(shiftNeedToBeDeleted)
            .then(function(removedShift) {
                if (shiftNeedToBeDeleted == findUpdatedShift) {
                    flushDetails()
                }

                $scope.allShifts = getData();
                hulla.send('shift deleted successfully','success');

                }, function(error) {
                    hulla.send('item not deleted', 'danger')

                })

    }

    $scope.formatTime = function(time) {
        var hours = new Date(time).getHours();
        var minutes = new Date(time).getMinutes();
        return (hours + ':' + minutes);
    }

    $scope.cancelShift = function() {
        flushDetails();

    }

    function flushDetails() {
        $scope.shift = {}
        $scope.myForm.$setPristine();
        $scope.toggleButton = 'add';
        $scope.shift.shiftType = 'day shift';
    }

    $scope.startsWith = function (actual, expected) {
        console.log(actual, expected);
        var lowerStr = (actual + "").toLowerCase();
        return lowerStr.indexOf(expected.toLowerCase()) === 0;
    }

    function getData() {
        createShiftService.getAllShifts().then(function(allShifts) {
            $scope.allShifts = allShifts;

        }, function(error) {
            hulla.send('something went wrong','success');

        })
    }


    getData();
}])