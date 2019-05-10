---
layout: post
title: "Rustfmt in Atom"
date: 2019-05-10T00:52:03-05:00
tags: [rust, atom]
permalink: "/posts/rustfmt-in-atom/"
---

[Areweideyet.com](areweideyet.com) is a helpful page listing IDEs and text editors with support for the language Rust. However, the one listed for Atom, the text editor I use the most, does not work.
It uses an outdated API of rustfmt, there is an [open PR](https://github.com/xgdapg/atom-rustfmt/pull/6) but is untouched for 3 years. It also is not as performant as it can be. The current behavior saves the file, then passes the path to rustfmt's command, and then overwrites the file. Rather than just passing in the buffer text as stdin and saving that way.

### Atom's init file
This post is going to show how to create a small script in Atom's init file to format rust code, the only requirement is having rustfmt installed globally.

On Atom's [documentation](https://atom.io/docs/api/v1.36.1/TextBuffer) there are a number of hooks we can use to run code specifically when we want to. For formatting we will use `onWillSave`. This allows us to write our code without being interupted by the formatter, but then when saving it will format our code the way we want it to.

```js
// The global atom object allows us to access the current workspace
atom.workspace.observeActiveTextEditor(editor => {
  // Check if buffer exists (workspace is a text editor and not settings or
  // other type of workspace)
  if( editor && editor.buffer ){
    editor.buffer.onWillSave(() => {
      // Code will run _right_ before the current file is saved
    });
  }
});
```

Then we can work on our code for formatting. Since there is no node package to format rust code, we will call out to the `rustfmt` command using `child_process.exec` from node.

### child_process.exec vs Atom#BufferedProcess
Atom has a Class, BufferedProcess, that is for packages and scripts that need to run a command outside of Atom. However it [does not support stdin](https://github.com/atom/atom/blob/v1.36.1/src/buffered-process.js#L21). In the documentation it shows an options object being pased in, `this.spawn(this.command, this.args, this.options)`. This spawn is node's `child_process.spawn` function.
```js
// In buffered-process.js
module.exports =
class BufferedProcess {

// ...

spawn (command, args, options) {
  try {
    this.process = ChildProcess.spawn(command, args, options)
  } catch (spawnError) {
    process.nextTick(() => this.handleError(spawnError))
  }
}
```
### Passing text to Rustfmt
Digging into the api for exec, the method can take either a string or node Buffer object, since the buffer in atom is stored in C++ code. We cannot get access to the raw buffer without digging deeper. So using [getText](https://atom.io/docs/api/v1.36.1/TextBuffer#instance-getText) is going to be the next best thing. (the documentation says to avoid using if buffer is large, talking with Atom contributors anything below 50MB should be no problem).


Rustfmt also outputs the formatted code via stdout, this allows us to grab the code we need from stdout and replace our current buffer with it.

```js
const { exec } = require('child_process');

const proc = exec('rustfmt', (err, stdout, stderr) => {
  editor.buffer.setTextViaDiff(stdout)
})
proc.stdin.write(editor.buffer.getText());
proc.stdin.end();
```
This gets the current text from the buffer that we need, passes it as stdin to rustfmt and sets the output as our current buffer.

### Saving and errors
Our function that is passed into `editor.buffer.onWillSave()` needs to return true when we are ready to save, or a promise that resolves when we are ready to save. Since `exec` is a async operation we will create a promise that resolves when our process is complete.
```js
  const promise = new Promise((resolve, reject) => {
    const proc = exec('rustfmt', (err, stdout, stderr) => {
      editor.buffer.setTextViaDiff(stdout);
      resolve();
    });
    proc.stdin.write(editor.buffer.getText());
    proc.stdin.end();
  });
  return promise;
```
Rustfmt can fail when the code is not valid rust code. When this happens we want to be informed what happened, we can use atom's notifications to show what error may have occured.

#### Final init.js file
```js
const { exec } = require('child_process');


atom.workspace.observeActiveTextEditor(editor => {
  if( editor && editor.buffer ){
  editor.buffer.onWillSave(() => {
    const scopeName = editor.getGrammar().scopeName;

    if (scopeName === 'source.rust') {
      return formatRustCode(editor);
    }

    return true;
  })}
})

function formatRustCode(editor) {
  const promise = new Promise((resolve, reject) => {
    const proc = exec('rustfmt', (err, stdout, stderr) => {
      if (err || stderr) {
        atom.notifications.addError('Rustfmt failed to format code', {
          detail: stderr,
          dismissable: true
        });


      } else {
        editor.buffer.setTextViaDiff(stdout);

      }
      resolve();

    });
    proc.stdin.write(editor.buffer.getText());
    proc.stdin.end();

  });
  return promise;

}
```
