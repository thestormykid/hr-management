management.factory('workingShiftService', ['$http', '$q',  function($http, $q) {

    function setAllFactors(allFactors) {
        localStorage.setItem('shiftFactor', JSON.stringify(allFactors));

    }

    function getAllFactors() {
        return JSON.parse(localStorage.getItem('shiftFactor'));

    }

    function getAllShifts() {
        return JSON.parse(localStorage.getItem('workingShifts'));

    }

    return {

        createShiftFactor: function(singleFactor) {
            var promise = $q.defer();
            var allFactors;

            if (singleFactor) {
                allFactors = getAllFactors();
                var allShifts = getAllShifts();

                if (allFactors == "" ||allFactors== undefined || allFactors == null) {
                    allFactors = [];
                }

                var shift = _.find(allShifts, function(singleShift) {
                    return singleFactor.shiftName == singleShift.shiftName;
                })

                singleFactor.shiftId = shift.id;
                singleFactor.id = new Date().getTime();

                allFactors.push(singleFactor);
                setAllFactors(allFactors);

                promise.resolve({
                    status: 200,
                    factor: singleFactor
                });

            } else {
                promise.reject(400);

            }

            return promise.promise;
        },

        removeFactor: function(factorNeedToBeDeleted) {
            var promise = $q.defer();

            var deletedFactor = {};
            var data = getAllFactors();

            _.remove(data, function(singleFactor) {
                return singleFactor.id == factorNeedToBeDeleted.id;
            })

            setAllFactors(data);

            if (data) {
                deletedFactor.status = 200;
                deletedFactor.data = data;
                promise.resolve(deletedFactor);

            } else {
                deletedFactor.status = 404;
                promise.reject(deletedFactor);

            }

            return promise.promise;
        },

        editFactorDetails: function(allFactors) {
          var promise = $q.defer();

          if (allFactors) {
              setAllFactors(allFactors);
              promise.resolve({
                  status: 200
              })

          } else {
              promise.reject({
                  status: 400
              })
          }

          return promise.promise;
        },

        getAllFactors: function() {
            var promise = $q.defer();

            var allFactors = getAllFactors();

            if (!allFactors) {
                allFactors = [];
            }

            promise.resolve({
                allFactors: allFactors,
                status: 200
            })

            return promise.promise;
        },

        getAllShifts: function() {
            var promise = $q.defer();

            var allShifts = getAllShifts();

            if (!allShifts) {
                allShifts = [];
            }

            promise.resolve({
                allShifts: allShifts,
                status: 200
            });

            return promise.promise;
        }
    }
}])