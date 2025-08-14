<script setup lang="ts">
const audioEl = ref<HTMLAudioElement | null>(null)
const isPlaying = ref(false)
const volume = ref(0.5)
const muted = ref(false)
let unlocked = false
let ctx: AudioContext | null = null

async function safePlay() {
    try {
        if (!unlocked) {
            if (typeof window !== 'undefined' && window.AudioContext) {
                ctx = new AudioContext()
                if (ctx.state === 'suspended') {
                    await ctx.resume()
                }
            }
            unlocked = true
        }

        if (audioEl.value) {
            audioEl.value.volume = muted.value ? 0 : volume.value
            await audioEl.value.play()
            isPlaying.value = true
        }
    } catch (e) {
        console.warn('Autoplay blocked:', e)
    }
}

function pause() {
    audioEl.value?.pause()
    isPlaying.value = false
}

function toggleMusic() {
    if (!audioEl.value) return
    if (audioEl.value.paused) safePlay()
    else pause()
}

function toggleMute() {
    muted.value = !muted.value
}

function startOnFirstPointer() {
    const once = () => {
        if (audioEl.value?.paused) safePlay()
        window.removeEventListener('pointerdown', once)
    }
    window.addEventListener('pointerdown', once)
    return () => window.removeEventListener('pointerdown', once)
}

onMounted(() => {
    // safePlay()
    const off = startOnFirstPointer()

    window.addEventListener('beforeunload', pause)
    onBeforeUnmount(() => {
        off()
        window.removeEventListener('beforeunload', pause)
    })
})

watch([volume, muted], ([val, isMuted]) => {
    if (audioEl.value) {
        audioEl.value.volume = isMuted ? 0 : val
    }
})
</script>

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
        <div class="relative z-[2] grid place-items-center size-[min(85vmin,720px)] aspect-square">
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

        <!-- Audio -->
        <audio
            id="bgm"
            ref="audioEl"
            preload="auto"
            loop
        >
            <source
                src="/millionaire-theme.mp3"
                type="audio/mpeg"
            >
        </audio>

        <!-- Music toggle -->
        <button
            type="button"
            class="music group fixed right-4 bottom-4 z-[4] flex items-center gap-2 rounded-full px-3 py-2
   border border-white/15 text-white cursor-pointer select-none
   shadow-[0_8px_22px_#0008,inset_0_0_12px_#7c3aed22] backdrop-blur-[6px]
   transition-transform duration-150 ease-out hover:-translate-y-0.5
   bg-[#120733aa]"
            :aria-pressed="isPlaying ? 'true' : 'false'"
            @click="toggleMusic"
        >
            <span
                class="led block size-[0.62rem] rounded-full transition-all"
                :class="isPlaying ? 'bg-emerald-500 shadow-[0_0_10px_#22c55e]' : 'bg-red-500 shadow-[0_0_8px_#ef4444]'"
            />
            <span>{{ isPlaying ? 'Pause Music' : 'Play Music' }}</span>
        </button>

        <div class="group fixed right-4 bottom-20 z-[4] flex flex-col items-center">
            <input
                v-model.number="volume"
                type="range"
                min="0"
                max="1"
                step="0.01"
                orient="vertical"
                class="volume-slider opacity-0 group-hover:opacity-100 transition duration-300"
            >

            <button
                class="p-3 rounded-full bg-[#120733aa] border border-white/15 text-white shadow-lg hover:bg-yellow-400 hover:text-black transition"
                @click="toggleMute"
            >
                <span v-if="muted || volume === 0">🔇</span>
                <span v-else-if="volume < 0.5">🔉</span>
                <span v-else>🔊</span>
            </button>
        </div>
    </div>
</template>

<style scoped>
.volume-slider {
  writing-mode: bt-lr; /* Firefox */
  -webkit-appearance: slider-vertical; /* Chrome */
  width: 6px;
  height: 80px;
  background: linear-gradient(to top, #facc15, #a855f7);
  border-radius: 4px;
  cursor: pointer;
  margin-bottom: 8px;
}

.volume-slider::-webkit-slider-thumb {
  -webkit-appearance: none;
  appearance: none;
  height: 14px;
  width: 14px;
  border-radius: 50%;
  background: #fff8e7;
  border: 2px solid #facc15;
  cursor: pointer;
}

.volume-slider::-moz-range-thumb {
  height: 14px;
  width: 14px;
  border-radius: 50%;
  background: #fff8e7;
  border: 2px solid #facc15;
  cursor: pointer;
}
</style>
