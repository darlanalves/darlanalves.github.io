title: 'Using ES5 getters/setters with prototype'
type: js
date: 2015-11-21 01:55:00
tags:
- es5
- experiments
---

Today I will show you how to use functions to read/write a property of an object using `Object.defineProperty` and how to inherit the getters/setters in the prototype

<!-- more -->

First of all, if you don't know the `Object.defineProperty` method, let's do a quick recap:

> The Object.defineProperty() method defines a new property directly on an object, or modifies an existing property on an object, and returns the object. -- [From MDN](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object/defineProperty) --

You can define a property of an object and configure its behaviour, like the visibility of this property in the object or whether the property can or cannot be written.

Today I will use two handful configurations here: `get` and `set`. Both are functions that will be called when we read and write to a property. In other words, they are the well known getters and setters of a property.


## Customize a property

Now we can define a property in any object with a pair of functions to read/write it:

```
var object = {};

var config = {
	get: function() { return this.__foo; },
	set: function(value) { this.__foo = value; }
};

Object.defineProperty(object, 'foo', config);

```

Our `object` above will write to `__foo` when we execute a statement like this: `object.foo = 1;`. And, as expected, the same property will be used to read the value of `foo` if we read from `object.foo`.

## Using as a prototype

Now is the interesting part: we could use `object` as a prototype of a constructor, and new objects created from this prototype will also inherit the custom property!

Let's modify the example above:

```
function Test() {
	this.values = {};
}

var prototype = {
	constructor: Test
};

Test.prototype = prototype;

var fooConfig = {
	get: function() { return this.values.foo; },
	set: function(value) { this.values.foo = value; }
};

Object.defineProperty(prototype, 'foo', fooConfig);

var one = new Test();

// assigning a value to foo will call the 'set' function above
// which in turn will write to 'this.values' instead

one.foo = 1;

console.log(one.values);

```

The output expected in a console is this:

```
{ foo: 1 }
```

## The a-ha moment

So, what's going on here?

We defined a custom property in the `prototype` object, which as a getter and a setter for `foo`. When we read and write `foo`, we are actually writing to a different object in `this.values`. And when we used this `prototype` object as the base of our `Test` constructor, this configuration was also inherited in the new objects created with `new Test()`.

This is specially useful if you want to control the read and write of properties in an object.

Think about a model class! Now you can write a class that saves the modified properties in a different place, and you can detect if an object was modified or not.

Cool, isn't it?
