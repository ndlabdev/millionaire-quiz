<script setup lang="ts">
import { ref, onMounted } from 'vue'

const emit = defineEmits([
    'show-ladder',
    'highlight-milestones',
    'highlight-lifeline',
    'start-game'
])

const lines = [
    '🎉 Welcome, contenders, to the ultimate challenge: *Who Wants to Be a Millionaire!*',
    'Fifteen questions stand between you and the life-changing prize of $1,000,000.',
    'Every step takes you higher… but one wrong move, and you could fall.',
    'Here’s your money ladder — your path to glory.',
    'And remember… three golden milestones await you at questions 5, 10, and 15. Reach them, and your winnings are safe!',
    'You’re not alone on this journey — you have three lifelines at your disposal.',
    'First, the classic 50:50 — removing two wrong answers instantly.',
    'Next, Phone a Friend — call someone you trust for their insight.',
    'And finally, Ask the Audience — see what the crowd thinks.',
    'Use them wisely!',
    'Now… are you ready to begin?'
]

const lineIndex = ref(0)
const displayText = ref('')
const typing = ref(false)
const visible = ref(true)
const showStartButton = ref(false)

let typingInterval: number | null = null
let skipResolve: (() => void) | null = null

function typeLine(text: string, done: () => void) {
    typing.value = true
    displayText.value = ''
    let i = 0

    const finishLine = () => {
        displayText.value = text
        typing.value = false
        skipResolve = null
        setTimeout(done, 200)
    }

    typingInterval = window.setInterval(() => {
        displayText.value += text[i]
        i++
        if (i >= text.length) {
            stopTyping()
            finishLine()
        }
    }, 40)

    skipResolve = () => {
        stopTyping()
        finishLine()
    }
}

function stopTyping() {
    if (typingInterval !== null) {
        clearInterval(typingInterval)
        typingInterval = null
    }
}

function skipLine() {
    if (skipResolve) {
        skipResolve()
    }
}

function skipAll() {
    stopTyping()
    displayText.value = lines[lines.length - 1] as string
    showStartButton.value = true
    lineIndex.value = lines.length - 1
}

function startGame() {
    visible.value = false
    emit('start-game')
}

function waitForLifelineDone() {
    return new Promise<void>((resolve) => {
        window.addEventListener('lifeline-done', () => resolve(), { once: true })
    })
}

function waitForLadderDone() {
    return new Promise<void>((resolve) => {
        window.addEventListener('ladder-done', () => resolve(), { once: true })
    })
}

onMounted(async () => {
    for (let i = 0; i < lines.length; i++) {
        await new Promise<void>((resolve) => {
            typeLine(lines[i] || '', resolve)
        })

        if (i === 3) {
            emit('show-ladder')
            await waitForLadderDone()
        }
        if (i === 4) {
            emit('highlight-milestones')
            await waitForLadderDone()
        }
        if (i === 6) {
            emit('highlight-lifeline', 'fifty')
            await waitForLifelineDone()
        }
        if (i === 7) {
            emit('highlight-lifeline', 'phone')
            await waitForLifelineDone()
        }
        if (i === 8) {
            emit('highlight-lifeline', 'audience')
            await waitForLifelineDone()
        }
        if (i === lines.length - 1) {
            showStartButton.value = true
        }
        lineIndex.value++
    }
})
</script>

<template>
    <transition name="fade-mc">
        <div
            v-if="visible"
            class="fixed left-8 top-1/2 -translate-y-1/2 flex items-center gap-6 z-50"
        >
            <img
                src="/mc-host.png"
                alt="MC"
                class="w-56 h-auto drop-shadow-lg"
            >

            <div class="relative">
                <div class="bg-[#120733dd] backdrop-blur-md border border-yellow-400/50 rounded-lg p-4 max-w-sm text-white shadow-lg min-h-[100px] flex flex-col gap-4 text-lg leading-relaxed">
                    <span>{{ displayText }}</span>

                    <button
                        v-if="showStartButton"
                        class="self-center px-6 py-2 bg-yellow-400 text-black font-bold rounded-lg shadow-lg hover:bg-yellow-500 transition"
                        @click="startGame"
                    >
                        Start Game
                    </button>
                </div>

                <!-- Skip button -->
                <button
                    v-if="typing"
                    class="absolute -bottom-3 -left-3 bg-yellow-400 text-black px-2 py-1 rounded-full text-xs shadow-lg hover:bg-yellow-500 transition"
                    @click="skipLine"
                >
                    Skip
                </button>

                <button
                    v-if="typing"
                    class="absolute -bottom-3 text-nowrap left-8 bg-yellow-400 text-black px-2 py-1 rounded-full text-xs shadow-lg hover:bg-yellow-500 transition"
                    @click="skipAll"
                >
                    Skip All
                </button>
            </div>
        </div>
    </transition>
</template>

<style scoped>
.fade-mc-leave-active {
    transition: opacity 0.6s ease, transform 0.6s ease;
}
.fade-mc-leave-to {
    opacity: 0;
    transform: translateX(-20px);
}
</style>
