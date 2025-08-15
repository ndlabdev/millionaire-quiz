<script setup lang="ts">
import { ref, onMounted } from 'vue'

function speakText(text: string, lang = 'en-US', rate = 1, pitch = 1.2) {
    return new Promise<void>((resolve) => {
        if (!('speechSynthesis' in window)) {
            console.warn('SpeechSynthesis API is not supported in this browser.')
            resolve()
            return
        }

        const synth = window.speechSynthesis
        let voices: SpeechSynthesisVoice[] = []

        const loadVoices = () => {
            voices = synth.getVoices()

            const femaleKeywords = [
                'female', 'nữ', 'woman',
                'Zira', 'Samantha', 'Eva', 'Joanna',
                'Google US English Female', 'Google UK English Female'
            ]

            let voice = voices.find(v =>
                v.lang === lang
                && femaleKeywords.some(keyword =>
                    v.name.toLowerCase().includes(keyword.toLowerCase())
                )
            )

            if (!voice) {
                voice = voices.find(v => v.lang === lang)
            }

            if (!voice) {
                voice = voices[0]
            }

            console.log('🎤 Voice selected:', voice?.name)

            const utter = new SpeechSynthesisUtterance(text)
            utter.voice = voice || null
            utter.lang = lang
            utter.rate = rate
            utter.pitch = pitch
            utter.onend = () => resolve()

            synth.cancel()
            synth.speak(utter)
        }

        if (synth.getVoices().length === 0) {
            synth.onvoiceschanged = loadVoices
        } else {
            loadVoices()
        }
    })
}

const question = ref('Which planet is known as the Red Planet?')
const answers = ref([
    'A: Mercury',
    'B: Venus',
    'C: Mars',
    'D: Jupiter'
])

const displayText = ref('')
const visibleAnswers = ref([false, false, false, false])

function typeLine(text: string) {
    return new Promise<void>((resolve) => {
        displayText.value = ''
        let i = 0
        const timer = setInterval(() => {
            displayText.value += text[i]
            i++
            if (i >= text.length) {
                clearInterval(timer)
                resolve()
            }
        }, 40)
    })
}

onMounted(async () => {
    await Promise.all([
        speakText(question.value),
        typeLine(question.value)
    ])

    for (let i = 0; i < answers.value.length; i++) {
        visibleAnswers.value[i] = true
        await speakText(answers.value[i]!)
    }
})
</script>

<template>
    <div class="absolute inset-0 flex flex-col items-center justify-center gap-6 z-20">
        <div
            class="bg-[#120733dd] backdrop-blur-md border border-yellow-400/50 rounded-lg px-8 py-4 text-white text-xl max-w-3xl text-center shadow-lg min-h-[80px]"
        >
            {{ displayText }}
        </div>

        <div class="grid grid-cols-2 gap-4 max-w-3xl w-full">
            <button
                v-for="(answer, index) in answers"
                v-show="visibleAnswers[index]"
                :key="answer"
                class="bg-[#1a103d] border-2 border-yellow-400 text-[#fff8e7] text-lg px-6 py-4 rounded-md transition-all duration-300 hover:bg-yellow-400 hover:text-[#120733] hover:shadow-[0_0_15px_#facc15]"
            >
                {{ answer }}
            </button>
        </div>
    </div>
</template>
