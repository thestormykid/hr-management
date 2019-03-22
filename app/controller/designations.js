management.controller('designationCtrl', ['$scope', 'designationService', function($scope, designationService) {

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
            return _component.id == singleComponent.id;

         })

        $scope.deletedComponents.push(deletedComponent);
    }

    $scope.deleteRow = function(component) {
        _.remove($scope.designation.components, function(singleComponent) {
            return component.id == singleComponent.id;
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

    }

    $scope.deleteSingleDesignation = function(_designation) {
        _.remove($scope.allDesignations, function(singleDesignation) {
            return _designation.id == singleDesignation.id;
        })

        designationService.deleteDesignation($scope.allDesignations)
            .then(function(status) {
                if (status == 200) {
                    console.log('item deleted successfully');
                }

            }, function(error) {
                console.log('some error occured while deleting designation');

            })
    }

    $scope.addData = function() {

        if(checkDesignationNameForDuplication()) {
            hulla.send('designation name already exists', 'danger');
            return;

        }

        designationService.insertDesignation($scope.designation)
            .then(function(dataStatus) {
                if (dataStatus == 200) {
                    hulla.send('data Successfully added', 'success')

                }

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
        $scope.myForm.$setPristine();
        getAllDesignations();
        getAllComponents();
    }

    function getAllDesignations() {

        designationService.getAllDesignations()
            .then(function (designations) {
                $scope.allDesignations = designations.allDesignation;

            }, function (error) {
                console.log("error occured in fetching the designations");

            })

    }

    function getAllComponents() {

        designationService.getAllComponents()
            .then(function(components) {
                $scope.allComponents = components.allComponents;

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