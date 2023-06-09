export class MotionSwiper {
	constructor(el, options = {}) {
		if (typeof(gsap) === "undefined") {
			console.warn("GSAP is needed for the Motion Swiper.");
			return
		}
		this.swiper = typeof (el) === 'string' ? document.querySelector(el) : el;
		this.wrapper = this.swiper.querySelector('.motion-swiper__wrapper');
		this.items = this.swiper.querySelectorAll('.motion-swiper__slide');
        this.inners = this.swiper.querySelectorAll('.motion-swiper__inner');
		this.swiperWidth = this.swiper.clientWidth;
		this.itemWidth = this.items[0].clientWidth;
		this.wrapWidth = this.items.length * this.itemWidth;

        this.options = Object.assign({}, {
            loop: true,
            lerp: 0.1,
            speed: 2.5,
			centered: true,
			teasing: true,
			normalizingSpeed: 0.8,
			swipeOnClick: true,
        }, options);

		this.scrollSpeed = 0;
		this.oldScrollY = 0;
		this.scrollY = 0;
		this.lastTeasedScrollY = 0;
		this.teasedScrollY = 0;
		this.y = 0;
		this.touchStart = 0;
		this.touchX = 0;
		this.progress = 0;
		this.swipedToScrollY = 0;
		this.isDragging = false;
		this.normalizing = false;
		this.paused = false;
		this.lastDirection = '';
		this.direction = '';
        
		this.maskPath = this.createMaskPath();
		this.animations = this.createMaskAnimations();
		this.bind();
		this.dispose(0);
		this.render();
		if (this.options.teasing) this.teasing();
	}
	handleTouchStart(e) {
		this.touchStart = e.clientX;
		this.isDragging = true;
		this.swiper.classList.add('is-dragging');
		this.normalizing = false;
	}
	handleTouchMove(e) {
		if (this.isDragging === false) return;
		this.touchX = e.clientX;
		this.scrollY += (this.touchX - this.touchStart) * this.options.speed;
		if (!this.options.loop) {
			let end = this.options.centered ? this.wrapWidth - this.swiperWidth + this.swiperWidth - this.itemWidth : this.wrapWidth - this.swiperWidth;
			if (Math.abs(this.scrollY) >= end) {
				this.handleSwipedToEnd(-1 * (end));
				return;
			}
			if (this.scrollY >= 0) {
				this.handleSwipedToEnd(0);
				return;
			}
		}
		this.touchStart = this.touchX;
	}
	handleTouchEnd() {
		this.isDragging = false;
		// this.normalizeMask();
		this.swiper.classList.remove('is-dragging');
	}
	handleSwipedToEnd(pos) {
		console.log(pos, 'end');
		this.normalizeMask();
		this.scrollY = pos;
		this.touchStart = this.touchX;
	}
	bind() {

		this.swiper.addEventListener('pointerdown', (e) => this.handleTouchStart(e));
		this.swiper.addEventListener('pointermove', (e) => this.handleTouchMove(e));
		this.swiper.addEventListener('pointerup', (e) => this.handleTouchEnd(e));

		this.swiper.addEventListener('selectstart', (e) => {
            e.preventDefault();
			return false;
		});

		if (this.options.swipeOnClick) {
			this.items.forEach((e, i) => e.addEventListener('click', () => {
				this.swipeTo(i);
			}))
		}

		window.addEventListener('resize', () => {
			this.swiperWidth = this.swiper.clientWidth;
			this.itemWidth = this.items[0].clientWidth;
			this.wrapWidth = this.items.length * this.itemWidth;
		});
	}
	render() {
		if (this.paused) return; 
		requestAnimationFrame(() => this.render());

		this.y = lerp(this.y, this.scrollY, this.options.lerp);
		this.dispose(this.y);

		this.scrollSpeed = clamp(this.y - this.oldScrollY, -100, 100);
        this.scrollSpeed = Math.round((this.scrollSpeed + Number.EPSILON) * 100) / 100;
		// this.direction = this.scrollY - this.oldScrollY > 0 ? 'right' : 'left';
        
        this.direction = this.scrollSpeed > 0 ? 'right' : 'left';
        if (this.scrollSpeed == 0 && this.lastDirection.length > 0) this.direction = this.lastDirection;
        
        this.progress = Math.abs(this.scrollSpeed) / 100;
        this.progress = Math.round((this.progress + Number.EPSILON) * 100) / 100;
        
		if (this.normalizing) {
            this.progress = lerp(this.progress, 0, this.options.lerp);
            this.scrollSpeed = lerp(this.scrollSpeed, 0, this.options.lerp);
		}
        // if (this.direction !== this.lastDirection && this.direction.length > 0 && this.lastDirection.length > 0) {
        //     gsap.set(this.animations[this.lastDirection], { progress: 0 });
        // }

		console.log(this.scrollY);

		gsap.to(this.animations[this.direction], { 
			progress: this.progress 
		});
		if (!this.isDragging) {
			this.normalizeMask();
		}
		gsap.to(this.items, {
			scale: 1 - Math.min(100, Math.abs(this.scrollSpeed)) * (this.options.lerp * 0.02),
		});

		this.oldScrollY = this.y;
		this.lastDirection = this.direction;
	}
	createMaskPath() {
		let maskpath = document.querySelector('#motion-swiper__mask path');
		for (const slide of this.inners) {
			slide.style.cssText +=
				'-webkit-clip-path: url(#motion-swiper__mask);clip-path: url(#motion-swiper__mask);';
		}
		if (maskpath) return maskpath;

		document.body.insertAdjacentHTML(
			'beforeend',
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
		return document.querySelector('#motion-swiper__mask path');
	}
	normalizeMask() {
		if (this.normalizing) return;
		this.normalizing = true;
        gsap.to(this.animations[this.direction], { progress: 0 });
		gsap.to(this.maskPath, {
            duration: this.options.normalizingSpeed,
			attr: {
				d: this.maskPath.dataset.pathNormal,
			},
			onComplete: () => {
				this.normalizing = false;
			},
		});
	}
	createMaskAnimations() {
		return {
			left: gsap.to(this.maskPath, {
				paused: true,
				attr: { d: this.maskPath.dataset.pathLeft },
			}),
			right: gsap.to(this.maskPath, {
				paused: true,
				attr: { d: this.maskPath.dataset.pathRight },
			}),
		};
	}
    dispose(scroll) {
		gsap.set(this.items, {
			x: (i) => {
				if (this.options.centered) {
					return (i * this.itemWidth + scroll) + (this.swiperWidth / 2) - (this.itemWidth / 2);
				} else {
					return i * this.itemWidth + scroll;
				}
			},
			modifiers: {
				x: (x, target) => {
					const s = gsap.utils.wrap(-this.itemWidth, this.wrapWidth - this.itemWidth, parseInt(x));
					return this.options.loop ? `${s}px` : x;
				},
			},
		});
	}
	swipeTo(index) {
		if (this.isDragging) return;
		let end = this.options.centered ? this.wrapWidth - this.swiperWidth + this.swiperWidth - this.itemWidth : this.wrapWidth - this.swiperWidth;
		let targetX = this.options.centered ? this.swiperWidth / 2 - this.itemWidth / 2 : 0;
		let targetXbefore = gsap.getProperty(this.items[index], 'x');
		console.log(targetXbefore);
		this.swipedToScrollY = targetXbefore - targetX;
		if (!this.options.loop && Math.abs(this.scrollY - this.swipedToScrollY) >= end) {
			this.scrollY = -end;
			return
		}
		this.scrollY -= this.swipedToScrollY;
	}
	teasing() {
		if (typeof(ScrollTrigger) === "undefined") {
			console.warn("GSAP ScrollTrigger Plugin is needed for the Motion Swiper teasing option.");
			return
		}
		gsap.registerPlugin(ScrollTrigger);
		const tween = gsap.to({teasedScrollY: this.teasedScrollY}, {
			teasedScrollY: this.itemWidth,
			ease: "none",
			scrollTrigger: {
				trigger: this.swiper,
				scrub: () => typeof(Lenis) === "undefined" ? 1 : true,
			},
			onUpdate: () => {
				this.teasedScrollY = tween.targets()[0].teasedScrollY;
				this.scrollY -= this.teasedScrollY - this.lastTeasedScrollY;
				this.lastTeasedScrollY = this.teasedScrollY;
			}
		});
	}
	start() {
		this.paused = false;
		this.render();
	}
	stop() {
		this.paused = true;
		// this.scrollSpeed = 0;
	}
}
function lerp(v0, v1, t) {
	return v0 * (1 - t) + v1 * t;
}
function clamp(val, min, max) {
	return Math.min(Math.max(val, min), max);
}