management.controller('designationCtrl', ['$scope', 'designationService', 'salaryComponentService',
    function($scope, designationService, salaryComponentService) {

    $scope.allComponents = [];
    $scope.deletedComponents = [];
    $scope.allDesignations = [];
    $scope.search = {};
    $scope.nameFilter="";
    $scope.toggleButton = 'add';
    $scope.designation = {
        id: new Date().getTime(),
        name: null,
        components: []
    };

    var hulla = new hullabaloo();

    $scope.componentSelected = function(component, _component) {
        var componentCopy = {};
        Object.assign(componentCopy, component);
        $scope.addToComponentList(componentCopy);

        Object.assign(component, _component);
        removeFromComponentList(_component);
        $scope.search.nameFilter = "";
    }

    function removeFromComponentList(_component) {
         var deletedComponent = _.remove($scope.allComponents, function(singleComponent) {
            return _component._id == singleComponent._id;

         })

        $scope.deletedComponents.push(deletedComponent);
    }

    $scope.deleteRow = function(component) {
        _.remove($scope.designation.components, function(singleComponent) {
            return component._id == singleComponent._id;
        })

        $scope.addToComponentList(component);
    }

    $scope.addToComponentList = function(component) {
        if (!component.componentName) {
            return;
        }

        $scope.allComponents.push(component);
    }


    $scope.addDesignationRow = function() {
        // if($scope.designation.components)
        var component = {};
        $scope.designation.components.push(component);

    }

    $scope.showDesignationForm = function() {

        $scope.myForm.$setPristine();
        var component = _.find($scope.allComponents, function(component) {
            return component.componentName == 'basic';
        })

        if (!component) {
            hulla.send('create basic component first', 'info');
            return;

        }

        $scope.displayDesignation = true;
        $scope.designation.components.push(component);
        $scope.componentSelected({}, component);
    }

    $scope.deleteSingleDesignation = function(_designation) {

        designationService.deleteDesignation(_designation._id)
            .then(function(status) {
                hulla.send(status, 'success');
                $scope.allDesignations = getAllDesignations();

            }, function(error) {
                hulla.send('designation is not deleted', 'danger');

            })
    }

    $scope.addData = function() {

        if(checkDesignationNameForDuplication()) {
            hulla.send('designation name already exists', 'danger');
            return;

        }

        if(!checkContainsBasic()) {
            hulla.send('add basic component', 'info');
            return;
        }

        var salary = $scope.totalAmount($scope.designation.components);
        $scope.designation.amount = salary;

        designationService.addDesignation($scope.designation)
            .then(function(dataStatus) {
                $scope.allDesignations = getAllDesignations();
                $scope.allComponents = getAllComponents();
                hulla.send('data Successfully added', 'success');
                flushData();

            }, function(error) {
                hulla.send('an error has occured!', 'danger');

            })
    }

    $scope.editData = function() {
        if(checkDesignationNameForDuplication()) {
            hulla.send('this designation already exists','danger');
            return;

        }

        if (!checkContainsBasic()) {
            hulla.send('add basic salary', 'info');
            return;

        }

        designationService.updateDesignation($scope.designation)
            .then(function(status) {
                hulla.send('designation updated successfully','success');
                $scope.toggleButton = 'add';
                flushData();

            }, function(error) {
                hulla.send('designation not updated','danger');

            })
    }

    function checkContainsBasic() {
        return _.find($scope.designation.components, function(component) {
            return component.componentName == 'basic';
        })
    }

    function checkDesignationNameForDuplication() {
        var x = _.find($scope.allDesignations, function(singleDesignation) {
            if ($scope.designation._id != singleDesignation._id) {
                return $scope.designation.name == singleDesignation.name;
            }

        })

        return x;
    }

    $scope.editSingleDesignation = function(singleDesignation) {
        $scope.toggleButton = 'edit';
        $scope.designation = {
            name: singleDesignation.name,
            _id: singleDesignation._id,
            components:[]
        }

        _.forEach(singleDesignation.components, function(singleComponent) {
            var obj = Object.assign({}, singleComponent);
            $scope.designation.components.push(obj);
            removeFromComponentList(singleComponent);

        });

    }

    $scope.flushData = function() {
        flushData();

    }

    function flushData() {
        $scope.designation = {
            id: new Date().getTime(),
            name: null,
            components: []
        };

        $scope.displayDesignation = false;
        getAllDesignations();
        getAllComponents();
    }


    $scope.totalAmount = function(componentList) {
        var totalSalary = 0.0;

        var basicSalary = _.find(componentList, function(_component) {
            return _component.componentName == 'basic';
        })

        _.forEach(componentList, function(_component) {
            if (_component.componentType == 'allowance') {
                if (_component.salaryType == 'amount') {
                    totalSalary += _component.salaryValue;

                } else {
                    totalSalary = totalSalary * (1 + (_component.salaryValue / 100));
                }
            } else {
                if (_component.salaryType == 'amount') {
                    totalSalary -= _component.salaryValue;

                } else {
                    totalSalary = totalSalary * (1 - basicSalary.salaryValue / 100);

                }
            }
        })

        return totalSalary.toFixed(2);
    }

    function getAllDesignations() {

        designationService.getAllDesignations()
            .then(function (allDesignation) {
                $scope.allDesignations = allDesignation;

            }, function (error) {
                console.log("error occured in fetching the designations");

            })

    }

    function getAllComponents() {

        salaryComponentService.getAllComponent()
            .then(function(allComponents) {
                $scope.allComponents = allComponents;

            }, function(error) {
                console.log('error occured in fetching all Components');

            })
    }

    // bootstrapping the application
    getAllComponents();
    getAllDesignations()

    $scope.selectClass = function(componentType) {
        if (componentType=='allowance') {
                return 'allowance';

        } else {
                return 'reduction';
        }
    }

}])