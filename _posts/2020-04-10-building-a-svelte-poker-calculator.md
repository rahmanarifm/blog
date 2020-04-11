---
layout: post
title: "Learning Svelte by building a hold'em calculator"
tags: [javascript, svelte]
permalink: "/posts/svelte-poker-app/"
---

Svelte is very easy to get started, the starter command create a minimal project
```bash
npx degit sveltejs/template all-in-pre-flop-svelte

cd all-in-pre-flop-svelte

npm install
```

This creates a project with the follwing npm scripts
```js
"build": "rollup -c",
// builds the app for production (exports files into public folder)

"dev": "rollup -c -w",
// starts a server serving on localhost:5000, rebuilds the app every file change

"start": "sirv public"
// starts a server pointing to the public folder
```

There are no "controllers" in svelte, just components, these have extension `.svelte`, use the [Atom svelte addon](https://github.com/UnwrittenFun/svelte-atom) to have proper syntax highlighting.
