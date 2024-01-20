import gsap from "gsap";
import { ScrollTrigger } from "gsap/dist/ScrollTrigger";
import { lerp, clamp } from "./utils.js";

export default class MotionSwiper {
	constructor(el, options = {}) {
		if (typeof(gsap) === "undefined") {
			console.warn("GSAP is needed for Motion Swiper to work.");
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
		this.pressed = false;
		this.isDragging = false;
		this.normalizing = false;
		this.paused = false;
		this.lastDirection = '';
		this.direction = '';
		this.event = {};
        
		if (this.swiper.hasAttribute('motion-swiper-init')) return;
		this.maskPath = this.createMaskPath();
		this.animations = this.createMaskAnimations();
		this.bind();
		this.dispose(0);
		this.render();
		if (this.options.teasing) {
			this.scrollTrigger = null;
			this.teasing();
		}
		this.swiper.setAttribute('motion-swiper-init', '');
	}
	handleTouchStart(e) {
		this.touchStart = e.clientX;
		this.pressed = true;
		this.normalizing = false;
	}
	handleTouchMove(e) {
		if (this.pressed === false) return;
		this.isDragging = true;
		this.swiper.classList.add('is-dragging');
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
		this.pressed = false;
		this.swiper.classList.remove('is-dragging');
	}
	handleSwipedToEnd(pos) {
		console.log(pos, 'end');
		this.normalizeMask();
		this.scrollY = pos;
		this.touchStart = this.touchX;
	}
	preventScroll(e){
		e.preventDefault();
		e.stopPropagation();
		return false;
	}
	bind() {
		this.event.pointerdown = (e) => this.handleTouchStart(e);
		this.event.pointermove = (e) => this.handleTouchMove(e);
		this.event.pointerup = (e) => this.handleTouchEnd(e);
		this.event.selectstart = (e) => {
			console.log('select');
			e.preventDefault();
			return false;
		}
		this.event.click = (i) => {
			this.swipeTo(i);
		};
		this.event.resize = () => {
			this.swiperWidth = this.swiper.clientWidth;
			this.itemWidth = this.items[0].clientWidth;
			this.wrapWidth = this.items.length * this.itemWidth;
		}

		this.swiper.addEventListener('pointerdown', this.event.pointerdown);
		this.swiper.addEventListener('pointermove', this.event.pointermove);
		this.swiper.addEventListener('pointerup', this.event.pointerup);
		this.swiper.addEventListener('selectstart', this.event.selectstart);
		this.items.forEach(e => e.addEventListener('selectstart', this.event.selectstart));

		if (this.options.swipeOnClick) {
			this.items.forEach((e, i) => {
				e.addEventListener('click', () => this.event.click(i));
			})
		}

		window.addEventListener('resize', this.event.resize);
	}
	render() {
		if (this.paused) return; 
		requestAnimationFrame(() => this.render());

		this.y = lerp(this.y, this.scrollY, this.options.lerp);
		this.dispose(this.y);

		this.scrollSpeed = clamp(this.y - this.oldScrollY, -100, 100);
        this.scrollSpeed = Math.round((this.scrollSpeed + Number.EPSILON) * 100) / 100;
        
        this.direction = this.scrollSpeed > 0 ? 'right' : 'left';
        if (this.scrollSpeed == 0 && this.lastDirection.length > 0) this.direction = this.lastDirection;
        
        this.progress = Math.abs(this.scrollSpeed) / 100;
        this.progress = Math.round((this.progress + Number.EPSILON) * 100) / 100;
        
		if (this.normalizing) {
            this.progress = lerp(this.progress, 0, this.options.lerp);
            this.scrollSpeed = lerp(this.scrollSpeed, 0, this.options.lerp);
		}

		if (this.pressed) {
			window.addEventListener('wheel', this.preventScroll, { passive: false });
		} else {
			window.removeEventListener('wheel', this.preventScroll);
		}

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
		let tween = null;
		tween = gsap.to({teasedScrollY: this.teasedScrollY}, {
			teasedScrollY: this.itemWidth,
			ease: "none",
			onUpdate: () => {
				if (tween === null) return;
				this.teasedScrollY = tween.targets()[0].teasedScrollY;
				this.scrollY -= this.teasedScrollY - this.lastTeasedScrollY;
				this.lastTeasedScrollY = this.teasedScrollY;
			}
		});
		this.scrollTrigger = ScrollTrigger.create({
			animation: tween,
			trigger: this.swiper,
			scrub: () => typeof(Lenis) === "undefined" ? 1 : true,
		})
	}
	start() {
		this.paused = false;
		this.render();
	}
	stop() {
		this.paused = true;
	}
	kill() {
		this.paused = true;
		this.swiper.removeEventListener('pointerdown', this.event.pointerdown);
		this.swiper.removeEventListener('pointermove', this.event.pointermove);
		this.swiper.removeEventListener('pointerup', this.event.pointerup);
		this.swiper.removeEventListener('selectstart', this.event.selectstart);
		this.items.forEach((e, i) => e.removeEventListener('click', this.event.click))
		window.removeEventListener('resize', this.event.resize);
		this.scrollTrigger?.kill();
		this.swiper.remove();
		this.maskPath.closest('svg').remove();
	}
}
