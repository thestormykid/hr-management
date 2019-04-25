management.factory('socketService', ['$q', function($q) {

    return  {

        getUserSocket: function() {
            var userSocket = io('http://localhost:3000/user');

            return userSocket;

        },

        getAdminSocket: function() {
            var adminSocket = io('http://localhost:3000/admin');

            return adminSocket;

        }
    }
}])