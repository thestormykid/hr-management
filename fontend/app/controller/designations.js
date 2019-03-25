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

        addToComponentList(component);
    }

    function addToComponentList(component) {
        if (!component.componentName) {
            return;
        }

        $scope.allComponents.push(component);

    }


    $scope.addDesignationRow = function() {
        var component = {};
        $scope.designation.components.push(component);

    }

    $scope.showDesignationForm = function () {
        $scope.displayDesignation = true;
        $scope.myForm.$setPristine();

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

        var dataToBeAdd = {};
        dataToBeAdd.components = [];

        dataToBeAdd.name = $scope.designation.name;

        _.forEach($scope.designation.components, function(component) {
            dataToBeAdd.components.push(component._id);
        })


        designationService.addDesignation(dataToBeAdd)
            .then(function(dataStatus) {
                $scope.allDesignations = getAllDesignations();
                hulla.send('data Successfully added', 'success')
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

        designationService.updateDesignation($scope.allDesignations)
            .then(function(status) {
                if (status == 200) {
                    hulla.send('designation updated successfully','success');
                    flushData();
                    $scope.toggleButton = 'add';

                }
            }, function(error) {
                hulla.send('designation not updated','danger');

            })
    }

    function checkDesignationNameForDuplication() {
        var x = _.find($scope.allDesignations, function(singleDesignation) {
            if ($scope.designation.id != singleDesignation.id) {
                return $scope.designation.name == singleDesignation.name;
            }

        })

        return x;
    }

    $scope.editSingleDesignation = function(singleDesignation) {
        $scope.toggleButton = 'edit';
        $scope.designation = singleDesignation;

        _.forEach(singleDesignation.components, function(singleComponent) {
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
                }   else {
                    totalSalary += totalSalary*(1 + basicSalary.salaryValue/100);

                }

            } else {
                if (_component.salaryType=='amount') {
                    totalSalary -= _component.salaryValue;

                }   else {

                    totalSalary -= totalSalary*(1 + basicSalary.salaryValue/100);

                }
            }
        })

        return totalSalary.toFixed(2);
    }

    function getAllDesignations() {

        designationService.getAllDesignations()
            .then(function (allDesignation) {
                $scope.allDesignations = allDesignation;
                console.log(allDesignation);
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