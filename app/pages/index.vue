<template>
    <MillionaireBackground>
        <div class="text-[clamp(16px,2.6vmin,24px)] text-[var(--acc-2)]/90">
            Welcome to
        </div>

        <div
            class="font-extrabold text-[clamp(28px,6.8vmin,60px)] !bg-clip-text text-transparent animate-glow"
            style="background:linear-gradient(180deg,#fff,var(--acc-2),var(--acc-3)); text-shadow:0 0 24px #b388ff44,0 0 48px #f0abfc22;"
        >
            Millionaire&nbsp;Quiz
        </div>

        <div
            class="mt-5 inline-flex items-center gap-2 rounded-full px-4 py-3 font-semibold tracking-[.03em]
                border border-white/15 shadow-[0_8px_30px_#0008,inset_0_0_18px_#7c3aed22]
                backdrop-blur-[6px] bg-[linear-gradient(180deg,#2a0069aa,#1a0a3fbb)]
                transition-all duration-200 hover:scale-105 hover:shadow-[0_12px_36px_#000b,inset_0_0_24px_#a78bfa44]
                hover:border-white/25 cursor-pointer"
        >
            <span
                class="dot inline-block size-2 rounded-full shadow-[0_0_12px_#e879f94d]"
                style="background:radial-gradient(circle,#fff,#c084fc)"
            />
            <span>
                <NuxtLink to="/play">
                    Press <span class="font-bold text-[var(--acc-3)]">Start</span> in your app to play
                </NuxtLink>
            </span>
        </div>
    </MillionaireBackground>
</template>
