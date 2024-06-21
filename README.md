# <img src="static/favicon.png" height="20" /> MotionSwiper

<video controls playsinline autoplay muted loop>
  <source src="motion-swiper-demo.mp4" type="video/mp4">
</video>

Introducing MotionSwiper – a minimal draggable slider with a seamless and fluid bending motion effect like seen in [this pen by Jesper Landberg](https://codepen.io/ReGGae/live/povjKxV).

It's built with GSAP and does not rely on WebGL/ThreeJs or Canvas, ensuring there are no drawbacks in terms of **accessibility** or **performance**.

## Demo
View a live demo here: https://motion-swiper.vercel.app/

MotionSwiper in the wilds:
- https://www.joostramke.com/
- https://www.brandium.nl/agency/


## Getting started

MotionSwiper is created with [GSAP](https://gsap.com/) so its installed with MotionSwiper if needed.

```bash
npm i motion-swiper
```

### Import
```js
// MotionSwiper functionality
import MotionSwiper from "motion-swiper";

// MotionSwiper styles
import "motion-swiper/css"; // or "motion-swiper/scss"
```

### Initialize
Initialze the MotionSwiper class with a selector or an element as first parameter and a optional option object as second parameter. 

The values in this example are the default values.
```js
const motionSwiper = new MotionSwiper('.motion-swiper', {
    loop: true, // loop throug slides
    lerp: 0.1, // amout of lerp
    speed: 2.5, // speed of the swiper when sliding
    centered: true, // first slide is centered
    teasing: true, // move on scroll (needs "gsap/ScrollTrigger") 
    normalizingSpeed: 0.8, // how fast the slides go back to normal
    swipeOnClick: true, // swipe to slide when clicking it
});
```

### Markup
```html
<div class="motion-swiper">
    <div class="motion-swiper__wrapper">

        <div class="motion-swiper__slide">
            <div class="motion-swiper__inner">
                <!-- Content like an image -->
            </div>
        </div>
        ...

    </div>
</div>
```

### Styling
The `.motion-swiper` class comes with some css custom properties you can override to customize MotionSwiper.

```css
.motion-swiper {
    --swiper-slide-spacing: 1.5vw;
    --swiper-height: 35vh;
    --swiper-slide-width: 40vw;
}
```
