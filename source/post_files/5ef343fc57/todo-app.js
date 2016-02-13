(function () {
    function Task(title, done) {
        this.title = title;
        this.done = done || false;
    }

    function AppController() {
        var ctrl = this;

        this.list = [
            new Task('Laundry', true),
            new Task('Dishes'),
            new Task('Find nemo')
        ];

        this.addTask = function () {
            ctrl.list.push(new Task(ctrl.newTask));
            ctrl.newTask = '';
        };

        this.markAsDone = function (task) {
            task.done = !task.done;
        };
    }

    angular.module('components', []).component('todoApp', {
        controller: AppController,
        controllerAs: 'app',
        templateUrl: '/post_files/5ef343fc57/todo-app.html',
    });
})();