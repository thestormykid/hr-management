management.controller('salaryComponentsCtrl', ['$uibModal', '$log', '$scope','salaryComponentService', function($uibModal, $log, $scope, salaryComponentService) {

    $scope.allComponents = [];
    $scope.componentName;
    $scope.salaryValue;
    $scope.selectedSalaryType = 'amount';
    $scope.selectedComponentType = 'reduction';
    $scope.selectedEditableType = 'editable';
    $scope.toggleButton = 'add';
    $scope.componentId;

    $scope.animationsEnabled = true;

    $scope.addSalaryComponent = function() {
        if (!checkValidations()) {
            return;

        }

        if (checkForDuplicateComponentName()) {
            alert('this component name already exists enter different name');
            return;

        }

        salaryComponentService.addComponent($scope.componentName, $scope.selectedSalaryType, $scope.salaryValue,
            $scope.selectedComponentType, $scope.selectedEditableType, function(insertedData) {
            if (insertedData.status == "200") {
                $scope.allComponents = insertedData.data;
                console.log($scope.allComponents);
                flushDetails();

            } else {
                alert('something went wrong!!! ');
            }
        })
    }

    $scope.editComponentDetails = function() {
        var _component = _.find($scope.allComponents, function(singleComponent) {
            return $scope.componentId == singleComponent.id;
        })

        if (!checkValidations()) {
            return;
        }

        if (checkForDuplicateComponentName(_component)) {
            alert('this component name already exists enter different name');
            return;
        }

        _component.componentName    = $scope.componentName;
        _component.salaryValue      = $scope.salaryValue;
        _component.salaryType       = $scope.selectedSalaryType;
        _component.componentType    = $scope.selectedComponentType;
        _component.editableType     = $scope.selectedEditableType;

        salaryComponentService.updateComponet($scope.allComponents, _component).then(function(status) {
            console.log(status);
            if (status == 200) {
                console.log('item updated successfully');
                flushDetails();
            }

        }, function(errorStatus) {
            console.log('item not updated successfully');

        })

    }

    $scope.deleteSingleComponent = function(componentNeedToBeDeleted) {
        var findUpdatedComponent;

        if ($scope.componentId) {
            findUpdatedComponent = _.find($scope.allComponents, function(singleComponent) {
                return $scope.componentId == singleComponent.id;
            })

        }

        salaryComponentService.removeComponent(componentNeedToBeDeleted).then(function(removedComponent) {
            if (componentNeedToBeDeleted == findUpdatedComponent) {
                flushDetails()
            }
            $scope.allComponents = removedComponent.data;

            console.log('component deleted successfully');

        }, function(error) {
            console.log("item not deleted");
        })

    }


    $scope.editComponent = function(_component) {
        $scope.componentId = _component.id;
        $scope.componentName = _component.componentName;
        $scope.salaryValue = _component.salaryValue;
        $scope.selectedSalaryType = _component.salaryType;
        $scope.selectedComponentType = _component.componentType;
        $scope.editableType = _component.editableType;
        $scope.toggleButton = 'update';

    }

    $scope.getData = function() {
        salaryComponentService.getAllComponent().then(function(data) {
            console.log(data);
            $scope.allComponents = data;

        }, function() {
            alert('something went wrong');
        })
    }


    $scope.getData();

    $scope.cancelUpdation = function() {
        flushDetails();

    }


    function flushDetails() {
        $scope.componentName = null;
        $scope.salaryValue = null;
        $scope.selectedSalaryType = 'amount';
        $scope.selectedComponentType = 'reduction';
        $scope.selectedEditableType = 'editable';
        $scope.toggleButton = 'add';
        $scope.componentId = null;
        $scope.myForm.$setPristine();
        // console.log($scope.myForm.$pristine)
        // $scope.myForm.$pristine = true;
        console.log($scope.myForm.$pristine)
    }

    $scope.startsWith = function (actual, expected) {
        console.log(actual, expected);
        var lowerStr = (actual + "").toLowerCase();
        return lowerStr.indexOf(expected.toLowerCase()) === 0;

    }

    function checkValidations() {

        if (!/^[a-zA-Z]/.test($scope.componentName)) {
            alert('only letters are allowed');
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