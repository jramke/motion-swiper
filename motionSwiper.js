// TODO: max speed adjustable because when eg. dev tools are open its not that fluid as if they are closed
// TODO: buggy direction and progress on touch
export class MotionSwiper {
  constructor(swiperEl) {
    this.swiper = this.createSwiper(swiperEl);
    this.maskpath = this.createMaskPath();
    this.animations = this.createMaskAnimations();

    this.maxSpeed = 0;
    this.maxUserSpeed = 75
    this.lastMovement = 0;
    this.lastDirection = '';
    this.movement = 0;
    this.speed = 0;
    this.progress = 0;
    this.direction = "";
    this.normalizing = false;

    this.bind();
  }

  bind() {
    this.swiper.el.addEventListener('pointerdown', () => {
      this.normalizing = false;
      this.toggleGrabState(true);
      this.swiper.on("setTranslate", () => this.handleMaskAnimation());
    });

    this.swiper.el.addEventListener('pointerup', () => {
      this.toggleGrabState(false);
      this.swiper.off("setTranslate", () => this.handleMaskAnimation());
      this.normalizeMask();
    });

    this.swiper.el.addEventListener('pointermove', (e) => {
      // for (const event of e.getCoalescedEvents()) {
      //   this.calcValues(event);
      // }
      this.calcValues(e);
    });
  }

  calcValues(e) {
    // this.direction = e.movementX > 0 ? "right" : "left"; // movementX not working in safari
    this.movement = e.screenX - this.lastMovement;
    this.direction = this.movement > 0 ? "right" : "left";

    this.speed = Math.abs(this.movement);
    this.speed > this.maxSpeed ? (this.maxSpeed = Math.min(this.speed, this.maxUserSpeed)) : this.maxSpeed;

    this.progress = Math.min(((100 / this.maxSpeed) * this.speed) / 100, 1);
    // this.progress - this.lastProgress > 0.7 ? this.progress = 0 : this.progress;
    if (this.lastDirection !== this.direction) this.progress = 0;

    this.lastMovement = e.screenX; 
    this.lastDirection = this.direction;
    
    // document.querySelector('#info').innerHTML = this.direction + ' ' + this.progress;
    // this.lastProgress = this.progress;
  }

  createSwiper(el) {
    // ONLY WORKING WITH SWIPER v8 NOT v9
    // loading new elements on loop in freemode is not working correctly or fast enough
    return new Swiper(el, {
      centeredSlides: true,
      slidesPerView: "auto",
      // loop: true,
      grabCursor: true,
      freeMode: {
        enabled: true,
        // minimumVelocity: 0.5,
        momentumBounce: false,
        momentumVelocityRatio: 0.5,
        // momentumRatio: 2,
      }
    });
  }
  createMaskPath() {
    let maskpath = document.querySelector("#motion-swiper__mask path");
    for (const slide of this.swiper.slides) {
      slide.style.cssText += "-webkit-clip-path: url(#motion-swiper__mask);clip-path: url(#motion-swiper__mask);";
    }
    if (maskpath) return maskpath;

    document.body.insertAdjacentHTML(
      "beforeend",
      `
      <svg height="0" width="0" style="position:absolute;">
      <!--   https://yqnn.github.io/svg-path-editor/ -->
        <defs>
          <clipPath id="motion-swiper__mask" clipPathUnits="objectBoundingBox">
            <path 
                d="M 1 0 C 1 0.25 1 0.75 1 1 L 0 1 C 0 0.75 0 0.25 0 0 Z"
                data-path-normal="M 1 0 C 1 0.25 1 0.75 1 1 L 0 1 C 0 0.75 0 0.25 0 0 Z"
                data-path-left="M 1 0 C 0.85 0.25 0.85 0.75 1 1 L 0.15 1 C -0.05 0.75 -0.05 0.25 0.15 0 Z"
                data-path-right="M 0.85 0 C 1.05 0.25 1.05 0.75 0.85 1 L 0 1 C 0.15 0.75 0.15 0.25 0 0 Z"
             />
          </clipPath>
        </defs>
      </svg>
    `
    );
    return document.querySelector("#motion-swiper__mask path");
  }
  handleMaskAnimation() {
    if (this.normalizing) {
      return;
    }
    
    
    
    if (this.progress === 0) {
      gsap.to(this.animations[this.direction], { progress: 0 });
      // normalizeMask();
    } else {
      for (const key of Object.keys(this.animations)) {
        // animations[key].progress(0);
        gsap.to(this.animations[key], { progress: 0 });
      }
      gsap.to(this.animations[this.direction], { progress: this.progress });
      // console.log(animations[direction].progress(), direction)
    }
  }

  normalizeMask() {
    this.normalizing = true;
    this.speed = 0;
    gsap.to(this.maskpath, {
      duration: 1,
      attr: {
        d: this.maskpath.dataset.pathNormal
      },
      onComplete: () => (this.normalizing = false)
    });
  }

  createMaskAnimations() {
    return {
      left: gsap.to(this.maskpath, {
        paused: true,
        attr: { d: this.maskpath.dataset.pathLeft }
      }),
      right: gsap.to(this.maskpath, {
        paused: true,
        attr: { d: this.maskpath.dataset.pathRight }
      })
    };
  }
  toggleGrabState(drag) {
    gsap.to(this.swiper.slides, {
      scale: drag ? 0.95 : 1
    });
  }
}


