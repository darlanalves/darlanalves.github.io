title: 'Start using components in AngularJS today!'
type: angular
lang: en
date: 2016-02-13 14:48:07
tags:
- angular
- components
---

Starting with version 1.5, AngularJS supports a special directive type called [component](https://docs.angularjs.org/guide/component).
You should start using them today! Let's see how!

<!-- more -->

The idea of web components and custom HTML tags has been around for a while. Using them in our apps can lead to a better organization and a clear separation of concerns.

In this article we will write a simple todo list using the new component syntax. Bear with me!

## So what's the deal?

Components are just directives, but having a configuration slightly smaller than the usual.

First of all, they are directives that have the `restrict` option set to __E__. That means only element directives are allowed.

The second change is the declaration of scope bindings. Instead of having a `bindToController` option set to `true` and a `scope` option with our bindings, we will use only a `bindings` option. The `controllerAs` default value is __$ctrl__.

The `compile`, `link`, `priority` and `terminal` options are not allowed, and scopes are always isolated.

Another small difference is the a binding signal, `<`, that means one-way binding. Effectively, this is a watcher on outer scope that keeps a local property on controller in sync, but won't change the outer scope if we modify it locally. So the bindings is always from outer to inner scope.

## TL;DR

- components always have a controller
- $ctrl is the default alias
- components are directives of type `element` only. No more classes, attributes or comments!
- `bindings` instead of `scope` to inject values from the outside world in the component
- use the `$onInit` method on component class to initialize local bindings and component state, instead of doing that on constructor

When you should NOT use components:

- If you need a directive that adds behaviour to a node, like `ng-click` does
- If your directive needs to manipulate the DOM using `compile` and `link`
- If you need control of the execution order through `priority` or `terminal`
- If you need to process an attribute rather than an element

## Using "require" with a component

Another important thing that **you should keep in mind** is that now the `require` option is used as a mapping between directive controllers and properties. For example, if you have to write a custom input element and you need to use `ngModel` along with your directive, here's how the `require` option will look like:

```js
require: {
    model: 'ngModel'
}
```

The config above is telling Angular to require the "ngModel" directive's controller and assign it to a property called "model" in our controller.

A very important thing to remember is that the directives **may not be available** when the component's controller is instantiated, but is guaranteed that they are available on `$onInit` method.

## Using .component()

The syntax is very similar to a directive, with one main difference: instead of writing an injectable function to declare the directive, use an object.

Here's an example of a component:

```js

// todo-list.js

var todoList = {
    templateUrl: 'todo-list.html',
    bindings: {
        list: '<',
        onTaskClick: '&'
    }
};

// remember that the name todoList = <todo-list>
angular.module('app').component('todoList', todoList);

```

```html

<!-- todo-list.html -->
<div class="todo-list">
    <h3>To-do list</h3>
    <ul>
        <li
            ng-repeat="task in $ctrl.list"
            ng-click="$ctrl.onTaskClick({ task: task })"
            ng-class="task.done && 'done'">
            {{task.title}}
        </li>
    </ul>
</div>

```

As you can see, our component will receive the list of tasks through the `list` attribute and fire a click handler defined on `onTaskClick` attribute.

The new component will be used in the app as a custom tag. Assuming `app` is our main app controller, this is how it looks:

```html
<todo-list list="app.list" on-task-click="app.markAsDone(task)"></todo-list>
```

Our component also needs some styles to render the tasks so let's add some!

```css

todo-list { padding: 1em 0; }

todo-list li {
    cursor: pointer;
    color: #666;
    list-style: none;
    padding: .5em 0;
    border-bottom: 1px solid #eee;
}

todo-list li:before {
    content: '';
    display: inline-block;
    border-radius: 50%;
    border: 1px solid #eee;
    margin-right: 1em;
    width: 1em;
    height: 1em;
    float: left;
    margin-top: 4px;
    line-height: 1em;
    text-align: center;
}

todo-list li.done {
    text-decoration: line-through;
}

todo-list li.done:before {
    background-color: #eee;
    content: "✓";
}

```

## Component tree

Ideally, our entire application should be a tree made out of small and focused components.

So let's also create a component for our app!

```js

// todo-app.js

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
    templateUrl: 'todo-app.html',
});

```

```html

<!-- todo-app.html -->

<div class="app">
    <todo-list list="app.list" on-task-click="app.markAsDone(task)"></todo-list>
    <form ng-submit="app.addTask()" class="form">
        <h3>Add task</h3>
        <div class="form-group">
            <input type="text" ng-model="app.newTask" class="form-control" />
            <button class="btn btn-primary" type="submit" ng-disabled="!app.newTask">Save</button>
        </div>
    </form>
</div>

```

And that's it! Let's see our component in action:

{% raw %}
<div data-app="components">
    <todo-app></todo-app>
</div>

<script data-src="/post_files/5ef343fc57/todo-app.js"></script>
<script data-src="/post_files/5ef343fc57/todo-list.js"></script>
<style data-src="/post_files/5ef343fc57/todo-list.css"></style>
{% endraw %}

