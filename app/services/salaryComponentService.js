management.factory('salaryComponentService', ['$http','$q', function($http, $q) {

    function getSalaryCompoentData() {
        return JSON.parse(localStorage.getItem('salaryComponent'));

    }

    function setSalaryComponentData(allComponents) {
        localStorage.setItem('salaryComponent', JSON.stringify(allComponents));

    }

    function getAllDesignationData() {
        return JSON.parse(localStorage.getItem('designation'));
    }

    function setAllDesignationData(allDesignations) {
        localStorage.setItem('designation', JSON.stringify(allDesignations));
    }

    return {

        addComponent: function(componentName, salaryType, value, componentType, editableType, callback) {
            var dataToBeInserted = {};
            var uniqueId = new Date().getTime();
            var data = getSalaryCompoentData();
            // id = dt.getTime();

            if (data == null || data == undefined || data == "") {
                data = [];
            }

            dataToBeInserted.componentName = componentName;
            dataToBeInserted.salaryType = salaryType;
            dataToBeInserted.salaryValue = value;
            dataToBeInserted.componentType = componentType;
            dataToBeInserted.editableType = editableType;
            dataToBeInserted.id = uniqueId;

            data.push(dataToBeInserted);
            setSalaryComponentData(data);

            var dataToBeSend = {
                status: 200,
                data: data
            }

            console.log(data);

            callback(dataToBeSend);
        },

        removeComponent: function(componentNeedToBeDeleted) {
            var promise = $q.defer();

            var deletedComponent = {};
            var data = getSalaryCompoentData();

            _.remove(data, function(singleComponent) {
                return singleComponent.id == componentNeedToBeDeleted.id;
            })

            setSalaryComponentData(data);

            if (data) {
                deletedComponent.status = 200;
                deletedComponent.data = data;
                promise.resolve(deletedComponent);

            } else {
                deletedComponent.status = 404;
                promise.reject(deletedComponent);

            }

            return promise.promise;
        },

        updateComponet: function(allComponents, component) {

            var promise = $q.defer();

            if (allComponents) {
                setSalaryComponentData(allComponents)
                var allDesignations = getAllDesignationData();

                _.forEach(allDesignations, function(singleDesignation) {
                    var needToBeUpdatedComponent = _.find(singleDesignation.components, function(singleComponent) {
                        return component.id == singleComponent.id;
                    })

                    if (needToBeUpdatedComponent) {
                        Object.assign(needToBeUpdatedComponent, component);

                    }
                })

                setAllDesignationData(allDesignations);

                promise.resolve(200)

            } else {
                promise.reject(404)
            }

            return promise.promise;
        },

        getAllComponent: function() {
            var promise = $q.defer();
            var data = getSalaryCompoentData();

            if (data) {
                promise.resolve(data);

            } else {
                promise.reject(null);
            }

            return promise.promise;
        }
    }
}])