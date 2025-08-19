<script setup lang="ts">
const audioEl = ref<HTMLAudioElement | null>(null)
const isPlaying = ref(false)
const volume = ref(0.5)
const muted = ref(false)
let unlocked = false
let ctx: AudioContext | null = null

function waitForReady(el: HTMLAudioElement): Promise<void> {
    return new Promise((resolve) => {
        if (el.readyState >= 2) resolve()
        else el.addEventListener('loadeddata', () => resolve(), { once: true })
    })
}

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

        if (audioEl.value && audioEl.value.paused) {
            await waitForReady(audioEl.value)
            audioEl.value.volume = muted.value ? 0 : volume.value

            const playPromise = audioEl.value.play()
            if (playPromise !== undefined) {
                await playPromise
            }

            isPlaying.value = true
        }
    } catch (e) {
        console.warn('Autoplay blocked or interrupted:', e)
    }
}

function play() {
    if (audioEl.value && audioEl.value.paused) {
        audioEl.value.play()
        isPlaying.value = true
    }
}

function pause() {
    if (audioEl.value && !audioEl.value.paused) {
        audioEl.value.pause()
        isPlaying.value = false
    }
}

function resume() {
    if (audioEl.value && audioEl.value.paused) {
        audioEl.value.play()
        isPlaying.value = true
    }
}

function toggleMusic() {
    if (!audioEl.value) return

    if (isPlaying.value) {
        pause()
    } else {
        safePlay()
    }
}

function toggleMute() {
    muted.value = !muted.value
    if (audioEl.value) {
        audioEl.value.volume = muted.value ? 0 : volume.value
    }
}

function startOnFirstPointer() {
    const once = () => {
        if (!unlocked) {
            if (typeof window !== 'undefined' && window.AudioContext) {
                ctx = new AudioContext()
                ctx.resume()
            }
            unlocked = true
        }
        window.removeEventListener('pointerdown', once)
    }
    window.addEventListener('pointerdown', once)
    return () => window.removeEventListener('pointerdown', once)
}

onMounted(() => {
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

defineExpose({
    play,
    pause,
    resume
})
</script>

<template>
    <div class="absolute bottom-4 right-6">
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

        <!-- Volume / Mute -->
        <div class="group fixed right-4 bottom-20 z-[4] flex flex-col items-center">
            <input
                v-model.number="volume"
                type="range"
                min="0"
                max="1"
                step="0.01"
                class="volume-slider opacity-0 group-hover:opacity-100 transition duration-300"
            >

            <button
                class="p-3 rounded-full bg-[#120733aa] border border-white/15 text-white shadow-lg hover:bg-yellow-400 hover:text-black transition w-[50px] h-[50px]"
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
    width: 6px;
    height: 80px;
    background: linear-gradient(to top, #facc15, #a855f7);
    border-radius: 4px;
    cursor: pointer;
    margin-bottom: 8px;
    writing-mode: vertical-lr;
    direction: rtl;
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
