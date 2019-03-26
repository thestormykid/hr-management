management.factory('designationService', ['$http','$q', function($http, $q) {

    function getSalaryComponentData() {
        return JSON.parse(localStorage.getItem('salaryComponent'));

    }

    function getAllDesignationData() {
        return JSON.parse(localStorage.getItem('designation'));
    }

    function setAllDesignationData(allDesignations) {
        localStorage.setItem('designation', JSON.stringify(allDesignations));
    }

    return {

        getAllDesignations: function() {
            var promise = $q.defer();

            $http({
                url: `${BACKEND}/getAllDesignation`,
                method: 'GET'
            }).then(function(allDesignation) {
                promise.resolve(allDesignation.data);

            }, function(error) {
                promise.reject(error.data);

            })

            return promise.promise;
        },

        addDesignation: function(designation) {
            var promise = $q.defer();

            $http({
                url: `${BACKEND}/addDesignation`,
                method: 'POST',
                data: {
                    designation: designation
                }
            }).then(function(successfullyAdded) {
                promise.resolve(successfullyAdded.data);

            }, function(error) {
                promise.reject(404)

            })


            return promise.promise;
        },

        updateDesignation: function(designation) {
            var promise = $q.defer();

            console.log(designation);

            $http({
                url: `${BACKEND}/updateDesignation`,
                method: 'PUT',
                data: {
                    designation: designation
                }
            }).then(function(success) {
                promise.resolve(success.data);

            }, function(error) {
                promise.reject(error.data);

            })

            return promise.promise;
        },

        deleteDesignation: function(designation_id) {
            var promise = $q.defer();

            $http({
                method: 'DELETE',
                url:`${BACKEND}/deleteDesignation/${designation_id}`
            }).then(function(status) {
                promise.resolve(status.data);

            }, function(error) {
                promise.reject('item not deleted');

            })

            return promise.promise;
        }
    }
}])