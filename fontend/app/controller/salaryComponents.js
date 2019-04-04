management.controller('salaryComponentsCtrl', ['$uibModal', '$log', '$scope','salaryComponentService', function($uibModal, $log, $scope, salaryComponentService) {

    $scope.allComponents = [];
    $scope.component = {};

    $scope.component.componentName;
    $scope.component.salaryValue;
    $scope.component.salaryType = 'amount';
    $scope.component.componentType = 'allowance';
    $scope.component.editableType = 'editable';
    $scope.component.componentId;
    $scope.component.isDeleteable = false;

    $scope.toggleButton = 'add';
    var hulla = new hullabaloo();


    $scope.addSalaryComponent = function() {
        if (!checkValidations()) {
            return;

        }

        if (checkForDuplicateComponentName()) {
            hulla.send('name already exists', 'danger');
            return;

        }

        salaryComponentService.addComponent($scope.component)
            .then(function(insertedData) {
                hulla.send('component added successfully', 'success');
                $scope.getData();
                flushDetails();

            }, function(error){
                hulla.send('something went wrong', 'danger');

            })

    }

    $scope.editComponentDetails = function() {
        var _component = _.find($scope.allComponents, function(singleComponent) {
            return $scope.component_id == singleComponent.id;
        })

        if (!checkValidations()) {
            return;
        }

        if (checkForDuplicateComponentName(_component)) {
            hulla.send('name already exits', 'danger');
            return;
        }

        Object.assign(_component, $scope.component);

        salaryComponentService.updateComponet(_component)
            .then(function(status) {
                    hulla.send('item updated successfully', 'success');
                    $scope.getData();
                    flushDetails();

            }, function(errorStatus) {
                hulla.send('item not updated successfully', 'danger');

            })

    }

    $scope.deleteSingleComponent = function(componentNeedToBeDeleted) {
        var findUpdatedComponent;

        if ($scope.component._id) {
            findUpdatedComponent = _.find($scope.allComponents, function(singleComponent) {
                return $scope.component._id == singleComponent._id;
            })
        }

        salaryComponentService.removeComponent(componentNeedToBeDeleted)
            .then(function(removedComponent) {
                if (findUpdatedComponent) {
                    flushDetails()
                }

                $scope.allComponents = $scope.getData();
                hulla.send(`component deleted successfully`, 'success');

            }, function(error) {
                console.log(error);
                hulla.send('item not deleted', 'danger');

            })

    }


    $scope.editComponent = function(_component) {
        Object.assign($scope.component, _component);
        $scope.toggleButton = 'update';

    }

    $scope.getData = function() {
        salaryComponentService.getAllComponent()
            .then(function(data) {
                $scope.allComponents = data;

            }, function(error) {
                hulla.send('not able to fetch data', 'danger');

            })
    }


    $scope.getData();

    $scope.cancelUpdation = function() {
        flushDetails();

    }


    function flushDetails() {
        $scope.component = {};
        $scope.component.salaryType = 'amount';
        $scope.component.componentType = 'allowance';
        $scope.component.editableType = 'editable';
        $scope.component.isDeleteable = false;
        $scope.toggleButton = 'add';
        $scope.myForm.$setPristine();
    }

    $scope.startsWith = function (actual, expected) {
        console.log(actual, expected);
        var lowerStr = (actual + "").toLowerCase();
        return lowerStr.indexOf(expected.toLowerCase()) === 0;

    }

    function checkValidations() {

        if (!/^[a-zA-Z]/.test($scope.componentName)) {
            hulla.send('only letters are allowed', 'info');
            return false;

        }

        return true;
    }

    function checkForDuplicateComponentName(component) {
        var x = _.find($scope.allComponents, function(singleComponent) {
            if (component != singleComponent) {
                return $scope.componentName == singleComponent.componentName;
            }
        })

        return x;
    }
}])