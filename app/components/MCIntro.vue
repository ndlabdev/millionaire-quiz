<script setup lang="ts">
import { ref, onMounted } from 'vue'

const emit = defineEmits([
    'show-ladder',
    'highlight-milestones',
    'highlight-lifeline'
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
    'Use them wisely!'
]

const lineIndex = ref(0)
const displayText = ref('')
const typing = ref(false)

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
        lineIndex.value++
    }
})
</script>

<template>
    <div class="fixed left-8 top-1/2 -translate-y-1/2 flex items-center gap-6 z-50">
        <img
            src="/mc-host.png"
            alt="MC"
            class="w-56 h-auto drop-shadow-lg"
        >

        <div class="bg-[#120733dd] backdrop-blur-md border border-yellow-400/50 rounded-lg p-4 max-w-sm text-white shadow-lg min-h-[100px] flex items-center text-lg leading-relaxed">
            {{ displayText }}
            <button
                v-if="typing"
                class="absolute -top-3 -right-3 bg-yellow-400 text-black px-2 py-1 rounded-full text-xs shadow-lg hover:bg-yellow-500 transition"
                @click="skipLine"
            >
                Skip
            </button>
        </div>
    </div>
</template>
