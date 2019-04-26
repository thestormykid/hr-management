management.factory('forumService', ['$q', '$http', function($q, $http) {

    function setHeaders() {
        var headers = { authorization: localStorage.getItem('token') }
        return headers;
    }

    return  {

        sendNotification: function(adminSocket, notif) {
            var promise = $q.defer();

            adminSocket.emit('send-notification', notif, setHeaders());

            adminSocket.on('get-notif-ack', function(data) {
                if (data.status == 200) {
                    promise.resolve(data.message);

                } else {
                    promise.reject(data.message);

                }
            })

            return promise.promise;
        },

        getAllNotification: function() {
            var promise = $q.defer();

            $http({
                url: `${BACKEND}/get-all-notification`,
                method: 'GET',
                headers: setHeaders()

            }).then(function(success) {
                promise.resolve(success.data);

            }, function(reject) {
                promise.reject(success.data);

            })

            return promise.promise;
        }
    }

}])