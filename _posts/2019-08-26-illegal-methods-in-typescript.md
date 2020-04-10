---
layout: post
title: "Illegal Methods in Typescript"
tags: [javascript, typescript]
permalink: "/posts/illegal-methods-in-typescript/"
---

In javascript, we can create functions on the prototype of existing classes.
```js
Number.prototype.factorial = function() {
  return new Array(this.valueOf())
    .fill()
    .reduce((acc, _, index) => acc * (index + 1), 1);
};

(5).factorial(); // <- 120

```

However, in typescript, this is not allowed
```
error TS2339: Property 'factorial' does not exist on type 'Number'.

► file:///C:/Users/lucas/misc/deno_test/main.ts:1:18

1 Number.prototype.factorial = function() {
                   ~~~~~~~~~
```


We can add `// @ts-ignore` before every line and this will work, but what if we didn't want to do that.

Another way is to use `eval`
```ts
eval(
  `Number.prototype.factorial = function() {
  	return new Array(+this).fill().reduce((a, _, i) => a * (i + 1), 1);
   };`
)
```


This is still allowed in typescript, often codebases lint against `eval`, as they should.
And we will need to use `eval("5..factorial()")` every time we want to access this.

Since we can import typescript modules in javascript and the other way around, we can create a module that creats our "illegal" method in javascript...
```js
// util.js
export function createIllegalMethod() {
  Number.prototype.factorial = function() {
    return new Array(this.valueOf())
      .fill()
      .reduce((acc, _, index) => acc * (index + 1), 1);
  };
}

```
...and import it in our typescript modules.
```ts
// main.ts
import { createIllegalMethod } from './util.js';

createIllegalMethod();

let foo: number | any = 5;

console.log(foo.factorial());
```
We still have to use `number | any` in order for this to compile/run.

Verifying what works in typescript with [Deno](https://deno.land/) has made testing this very easy, since it supports typescript out of the box.
