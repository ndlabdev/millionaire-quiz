<script setup lang="ts">
type Question = {
    id: number
    level: 'easy' | 'medium' | 'hard'
    question: string
    answers: string[]
    correctIndex: number
    money: number
    hint?: string
}

// Fetch questions from API
const { data: allQuestions } = await useFetch<Question[]>('/api/questions')

// Sort questions: easy → medium → hard
const gameQuestions = computed(() => {
    if (!allQuestions.value) return []

    const easy = shuffleArray(allQuestions.value.filter(q => q.level === 'easy')).slice(0, 5)
    const medium = shuffleArray(allQuestions.value.filter(q => q.level === 'medium')).slice(0, 5)
    const hard = shuffleArray(allQuestions.value.filter(q => q.level === 'hard')).slice(0, 5)

    return [...easy, ...medium, ...hard]
})

const currentIndex = ref(0)
const currentQuestion = computed(() => gameQuestions.value[currentIndex.value])

const displayText = ref('')
const visibleAnswers = ref([false, false, false, false])
const selectedIndex = ref<number | null>(null)
const countdown = ref(0)
let countdownTimer: number | null = null
const answerLabels = ['A:', 'B:', 'C:', 'D:']

// --- Voice ---
async function speakText(text: string, lang = 'en-US', rate = 1, pitch = 1.2) {
    return new Promise<void>((resolve) => {
        if (!('speechSynthesis' in window)) return resolve()

        const synth = window.speechSynthesis
        let voices: SpeechSynthesisVoice[] = []

        const loadVoices = () => {
            voices = synth.getVoices()
            const voice = voices.find(v => v.lang === lang) || voices[0]
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

// --- Countdown ---
function startCountdown(seconds: number) {
    countdown.value = seconds
    if (countdownTimer) clearInterval(countdownTimer)

    countdownTimer = window.setInterval(() => {
        countdown.value--
        if (countdown.value <= 0) {
            clearInterval(countdownTimer!)
            goToNextQuestion()
        }
    }, 1000)
}

// --- Typewriter effect ---
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

// --- Play question ---
async function playQuestion() {
    if (!currentQuestion.value) return

    selectedIndex.value = null
    visibleAnswers.value = [false, false, false, false]

    await Promise.all([
        speakText(currentQuestion.value.question),
        typeLine(currentQuestion.value.question)
    ])

    for (let i = 0; i < currentQuestion.value.answers.length; i++) {
        visibleAnswers.value[i] = true
        await speakText(`${answerLabels[i]} ${currentQuestion.value.answers[i]}`)
    }

    startCountdown(30)
}

// --- Answer select ---
function selectAnswer(index: number) {
    if (selectedIndex.value !== null) return
    selectedIndex.value = index

    setTimeout(() => {
        goToNextQuestion()
    }, 2000)
}

// --- Next question ---
function goToNextQuestion() {
    currentIndex.value++
    if (currentIndex.value >= gameQuestions.value.length) {
        console.log('🎯 Game Over!')
        return
    }
    playQuestion()
}

function shuffleArray<T>(array: T[]): T[] {
    return array
        .map(item => ({ item, sort: Math.random() }))
        .sort((a, b) => a.sort - b.sort)
        .map(({ item }) => item)
}

onMounted(() => {
    playQuestion()
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

        <!-- Question -->
        <div
            class="bg-[#120733dd] backdrop-blur-md border border-yellow-400/50 rounded-lg px-8 py-4 text-white text-xl max-w-3xl text-center shadow-lg min-h-[80px]"
        >
            {{ displayText }}
        </div>

        <!-- Answers -->
        <div class="grid grid-cols-2 gap-4 max-w-3xl w-full">
            <button
                v-for="(answer, index) in currentQuestion?.answers"
                v-show="visibleAnswers[index]"
                :key="answer"
                :disabled="selectedIndex !== null"
                class="bg-[#1a103d] border-2 border-yellow-400 text-[#fff8e7] text-lg px-6 py-4 rounded-md transition-all duration-300
          hover:bg-yellow-400 hover:text-[#120733] hover:shadow-[0_0_15px_#facc15]"
                :class="{
                    'bg-green-500 text-white': selectedIndex !== null && index === currentQuestion?.correctIndex,
                    'bg-red-500 text-white': selectedIndex === index && index !== currentQuestion?.correctIndex,
                }"
                @click="selectAnswer(index)"
            >
                {{ answerLabels[index] }} {{ answer }}
            </button>
        </div>
    </div>
</template>
