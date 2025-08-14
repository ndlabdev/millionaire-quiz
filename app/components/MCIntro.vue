<script setup lang="ts">
import { ref, onMounted } from 'vue'

const emit = defineEmits(['show-ladder', 'highlight-milestones'])

const lines = [
    '🎉 Welcome, contenders, to the ultimate challenge: *Who Wants to Be a Millionaire!*',
    'Fifteen questions stand between you and the life-changing prize of $1,000,000.',
    'Every step takes you higher… but one wrong move, and you could fall.',
    'Here’s your money ladder — your path to glory.',
    'And remember… three golden milestones await you at questions 5, 10, and 15. Reach them, and your winnings are safe!'
]

const lineIndex = ref(0)
const displayText = ref('')
const typing = ref(false)

function typeLine(text: string, done: () => void) {
    typing.value = true
    displayText.value = ''
    let i = 0
    const interval = setInterval(() => {
        displayText.value += text[i]
        i++
        if (i >= text.length) {
            clearInterval(interval)
            typing.value = false
            setTimeout(done, 800)
        }
    }, 40)
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
        </div>
    </div>
</template>
