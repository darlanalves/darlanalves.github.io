title: Gisele - a model library
icon: js
lang: en
date: 2015-09-28 00:12:26
tags:
- es6
---

Today I'll show a little library (~6kb) written in 2 days with ES6 + Babel. I called it Gisele, a super model.

<!-- more -->

## So what this library does?

It is a wrapper to JS objects, plus a little type system, based on Constructors.
It works like this: you will give a set of fields to a factory and it will return a function that you use to instantiate models.

```
var User = Gisele.Model.create({
    id: { type: Number, readOnly: true },
    name: String,
    email: String,
    active: { type: Boolean, default: false }
});
```

In the snippet above I have a new `model` called *User*. It can be used to build user instances.
 But what it does that could not be done with a POJO?

```
var bob = new User({
    id: 1,
    name: 'Bob',
    email: 'bob@example.com'
});
```

Bob is now an instance of User. So far, nothing really surprising. But there's a trick I used from ES5 that allows to define getters and setters for any object property.

## How it works

The fields you give to the `Model.create()` factory are transformed into a custom property on each model instance. When you instantiate a model, a getter/setter pair of functions is defined for each field, to read values from an internal state object, not the instance itself. Whenever a field is changed, the setter function is called to write in the same internal object.

This is done [with `Object.defineProperty` method](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object/defineProperty).

The field values are stored apart from the instance, so the model state can be changed or restored through instance methods. This enables an easier tracking of changes to be saved. For example, a model instance can be attached to fields in a form. This works perfectly with frameworks like [AngularJS](https://angular.io/). The model exposes a property `$$dirty` that flags a changed model.

Look at this example:

```
<form ng-submit="user.$$.commit()">
    <label>
        Name:
        <input type="text" ng-model="user.name" />
    </label>
    <label>
        E-mail:
        <input type="text" ng-model="user.email" />
    </label>
    <button type="submit" ng-disabled="!user.$$dirty">Save</button>
    <button type="button" ng-disabled="!user.$$.rollback()">Discard</button>
</form>
```

So, in our example, if I change Bob's name or email, this can be reverted with a simple method call. The changes can also be applied to our original data, so it becomes one (the original data + the changes).

You can see it [in action here](http://embed.plnkr.co/LoelLSh54ZEzmSopSU7F/preview).

## The Field class

Along with the Model class, there's also `Gisele.Field`, which is a base class to define new fields.

Here's an example of how I define a new field type called `Point`. This snippet is ES6.

```
// Constructor
class Point {
    constructor(pair) {
        this.x = pair.x || 0;
        this.y = pair.y || 0;
    }
}

// Field definition
class PointField extends Gisele.Field {
    parseValue(value) {
        return value ? new Point(value) : null;
    }

    toJSON(value) {
        return {
            x: value.x,
            y: value.y
        };
    }
}

// declare our new type
Gisele.Field.register.add(Point, PointField);
```

From now on, we can declare a model using this type. There is one rule to follow here: the constructor must have only one argument. Since we are dealing with model fields, which represent a single value on a model, we can't declare a constructor that deals with more than one data unit.

We can also define some methods to our new model. Let's try it:

```
var Rectangle = Gisele.Model.create({
    fields: {
        topLeft: Point,
        bottomRight: Point
    },

    methods: {
        area() {
            let width = this.bottomRight.x - this.topLeft.x;
            let height = this.bottomRight.y - this.topLeft.y;

            return width * height;
        },

        save() {
            var data = this.toJSON();
            // ... save data somewhere
            this.$$.commit();
        }
    }
});

var rect = new Rectangle({
    topLeft:        { x: 10, y: 10 },
    bottomRight:    { x: 15, y: 15 }
});

console.log(rect.area())
// outputs 25

```

As you can see, the field declaration is a combination of a Constructor function and a Field subclass.

### Extending the model methods

The base class to all the models has a property that points to a prototype shared with every instance of our models. I'm talking about `Model.fn`, an object with some methods already defined on it.

When a new model instance is created, it receives a property named `$$`, which gives access to model`s inner methods. They are not part of our model`s prototype to avoid conflicts with property names.

Let's override the default `commit` method with a new function:

```
var commit = Gisele.Model.fn.commit;

Gisele.Model.fn.commit = function() {
    console.log('Changes applied', this.changed);
    commit.call(this);
};

```

Now everytime the model changes are applied, the changes are printed to the console. More methods can be added to this property as well. From a model custom method, the `commit` here can be accessed as `this.$$.commit`, as you can see in the Rectangle example above.

### Demos

Here's the examples above running:

{% raw %}
<div data-app="test" ng-controller="TestCtrl">
    <p>Hello <b>{{user.name}}</b>!</p>
    <form ng-submit="user.$$.commit()" class="form">
        <div class="form-group">
            <label class="form-label">
                Name:
            </label>
            <input type="text" ng-model="user.name" class="form-control" />
            <label class="form-label">
                E-mail:
            </label>
            <input type="text" ng-model="user.email" class="form-control" />
        </div>
        <div class="form-group">
            <button class="btn btn-primary" type="submit" ng-disabled="!user.$$dirty">Save</button>
            <button class="btn btn-default" type="button" ng-click="!user.$$.rollback()" ng-disabled="!user.$$dirty">Discard</button>
        </div>
    </form>
</div>
<script data-src="https://cdn.rawgit.com/darlanalves/gisele/v0.1.1/dist/gisele.js"></script>
<script data-src="/post_files/177b217cf0-Gisele-a-model-library.js"></script>

{% endraw %}

Fin.