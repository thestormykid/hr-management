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

        getAllComponents: function() {

            var promise =  $q.defer();
            var allComponents = getSalaryComponentData();
            var dataToBeSend = {};

            if (allComponents) {
                dataToBeSend.status = 200;
                dataToBeSend.allComponents = allComponents;
                promise.resolve(dataToBeSend);

            } else {
                dataToBeSend.status = 404;
                dataToBeSend.allComponents = [];
                promise.reject(dataToBeSend);

            }

            return promise.promise
        },

        getAllDesignations: function() {
            var promise = $q.defer();
            var allDesignations = getAllDesignationData();
            var dataToBeSend = {};

            console.log(allDesignations);

            if (allDesignations) {
                dataToBeSend.status = 200;
                dataToBeSend.allDesignation = allDesignations;
                promise.resolve(dataToBeSend);

            } else {
                dataToBeSend.status = 404;
                dataToBeSend.allDesignations = [];
                promise.reject(dataToBeSend);

            }

            return promise.promise;
        },

        insertDesignation: function(designation) {
            var promise = $q.defer();

            var allDesignations = getAllDesignationData();
            if (allDesignations == ""  || allDesignations ==undefined || allDesignations == null) {
                allDesignations = [];
            }

            var status = allDesignations.push(designation);
            if (!isNaN(status)) {
                promise.resolve(200);

            } else {
                promise.reject(404)

            }

            setAllDesignationData(allDesignations);

            console.log(allDesignations);

            return promise.promise;
        },

        updateDesignation: function(allDesignation) {
            var promise = $q.defer();


            if (allDesignation) {
                setAllDesignationData(allDesignation);
                promise.resolve(200);

            } else {
                promise.reject(400);

            }

            return promise.promise;

        },

        deleteDesignation: function(allDesignation) {
            var promise = $q.defer();

            if (allDesignation) {
                setAllDesignationData(allDesignation);
                promise.resolve(200);

            } else {
                promise.reject('somoe error occured');

            }

            return promise.promise;
        }
    }
}])