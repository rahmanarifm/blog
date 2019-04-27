---
layout: post
title: "Lightbox from scratch"
date: 2017-02-1T20:52:03-05:00
tags: [javascript, web, hello, from, github]

---


You don't need jquery or lightbox to create nice images you can click and see larger versions with nice backgrounds.


First we need to add an event lister for every image. We can do this a number of ways but adding it to every image with a specific class is a good way to not think about it after implementing.
```js
Array.prototype.forEach.call(document.getElementsByClassName('js-lightbox'),
  elm => elm.addEventListener('click', lightboxImage))
```
Then we have to make the mask. I am using the css library tachyons to do this, the main idea is to create a class that would make this element cover the whole screen.
``` js
function lightboxImage(evt) {
  evt.preventDefault()

  // create black background
  const mask = document.createElement('div')
  mask.id = 'mask-cover'

  // make it fade in
  mask.style.transition = 'opacity 0.15s ease-in'
  mask.classList.add(
    'fixed',
    'top-0',
    'left-0',
    'w-100',
    'h-100',
    'bg-black-90',
    'flex',
    'items-center',
    'justify-center',
    'o-0',
    'pointer'
  )
```

Then add the image in and add or remove all the classes that we need.

``` js  
  //create larger imageview
  const imageView = document.createElement('img')
  imageView.src = evt.target.src
  imageView.classList.add('w-80')

  //@TODO find a better way than having this in a setTimeout
  setTimeout(() => { mask.classList.remove('o-0')}, 0)

  // put image overtop of black background
  mask.appendChild(imageView)

  // draw to page
  document.body.appendChild(mask)
  document.body.classList.add('overflow-hidden')

  // close when clicked
  mask.addEventListener('click', evt => {
    evt.preventDefault()

    // remove mask
    mask.parentNode.removeChild(mask)
    document.body.classList.remove('overflow-hidden')
  })
}
```
