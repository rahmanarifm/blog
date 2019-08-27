---
layout: post
title: "How to check if array is empty?"
date: 2019-08-23
tags: [javascript]
permalink: "/posts/array-isempty/"
---

Writing code and had to check if an array was empty, however a suggestion was raised with the code I was using.
```js
arr.length === 0
```
The suggestion was to use the ember built in library, `isEmpty`, had me thinking, because I've written `is-really-empty` npm package as more of a joke againt the ember `isEmpty` function. It mostly just checks the `length` property anyway.
```js
// from ember.js/packages/@ember/-internals/metal/lib/is_empty.ts
  if (typeof obj.length === 'number' && objectType !== 'function') {
    return !obj.length;
  }

  if (objectType === 'object') {
    let length = get(obj, 'length');
    if (typeof length === 'number') {
      return !length;
    }
  }
```

Which, there are many ways to check if an array is empty

#### The simple boys
```js
const arr = [];

arr.length === 0 // true
arr.length <= 0 // true
Boolean(arr.length) // true or if(arr.length)
```


#### The weird boy
```js
arr == !arr // true
// this will also return true for arr = [0]
```

#### the big boy
```js
(arr => {
 for(var a in arr) {
   return false;
 }
 return true;
})(arr) // true
```
However, lets take a look at what the ember helper tests, this can give us an idea of the type of objects we need.
```js
assert.equal(true, isEmpty(null), 'for null');
assert.equal(true, isEmpty(undefined), 'for undefined');
assert.equal(true, isEmpty(''), 'for an empty String');
assert.equal(false, isEmpty('  '), 'for a whitespace String');
assert.equal(false, isEmpty('\n\t'), 'for another whitespace String');
assert.equal(false, isEmpty(true), 'for true');
assert.equal(false, isEmpty(false), 'for false');
assert.equal(false, isEmpty(string), 'for a String');
assert.equal(false, isEmpty(fn), 'for a Function');
assert.equal(false, isEmpty(0), 'for 0');
assert.equal(true, isEmpty([]), 'for an empty Array');
assert.equal(false, isEmpty({}), 'for an empty Object');
assert.equal(true, isEmpty(object), "for an Object that has zero 'length'");
```
So lets run down what `arr.length === 0` will return if passed each of these

```js

null // TypeError: Cannot read property 'length' of null - BAD
undefined // TypeError: Cannot read property 'length' of undefined - BAD
'' // true - GOOD
'  ' // false - GOOD
'\n\t' // false - GOOD
true // false - GOOD
false // false - GOOD
'string' // false - GOOD
function() {}; // true (depends on parameters the function accepts) - BAD
0 // false - GOOD
[] // true - GOOD
{} // false - GOOD (sorta)
{ length: 0 } // true - GOOD
```
Some of these return the wrong answer, some of these throw exceptions, the array I was checking against was indeed coming from my code, but not the same file and could potentially be changed by another programmer to behave differently without me knowing. These are just for the examples that are being tested.

## Array like objects
Objects like `arguments` in a function are not arrays, we can turn them into arrays and use any of the above methods using
`[...arguemtns]`. But this will fail if it is not an "Array-like" object.

Getting around this, which also works for `Sets` or `Maps`.

```js
// we need to check if this is a proper iterable
if( typeof arguments[Symbol.iterator] === 'function' ) {
  // then we use of instead of in because the previous one technically will return false
  // if you set the length property
  for (var a in arguments) {
    return false;
  }
  return true;
}
```

### Framework specific arrays
Frameworks like Ember and Angular have their own versions of arrays, sometimes they are extensions and the previous methods will work, other times they are brand new objects, if this is the case there usually is a library method `isEmpty` or something similar, which always works on JS arrays and array like objects.


Beacuse there is a difference and often when using someone elses code we may not know the exact type of an array, a library seeming as trivial as `isEmpty` is actually quite useful in this situation.
