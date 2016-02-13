(function () {
    // todo-list.js

    var todoList = {
        templateUrl: '/post_files/5ef343fc57/todo-list.html',
        bindings: {
            list: '<',
            onTaskClick: '&'
        }
    };

    angular.module('components').component('todoList', todoList);
})();