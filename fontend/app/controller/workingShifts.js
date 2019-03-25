management.controller('workingShiftsCtrl', ['$scope', '$uibModal','workingShiftService', 'createShiftService',
    function($scope, $uibModal, workingShiftService, createShiftService) {

    $scope.factor = {};
    $scope.factor.type = 'allowance';
    $scope.factor.timeType = 'minutes';
    $scope.allFactors = [];
    $scope.allShifts;
    var hulla = new hullabaloo();
    $scope.toggleButton = 'add';

    $scope.onChange = function() {
        if (!$scope.shiftDetails) {
            return;
        }
        console.log($scope.shiftDetails);
        var shift = JSON.parse($scope.shiftDetails);

        $scope.factor.shiftName = shift.shiftName;
        $scope.factor.shiftId   = shift._id;
    }

    $scope.createShiftFactors = function() {
        if (checkForDuplicateFactorName()) {
            hulla.send('same factor name exists with same shift name', 'info')
            return;

        }

        workingShiftService.createShiftFactor($scope.factor)
            .then(function(insertedFactor) {
                hulla.send('shift factor created successfully', 'success');
                $scope.allFactors = getAllFactors();
                flushDetails();

            }, function(error) {
                console.log('shift cannot be created');

            })
    }

    function checkForDuplicateFactorName(factor) {
        var x = _.find($scope.allFactors, function(singleFactor) {
            if (!factor || factor._id != singleFactor._id) {
                if ($scope.factor.factorName == singleFactor.factorName && $scope.factor.shiftName == singleFactor.shiftName)
                    return true;

            }
        })

        return x;
    }

    $scope.editShiftFactors = function() {
        var _factor = _.find($scope.allFactors, function(singleFactor) {
            return singleFactor._id = $scope.factor._id;
        })

        if (checkForDuplicateFactorName(_factor)) {
            hulla.send('same factor name exists with same shift name', 'info')
            return;

        }

        Object.assign(_factor, $scope.factor);
        console.log(_factor);
        workingShiftService.editFactorDetails(_factor)
            .then(function(editedFactors) {
                hulla.send('factor updated successfully', 'success');
                flushDetails();

            }, function(error) {
                console.log('some error has occured');

            })
    }

    $scope.editFactor = function(factor) {
        Object.assign($scope.factor, factor);
        $scope.shiftDetails = _.find($scope.allShifts, function(singleShift) {
            return singleShift.shiftName = factor.shiftName;
        })
        delete $scope.shiftDetails['$$hashKey'];
        $scope.shiftDetails = JSON.stringify($scope.shiftDetails);
        $scope.toggleButton = 'edit';

    }

    $scope.deleteFactor = function(factorNeedToBeDeleted) {
        var findUpdatedFactor;

        if ($scope.factor.factorId) {
            findUpdatedFactor = _.find($scope.allFactors, function(singleFactor) {
                return $scope.factor._id == singleFactor._id;
            })

        }

        workingShiftService.removeFactor(factorNeedToBeDeleted).then(function(removedFactor) {
            if (findUpdatedFactor && factorNeedToBeDeleted._id == findUpdatedFactor._id) {
                flushDetails()
            }

            $scope.allFactors = getAllFactors();
            hulla.send('deleted successfully', 'success');

        }, function(error) {
            console.log("item not deleted");

        })
    }

    $scope.cancelUpdation = function() {
        flushDetails();

    }

    function flushDetails() {
        $scope.factor = {};
        $scope.shiftDetails="";
        $scope.factor.type = 'allowance';
        $scope.factor.timeType = 'minutes';
        $scope.myForm.$setPristine();
        $scope.toggleButton = 'add';

    }

    function getAllShifts() {
        createShiftService.getAllShifts()
            .then(function(allShifts) {
                $scope.allShifts = allShifts;
                console.log($scope.allShifts);

            }, function(error) {
                console.log('something went wrong while fetching the data');

            })

    }

    function getAllFactors() {
        workingShiftService.getAllFactors()
            .then(function(allFactors) {
                $scope.allFactors = allFactors;

            }, function(error) {
                console.log('something went wrong while fetching the data');

            })
    }

    $scope.startsWith = function (actual, expected) {
        console.log(actual, expected);
        var lowerStr = (actual + "").toLowerCase();
        return lowerStr.indexOf(expected.toLowerCase()) === 0;

    }

    function getData() {
        getAllShifts();
        getAllFactors();

    }

    // bootstrapping this module
    getData()

}])