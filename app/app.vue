<script setup lang="ts">

useHead({
    title: 'Millionaire Quiz - Become a Millionaire',
    meta: [
        { name: 'description', content: 'Play Millionaire Quiz and answer 15 questions to become a millionaire. Enjoy lifelines, prize ladder, and hundreds of fun questions.' },
        { name: 'keywords', content: 'Millionaire Quiz, Who Wants to Be a Millionaire, trivia, quiz game, knowledge challenge' },
        { property: 'og:title', content: 'Millionaire Quiz - Become a Millionaire' },
        { property: 'og:description', content: 'Challenge your knowledge with 15 questions and climb the prize ladder to win big.' },
        { property: 'og:type', content: 'website' },
        { property: 'og:url', content: 'https://yourdomain.com' },
        { property: 'og:image', content: 'https://yourdomain.com/og-image.jpg' },
        { name: 'twitter:card', content: 'summary_large_image' },
        { name: 'twitter:title', content: 'Millionaire Quiz - Become a Millionaire' },
        { name: 'twitter:description', content: 'Play Millionaire Quiz, answer 15 questions, and win the grand prize.' },
        { name: 'twitter:image', content: 'https://yourdomain.com/twitter-image.jpg' }
    ],
    htmlAttrs: {
        lang: 'en'
    },
    bodyAttrs: {
        class: 'text-white font-sans antialiased overflow-hidden'
    }
})
</script>

<template>
    <NuxtLayout>
        <NuxtPage />
    </NuxtLayout>
</template>

<style>
@import 'tailwindcss';
@import '@nuxt/ui';

@theme {
    --font-sans: 'IBM Plex Sans', sans-serif;
    --bg-1: #0b032d;
    --bg-2: #200053;
    --acc-2: #a78bfa;
    --acc-3: #f0abfc;
    --grid: #6528cf22;
    --shine: #9f67ff66;
}

/* ========= Tailwind extension layer ========= */
@layer utilities {
    /* Spinning, glow, sweep animations */
    @keyframes spin-slow {
        to {
            transform: rotate(360deg)
        }
    }
    @keyframes glow {
        0%,100% {
            text-shadow: 0 0 24px #b388ff44, 0 0 48px #f0abfc22
        }
        50%     {
            text-shadow: 0 0 36px #d1b3ff66, 0 0 72px #ffc8ff44
        }
    }
    @keyframes beams-rotate {
        to {
            transform: rotate(360deg)
        }
    }
    @keyframes ring-pulse {
        0%,100% {
            transform: scale(0.995)
        }
        50%     {
            transform: scale(1.01)
        }
    }
    @keyframes sweep-move {
        0%   { transform: translate(-6%, -4%) rotate(-8deg) }
        50%  { transform: translate(6%, 4%) rotate(8deg) }
        100% { transform: translate(-6%, -4%) rotate(-8deg) }
    }

    .animate-glow { animation: glow 3.2s ease-in-out infinite }

    /* Stars: 3 layered pseudo backgrounds via multiple gradients */
    .stars,
    .stars::before,
    .stars::after {
        content: "";
        position: absolute;
        inset: -50% -50%;
        background:
            radial-gradient(2px 2px at 20% 30%, #ffffffcc 40%, transparent 41%) 0 0/180px 180px,
            radial-gradient(1px 1px at 70% 60%, #ffffff99 40%, transparent 41%) 0 0/120px 120px,
            radial-gradient(1px 1px at 40% 80%, #ffffff66 40%, transparent 41%) 0 0/90px 90px;
        animation: spin-slow 140s linear infinite;
        opacity: .35;
        pointer-events: none;
    }
    .stars::before {
        filter: blur(0.5px);
        opacity: .25;
        animation-duration: 200s;
    }
    .stars::after {
        filter: blur(1px);
        opacity: .2;
        animation-duration: 260s;
    }

    /* Grid with radial mask */
    .grid-mask {
        background:
            linear-gradient(to right, var(--grid) 1px, transparent 1px) 0 0/60px 60px,
            linear-gradient(to bottom, var(--grid) 1px, transparent 1px) 0 0/60px 60px;
        -webkit-mask: radial-gradient(60% 60% at 50% 55%, #000 0 60%, transparent 80%);
                mask: radial-gradient(60% 60% at 50% 55%, #000 0 60%, transparent 80%);
    }

    /* Rotating light beams (conic gradient) */
    .beams {
        background:
            conic-gradient(from 0deg at 50% 60%,
                transparent 0 20deg,
                var(--shine) 20deg 24deg,
                transparent 24deg 60deg,
                var(--shine) 60deg 64deg,
                transparent 64deg 100%
            );
        filter: blur(20px) saturate(1.2);
        animation: beams-rotate 18s linear infinite;
    }

    /* Multi ring outlines + pulse */
    .ring {
        background:
            radial-gradient(circle at 50% 50%, transparent 62%, #ffffff10 63% 63.8%, transparent 64%),
            radial-gradient(circle at 50% 50%, transparent 74%, #ffffff12 75% 75.8%, transparent 76%),
            radial-gradient(circle at 50% 50%, transparent 86%, #ffffff10 87% 87.5%, transparent 88%);
        box-shadow:
            inset 0 0 80px 10px #7c3aed33,
            0 0 120px 10px #7c3aed22;
        animation: ring-pulse 3.5s ease-in-out infinite;
    }

    /* Inner disc + glow */
    .disc {
        background: radial-gradient(circle at 50% 40%, #3b0a7a 0%, #2a0069 35%, #13043b 68%, #0a0626 100%);
        box-shadow:
            inset 0 0 80px 0 #8b5cf633,
            0 0 60px 0 #8b5cf626,
            0 0 120px 20px #a78bfa22;
    }

    /* Moving sweep lights */
    .sweep {
        background:
            radial-gradient(60% 30% at 30% 40%, #ffffff15, transparent 60%),
            radial-gradient(60% 30% at 70% 60%, #ffffff12, transparent 60%);
        mix-blend-mode: screen;
        animation: sweep-move 7s ease-in-out infinite;
    }

    /* Scanlines overlay */
    .scan {
        background: repeating-linear-gradient(to bottom, #0000 0 2px, #0002 2px 3px);
        opacity: .15;
        mix-blend-mode: overlay;
    }
}
</style>
