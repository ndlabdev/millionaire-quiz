<template>
    <!-- Root background container -->
    <div
        class="fixed inset-0 grid place-items-center isolate overflow-hidden"
        style="background: radial-gradient(1200px 800px at 50% 60%, var(--bg-2) 0%, var(--bg-1) 60%, #02010a 100%);"
    >
        <!-- Rotating beams -->
        <div class="beams pointer-events-none absolute inset-[-10%] z-0" />

        <!-- Starfield -->
        <div class="stars pointer-events-none absolute inset-0 z-0" />

        <!-- Subtle grid -->
        <div class="absolute inset-0 z-[1] pointer-events-none grid-mask" />

        <!-- Center ring + disc + title -->
        <div
            class="
                relative z-[2] grid place-items-center aspect-square
                size-[min(85vmin,500px)]
                sm:size-[min(90vmin,600px)]
                lg:size-[min(100vmin,720px)]
                xl:size-[min(110vmin,900px)]
            "
        >
            <div class="ring absolute inset-0 rounded-full" />
            <div class="disc absolute inset-[12%] rounded-full overflow-hidden">
                <div class="sweep absolute inset-[-20%] pointer-events-none" />
            </div>

            <div class="relative text-center uppercase tracking-[.12em] leading-tight drop-shadow-[0_6px_10px_#0009] select-none">
                <slot />
            </div>
        </div>

        <!-- Scanlines -->
        <div class="scan absolute inset-0 z-[3] pointer-events-none" />
    </div>
</template>
