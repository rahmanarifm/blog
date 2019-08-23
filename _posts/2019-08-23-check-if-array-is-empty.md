---
layout: post
title: "How to check if array is empty?"
date: 2019-08-23
tags: [javascript]
permalink: "/posts/array-isempty/"
---

There is a alarming number of ways to check if an array is empty.

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
