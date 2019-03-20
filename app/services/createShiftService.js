management.factory('createShiftService', ['$q', function($q) {

    function addAllShifts(allShifts) {
        localStorage.setItem('workingShifts', JSON.stringify(allShifts));

    }

    function getAllShifts() {
        return JSON.parse(localStorage.getItem('workingShifts'));

    }

    return {

        createShift: function(singleShift) {

            var promise = $q.defer();
            var allShifts;

            if (singleShift) {
                allShifts = getAllShifts();
                if (allShifts == "" || allShifts == undefined || allShifts == null) {
                    allShifts = [];
                }

                singleShift.id = new Date().getTime();

                allShifts.push(singleShift);
                addAllShifts(allShifts);

                promise.resolve({
                    status: 200,
                    allShifts: allShifts
                });

            } else {
                promise.reject(400);

            }

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
        },

        removeShift: function(shiftNeedToBeRemoved) {
            var promise = $q.defer();

            if(shiftNeedToBeRemoved) {
                var allShifts = getAllShifts();
                var removedData = _.remove(allShifts, function(singleShift) {
                    return shiftNeedToBeRemoved.id == singleShift.id;
                })

                addAllShifts(allShifts);
                console.log(allShifts);
                promise.resolve({
                    status: 200,
                    allShifts: allShifts
                })

            } else {
                promise.reject(404);

            }

            return promise.promise;
        },

        updateShift: function(allShifts) {
            var promise = $q.defer();

            if (allShifts) {
                addAllShifts(allShifts);
                promise.resolve(200);

            } else {
                promise.reject(400);

            }

            return promise.promise;
        }

    }
}])