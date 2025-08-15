<script setup lang="ts">

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
const selectedIndex = ref<number | null>(null)
const correctIndex = 2
const countdown = ref(0)
let countdownTimer: number | null = null

async function selectAnswer(index: number) {
    if (selectedIndex.value !== null) return
    selectedIndex.value = index

    // playMusic(suspenseMusic, true)

    // // Delay 3 giây như trên ghế nóng
    // await new Promise(r => setTimeout(r, 3000))

    // // Hiển thị đúng / sai
    // if (index === correctIndex) {
    //     playMusic(correctSound)
    // } else {
    //     playMusic(wrongSound)
    // }

    // // Delay thêm 2s rồi sang câu tiếp theo
    // await new Promise(r => setTimeout(r, 2000))
    // goToNextQuestion()
}

function startCountdown(seconds: number) {
    countdown.value = seconds
    if (countdownTimer) clearInterval(countdownTimer)

    countdownTimer = window.setInterval(() => {
        countdown.value--
        if (countdown.value <= 0) {
            clearInterval(countdownTimer!)
            console.log('⏰ Time’s up!')
        }
    }, 1000)
}

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

    startCountdown(30)
})
</script>

<template>
    <div class="absolute inset-0 flex flex-col items-center justify-center gap-6 z-20">
        <!-- Countdown -->
        <div
            v-if="countdown > 0"
            class="absolute top-4 right-6 text-yellow-400 text-3xl font-bold"
        >
            {{ countdown }}
        </div>

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
                :disabled="selectedIndex !== null"
                class="bg-[#1a103d] border-2 border-yellow-400 text-[#fff8e7] text-lg px-6 py-4 rounded-md transition-all duration-300
                    hover:bg-yellow-400 hover:text-[#120733] hover:shadow-[0_0_15px_#facc15]
                    [&.selected]:bg-yellow-500 [&.correct]:bg-green-500 [&.wrong]:bg-red-500"
                :class="{
                    'bg-blue-500 text-white shadow-[0_0_15px_rgba(59,130,246,0.7)]': selectedIndex === index && index !== correctIndex,
                    'bg-green-500 text-white shadow-[0_0_20px_rgba(34,197,94,0.8)]': selectedIndex !== null && index === correctIndex,
                    'bg-red-500 text-white shadow-[0_0_20px_rgba(239,68,68,0.8)]': selectedIndex === index && index !== correctIndex,
                }"
                @click="selectAnswer(index)"
            >
                {{ answer }}
            </button>
        </div>
    </div>
</template>
