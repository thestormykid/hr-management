management.factory('salaryComponentService', ['$http','$q', function($http, $q) {

    function setHeaders() {
        var headers = { authorization: localStorage.getItem('token') }
        return headers;
    }

    return {

        addComponent: function(component) {
            var promise = $q.defer();

            $http({
                method: 'POST',
                headers: setHeaders(),
                url: `${BACKEND}/addComponent`,
                data: {
                    data: component

                }
            }).then(function (addedComponent) {
                promise.resolve(addedComponent.data);

            }, function(error) {
                promise.reject(error);

            })

            return promise.promise;
        },

        removeComponent: function(componentNeedToBeDeleted) {
            var promise = $q.defer();

            $http({
                url: `${BACKEND}/deleteComponent/${componentNeedToBeDeleted._id}`,
                headers: setHeaders(),
                method: 'DELETE'

            }).then(function(status) {
                promise.resolve(status.data);

            }, function(error) {
                promise.reject(error);

            })

            return promise.promise;
        },

        updateComponet: function(component) {

            var promise = $q.defer();

            $http({
                url: `${BACKEND}/updateComponent`,
                headers: setHeaders(),
                method: 'PUT',
                data:  {component: JSON.stringify(component)}
            }).then(function(updatedComponent) {
                promise.resolve(updatedComponent.data);

            }, function(error) {
                promise.reject(error);

            })

            // update designation component as well for future

            // if (allComponents) {
            //     setSalaryComponentData(allComponents)
            //     var allDesignations = getAllDesignationData();
            //
            //     _.forEach(allDesignations, function(singleDesignation) {
            //         var needToBeUpdatedComponent = _.find(singleDesignation.components, function(singleComponent) {
            //             return component.id == singleComponent.id;
            //         })
            //
            //         if (needToBeUpdatedComponent) {
            //             Object.assign(needToBeUpdatedComponent, component);
            //
            //         }
            //     })
            //
            //     setAllDesignationData(allDesignations);
            //
            //     promise.resolve(200)
            //
            // } else {
            //     promise.reject(404)
            // }

            return promise.promise;
        },

        getAllComponent: function() {
            var promise = $q.defer();

            $http({
                url:`${BACKEND}/getAllComponents`,
                headers: setHeaders(),
                method: 'GET'
            }).then(function(allComponents) {
                promise.resolve(allComponents.data);

            }, function(error) {
                promise.reject(error);

            })

            return promise.promise;
        }
    }
}])