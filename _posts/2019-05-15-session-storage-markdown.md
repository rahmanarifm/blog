---
layout: post
title: "Who uses session storage?"
date: 2019-05-15
tags: [javascript]
permalink: "/posts/session-storage/"
---
[Session storage](https://developer.mozilla.org/en-US/docs/Web/API/Window/sessionStorage) is available on the global window object, it’s API is very similar to `localStorage` but I cannot think of one case when I used it. Mdn states that `sessionStorage` is cleared when the page session ends.
> A page session lasts for as long as the browser is open and survives over page reloads and restores.

Below let’s have two outputs, one that is pulling from `localStorage`, another pulling from `sessionStorage`.
### Session storage example
How does a static site such as this one handle a session? The below output will reset when the browser or tab is closed.

**Output:** <code class="highlighter-rouge"><output id="session-storage-result"></output></code>

<button class="pointer dib mr3 pa2 bg-white shadow-4 dim ba b--black-30 br2" id="session-storage-button">Increment</button> <button class="pointer dib mr3 pa2 bg-white shadow-4 dim ba b--black-30 br2" id="session-clear-button">Clear</button>

### Local storage example
This output has no expiration and will only be cleared when `localStorage` is cleared.

**Output:** <code class="highlighter-rouge"><output id="local-storage-result"></output></code>

<button class="pointer dib mr3 pa2 bg-white shadow-4 dim ba b--black-30 br2" id="local-storage-button">Increment</button> <button class="pointer dib mr3 pa2 bg-white shadow-4 dim ba b--black-30 br2" id="local-clear-button">Clear</button>

### Memory example
This below will only keep input for the existence of this page, if refreshed, the output will reset.

**Output:** <code class="highlighter-rouge"><output id="memory-storage-result"></output></code>

<button class="pointer dib mr3 pa2 bg-white shadow-4 dim ba b--black-30 br2" id="memory-storage-button">Increment</button> <button class="pointer dib mr3 pa2 bg-white shadow-4 dim ba b--black-30 br2" id="memory-clear-button">Clear</button>

There are other storage types we could use (cookies, indexdb, external database). Session storage seems like a way to create a “Single page app” like experience where we can keep data persistent navigating through pages of the same domain, but not as well as `localStorage`.
### Code used
```js
function getOutput(storageObject) {
  return parseInt(storageObject.getItem('output-result'), 10) || 0;
}

function createExample(storageObject, namespace) {
  const outputElm = document.getElementById(`${namespace}-storage-result`);
  const incBtn = document.getElementById(`${namespace}-storage-button`);
  const clearBtn = document.getElementById(`${namespace}-clear-button`);

  clearBtn.addEventListener('click', evt => {
    storageObject.clear();
    outputElm.innerHTML = getOutput(storageObject);
  });
  incBtn.addEventListener('click', evt => {
    let output = getOutput(storageObject);
    output++;

    storageObject.setItem('output-result', output);
    outputElm.innerHTML = output;
  });

  outputElm.innerHTML = getOutput(storageObject);
}

createExample(sessionStorage, 'session');
createExample(localStorage, 'local');
createExample(
  {
    output: 0,
    getItem() {
      return this.output;
    },
    setItem(_, op) {
      this.output = op;
    },
    clear() {
      this.output = 0;
    },
  },
  'memory'
);
```

<script type="text/javascript">
function getOutput(storageObject) {
  return parseInt(storageObject.getItem('output-result'), 10) || 0;
}

function createExample(storageObject, namespace) {
  const outputElm = document.getElementById(`${namespace}-storage-result`);
  const incBtn = document.getElementById(`${namespace}-storage-button`);
  const clearBtn = document.getElementById(`${namespace}-clear-button`);

  clearBtn.addEventListener('click', evt => {
    storageObject.clear();
    outputElm.innerHTML = getOutput(storageObject);
  });
  incBtn.addEventListener('click', evt => {
    let output = getOutput(storageObject);
    output++;

    storageObject.setItem('output-result', output);
    outputElm.innerHTML = output;
  });

  outputElm.innerHTML = getOutput(storageObject);
}

createExample(sessionStorage, 'session');
createExample(localStorage, 'local');
createExample(
  {
    output: 0,
    getItem() {
      return this.output;
    },
    setItem(_, op) {
      this.output = op;
    },
    clear() {
      this.output = 0;
    },
  },
  'memory'
);
</script>
