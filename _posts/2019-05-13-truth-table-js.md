---
layout: post
title: "Conditional Map in JS"
date: 2019-05-10T00:52:03-05:00
tags: [javascript]
permalink: "/posts/conditional-map-js/"
---

Saw this in a PR at work:
```js
let result = '';

if (!bar && foo) {
  result = 'bingo bango bongo';
} else if (bar && foo) {
  result = 'bish bash bosh';
} else if (bar) {
  result = 'ez peazy lemon squeezy';
}

return result
```
<br>
<br>
Or something similar, made me think of how you could write this cleaner.
```js
if (fooCondition) {
  return barCondition ? 'bingo bango bongo' : 'bish bash bosh';
} else {
  return barCondition ? 'ez peazy lemon squeezy' : '';
}
```
<br>
<br>
Seeing as we are not doing anything else aside from returning, we can use all turneries.
```js
return fooCondition
  ? barCondition
    ? 'bingo bango bongo'
    : 'bish bash bosh'
  : barCondition
  ? 'ez peazy lemon squeezy'
  : '';
```
<br>
<br>
Often we can place these into an object if we want to get results based on a few parameters.

```js
return ({
  true: {
    true: 'bingo bango bongo',
    false: 'bish bash bosh',
  },
  false: {
    true: 'ez peazy lemon squeezy',
    false: '',
  },
})[fooCondition][barCondition];
```
<br>
<br>
We can code golf this up a bit.
```js
return ({
  1: {
    1: 'bingo bango bongo',
    0: 'bish bash bosh',
  },
  0: {
    1: 'ez peazy lemon squeezy',
    0: '',
  },
})[+fooCondition][+barCondition];
```
<br>
<br>
An object with numbers for keys is just an array.
```js
return [['bingo bango bongo', 'bish bash bosh'], ['ez peazy lemon squeezy', '']][+fooCondition][
  +barCondition
];
```
<br>
<br>
Much better.
