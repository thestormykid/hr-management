management.controller('workingShiftsCtrl', ['$scope', '$uibModal','workingShiftService', function($scope, $uibModal, workingShiftService) {

    $scope.factor = {};
    $scope.factor.type = 'allowance';
    $scope.factor.timeType = 'minutes';
    $scope.allFactors = [];
    $scope.allShifts;
    var hulla = new hullabaloo();
    $scope.toggleButton = 'add';


    $scope.createShiftFactors = function() {
        if (checkForDuplicateFactorName()) {
            hulla.send('same factor name exists with same shift name', 'info')
            return;

        }

        workingShiftService.createShiftFactor($scope.factor)
            .then(function(insertedFactor) {
                hulla.send('shift factor created successfully', 'success');
                $scope.allFactors.push(insertedFactor.factor);
                flushDetails();

            }, function(error) {
                console.log('shift cannot be created');

            })
    }

    function checkForDuplicateFactorName(factor) {
        var x = _.find($scope.allFactors, function(singleFactor) {
            if (factor != singleFactor) {
                if ($scope.factor.factorName == singleFactor.factorName)
                    return $scope.factor.shiftName == singleFactor.shiftName;

            }
        })

        return x;
    }

    $scope.editShiftFactors = function() {
        var _factor = _.find($scope.allFactors, function(singleFactor) {
            return singleFactor.id = $scope.factor.id;
        })

        if (checkForDuplicateFactorName(_factor)) {
            hulla.send('same factor name exists with same shift name', 'info')
            return;

        }

        Object.assign(_factor, $scope.factor);

        workingShiftService.editFactorDetails($scope.allFactors)
            .then(function(editedFactors) {
                if (editedFactors.status == 200) {
                    hulla.send('factor updated successfully', 'success');
                    flushDetails();

                }

            }, function(error) {
                console.log('some error has occured');

            })
    }

    $scope.editFactor = function(factor) {
        Object.assign($scope.factor, factor);
        $scope.toggleButton = 'edit';

    }

    $scope.deleteFactor = function(factorNeedToBeDeleted) {
        var findUpdatedFactor;

        if ($scope.factor.factorId) {
            findUpdatedFactor = _.find($scope.allFactors, function(singleFactor) {
                return $scope.factor.id == singleFactor.id;
            })

        }

        workingShiftService.removeFactor(factorNeedToBeDeleted).then(function(removedFactor) {
            if (factorNeedToBeDeleted == findUpdatedFactor) {
                flushDetails()
            }

            $scope.allFactors = removedFactor.data;
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
        $scope.factor.type = 'allowance';
        $scope.factor.timeType = 'minutes';
        $scope.myForm.$setPristine();
        $scope.toggleButton = 'add';

    }

    function getAllShifts() {
        workingShiftService.getAllShifts()
            .then(function(data) {
                if (data.status == 200) {
                    $scope.allShifts = data.allShifts;
                    console.log($scope.allShifts);

                }

            }, function(error) {
                console.log('something went wrong while fetching the data');

            })

    }

    function getAllFactors() {
        workingShiftService.getAllFactors()
            .then(function(data) {
                if (data.status == 200) {
                    $scope.allFactors = data.allFactors;
                    console.log($scope.allFactors);
                }
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