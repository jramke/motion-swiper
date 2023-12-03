<script>
    import '$lib/motionSwiper.scss';
    import { gsap } from "gsap";
    import { ScrollTrigger } from 'gsap/dist/ScrollTrigger';
    import MotionSwiper from "$lib/motionSwiper.js";
    import Lenis from '@studio-freight/lenis';
	import { onMount } from 'svelte';

    onMount(() => {
        const motionSwiper = new MotionSwiper('.motion-swiper');

        gsap.registerPlugin(ScrollTrigger);
        const lenis = new Lenis()
        lenis.on('scroll', ScrollTrigger.update)
        gsap.ticker.add((time)=>{
            lenis.raf(time * 1000)
        })
        gsap.ticker.lagSmoothing(0)
    })

</script>

<style lang="scss">
    @import "/node_modules/bootstrap/scss/bootstrap.scss";


    html.lenis {
        height: auto;
    }
    .lenis.lenis-smooth {
        scroll-behavior: auto;
    }

    img {
        width: 100%;
        height: 100%;
        object-fit: cover;
    }

    section {
        height: 100vh;
        display: flex;
        justify-content: center;
        align-items: center;
        flex-direction: column;
    }
</style>

<div id="github" class="position-fixed top-0 end-0 p-4">
    <a href="https://github.com/jramke/motion-swiper" target="_blank">
        <svg xmlns="http://www.w3.org/2000/svg" width="30" height="30" fill="black" class="bi bi-github" viewBox="0 0 16 16">
            <path d="M8 0C3.58 0 0 3.58 0 8c0 3.54 2.29 6.53 5.47 7.59.4.07.55-.17.55-.38 0-.19-.01-.82-.01-1.49-2.01.37-2.53-.49-2.69-.94-.09-.23-.48-.94-.82-1.13-.28-.15-.68-.52-.01-.53.63-.01 1.08.58 1.23.82.72 1.21 1.87.87 2.33.66.07-.52.28-.87.51-1.07-1.78-.2-3.64-.89-3.64-3.95 0-.87.31-1.59.82-2.15-.08-.2-.36-1.02.08-2.12 0 0 .67-.21 2.2.82.64-.18 1.32-.27 2-.27.68 0 1.36.09 2 .27 1.53-1.04 2.2-.82 2.2-.82.44 1.1.16 1.92.08 2.12.51.56.82 1.27.82 2.15 0 3.07-1.87 3.75-3.65 3.95.29.25.54.73.54 1.48 0 1.07-.01 1.93-.01 2.2 0 .21.15.46.55.38A8.012 8.012 0 0 0 16 8c0-4.42-3.58-8-8-8z"/>
        </svg>
    </a>
</div>
<section style="height: 50vh;">
    <!-- <section> -->
      <div class="container text-center">
        <img src="/favicon.png" class="mb-3" alt="Waving hand" style="width: 40px; height: auto;">
        <h1 class="mb-4">MotionSwiper</h1>
        <p>Introducing MotionSwiper – a minimal draggable slider with a seamless and fluid bending motion effect.<br>
            It's built with GSAP and does not rely on WebGL/ThreeJs or Canvas, ensuring there are no drawbacks in terms of accessibility or performance.<br><br>
          Inspired by: <a target="_blank" rel="noopener noreferrer" href="https://codepen.io/ReGGae/live/povjKxV">this pen by Jesper Landberg</a>
          and <a target="_blank" rel="noopener noreferrer" href="https://codepen.io/supah/pen/VwegJwV?editors=0010">this pen by Fabio Ottaviani</a>
        </p>
        <p>
            <a href="https://github.com/jramke/motion-swiper" class="btn btn-outline-dark mt-3" target="_blank">Getting started</a>
        </p>
      </div>
    </section>
<section>
    <div class="motion-swiper">
        <div class="motion-swiper__wrapper">
            <div class="motion-swiper__slide">
                <div class="motion-swiper__inner">
                    <img src="/images/neom-I7NOiVT6jq0-unsplash.jpg" alt="">
                </div>
            </div>
            <div class="motion-swiper__slide">
                <div class="motion-swiper__inner">
                    <img src="/images/david-becker-cl8lM1W2nHM-unsplash.jpg" alt="">
                </div>
            </div>
            <div class="motion-swiper__slide">
                <div class="motion-swiper__inner">
                    <img src="/images/josh-withers-EG8_QJ0OgOU-unsplash.jpg" alt="">
                </div>
            </div>
            <div class="motion-swiper__slide">
                <div class="motion-swiper__inner">
                    <img src="/images/josh-withers-TCBvy1-xHU8-unsplash.jpg" alt="">
                </div>
            </div>
            <div class="motion-swiper__slide">
                <div class="motion-swiper__inner">
                    <img src="/images/igor-lypnytskyi-GzX8mr1y7H0-unsplash.jpg" alt="">
                </div>
            </div>
            <div class="motion-swiper__slide">
                <div class="motion-swiper__inner">
                    <img src="/images/neom-i60yUhfWeYI-unsplash.jpg" alt="">
                </div>
            </div>
        </div>
    </div>
</section>