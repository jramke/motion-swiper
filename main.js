import './style.scss';
import { MotionSwiper } from './motionSwiper.js';

const motionSwiper = new MotionSwiper('.motion-swiper', {
	// loop: true,
	// lerp: 0.1,
	// speed: 2.5,
	// centered: true,
	// teasing: true,
	// normalizingSpeed: 0.8,
	// swipeOnClick: true,
});

// gsap.registerPlugin(ScrollTrigger);
// const tl = gsap.timeline();
// const trigger = ScrollTrigger.create({
//   trigger: ".swiper",
//   scrub: true, // smoothness by lenis so no number needed
//   animation: tl
// });
// tl.to(".swiper", {
//   x: -1 * document.querySelector(".swiper .swiper-slide").offsetWidth,
//   ease: "none"
// });

(function () {
	const lenis = new Lenis();

	function raf(time) {
		lenis.raf(time);
		requestAnimationFrame(raf);
	}

	requestAnimationFrame(raf);
})();
