import './style.scss';
import { MotionSwiper } from './motionSwiper.js';

const motionSwiper = new MotionSwiper('.swiper');

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
