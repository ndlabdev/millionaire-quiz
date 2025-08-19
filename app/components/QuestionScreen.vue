<script setup lang="ts">
import type MusicToggle from './MusicToggle.vue'
import Countdown from './Countdown.vue'
import type CountdownType from './Countdown.vue'

interface Props {
    lifelines?: 'fiftyFifty' | 'askAudience' | 'phoneFriend'
}

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
const answerLabels = ['A:', 'B:', 'C:', 'D:']

const removedAnswers = ref<number[]>([])
const audienceResult = ref<number[]>([])
const phoneSuggestion = ref<number | null>(null)
const isTimeUp = ref(false)
const canUseLifelines = ref(true)
const showGameOver = ref(false)
const gameOverMessage = ref('')
const isWaiting = ref(false)

const musicRef = ref<InstanceType<typeof MusicToggle> | null>(null)
const countdownRef = ref<InstanceType<typeof CountdownType> | null>(null)

const emit = defineEmits<{
    (e: 'lifelines-ready', ready: boolean): void
    (e: 'correct-answer', nextQuestion: number, nextFn: () => void): void
}>()

const props = defineProps<Props>()
const lifelines = toRef(props, 'lifelines')

watch(canUseLifelines, (val) => {
    emit('lifelines-ready', val)
})

watch(lifelines, (val) => {
    if (!val || !currentQuestion.value) return

    const cq = currentQuestion.value
    const correctIndex: number = cq.correctIndex

    if (val === 'fiftyFifty') {
        const wrongIndexes = cq.answers.map((_, i) => i).filter(i => i !== correctIndex)
        removedAnswers.value = wrongIndexes.sort(() => 0.5 - Math.random()).slice(0, 2)
    }

    if (val === 'askAudience') {
        const percentages: [number, number, number, number] = [0, 0, 0, 0]
        const correctIndex = cq.correctIndex as number

        percentages[correctIndex] = Math.floor(Math.random() * 30) + 40

        const wrongIndexes = [0, 1, 2, 3].filter(i => i !== correctIndex)
        wrongIndexes.forEach((idx, i) => {
            if (i === wrongIndexes.length - 1) {
                percentages[idx] = 100 - percentages.reduce((a, b) => a + b, 0)
            } else {
                const v = Math.floor(Math.random() * ((100 - Number(percentages[correctIndex])) / 2))
                percentages[idx] = v
            }
        })

        audienceResult.value = percentages
    }

    if (val === 'phoneFriend') {
        const isCorrect = Math.random() < 0.75
        phoneSuggestion.value = isCorrect
            ? correctIndex
            : ([0, 1, 2, 3].filter(i => i !== correctIndex)[Math.floor(Math.random() * 3)] ?? 0)
    }
})

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

function handleTimeUp() {
    console.log('⏰ Time\'s up!')
    selectedIndex.value = currentQuestion.value?.correctIndex ?? null
    setTimeout(() => {
        handleGameOver('You ran out of time!')
    }, 2000)
}

function handleGameOver(reason: string) {
    const lastCorrect = currentIndex.value
    const prize = getPrizeAmount(lastCorrect)
    canUseLifelines.value = false
    gameOverMessage.value = `${reason}\nYou won $${prize.toLocaleString()}`
    showGameOver.value = true
}

// --- Play question ---
async function playQuestion() {
    stopAllSounds()
    countdownRef.value?.stop()

    if (!currentQuestion.value) return

    canUseLifelines.value = false
    removedAnswers.value = []
    audienceResult.value = []
    phoneSuggestion.value = null

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

    musicRef.value?.resume()
    canUseLifelines.value = true
    countdownRef.value?.start(30)
}

// --- Answer select ---
function selectAnswer(index: number) {
    if (selectedIndex.value !== null) return
    selectedIndex.value = index
    countdownRef.value?.stop()

    canUseLifelines.value = false
    isWaiting.value = true

    musicRef.value?.pause()
    playSound(waitingSound)

    setTimeout(() => {
        const correctIndex = currentQuestion.value?.correctIndex
        const isCorrect = index === correctIndex

        stopAllSounds()
        isWaiting.value = false

        if (isCorrect) {
            playSound(correctSound)
            emit('correct-answer', currentIndex.value + 1, goToNextQuestion)
        } else {
            playSound(wrongSound)

            setTimeout(() => {
                selectedIndex.value = correctIndex ?? null
            }, 500)

            setTimeout(() => {
                handleGameOver('❌ Wrong answer!')
                musicRef.value?.resume()
            }, 4000)
        }
    }, 4000)
}

// --- Next question ---
function handleVictory() {
    const prize = getPrizeAmount(15)
    canUseLifelines.value = false
    gameOverMessage.value = `🎉 Congratulations!\nYou won $${prize.toLocaleString()}`
    showGameOver.value = true
}

function goToNextQuestion() {
    stopAllSounds()

    currentIndex.value++
    if (currentIndex.value >= gameQuestions.value.length) {
        handleVictory()
        return
    }
    playQuestion()
}

onMounted(() => {
    playQuestion()
})
</script>

<template>
    <div class="absolute inset-0 flex flex-col items-center justify-center gap-6 z-20">
        <!-- Countdown -->
        <Countdown
            ref="countdownRef"
            :seconds="30"
            @timeup="handleTimeUp"
        />

        <MusicToggle ref="musicRef" />

        <!-- Question counter -->
        <div class="text-lg font-semibold text-yellow-300">
            Question {{ currentIndex + 1 }} / {{ gameQuestions.length }}
        </div>

        <!-- Question -->
        <div
            class="bg-[#120733dd] backdrop-blur-md border border-yellow-400/50 rounded-lg px-8 py-4 text-white text-xl max-w-3xl text-center shadow-lg"
        >
            {{ displayText }}
        </div>

        <!-- Answers -->
        <div class="grid grid-cols-2 gap-4 max-w-3xl w-full">
            <button
                v-for="(answer, index) in currentQuestion?.answers"
                v-show="visibleAnswers[index]"
                :key="answer"
                :disabled="selectedIndex !== null || removedAnswers.includes(index) || (countdownRef?.timeLeft ?? 0) <= 0"
                class="answer-btn"
                :class="{
                    '!bg-green-500 !text-white':
                        !isWaiting && ((index === currentQuestion?.correctIndex && isTimeUp)
                            || (selectedIndex !== null && index === currentQuestion?.correctIndex)),
                    '!bg-red-500 !text-white animate-shake':
                        !isWaiting && selectedIndex === index && index !== currentQuestion?.correctIndex,
                    'waiting-pulse': isWaiting && selectedIndex === index,
                    '!ring-4 !ring-blue-400': phoneSuggestion === index,
                    'answer-crossed': removedAnswers.includes(index),
                }"
                @click="selectAnswer(index)"
            >
                {{ answerLabels[index] }} {{ answer }}
                <span v-if="audienceResult.length"> — {{ audienceResult[index] }}%</span>
            </button>
        </div>

        <GameOverModal
            :show="showGameOver"
            :message="gameOverMessage"
            @restart="() => navigateTo('/')"
        />
    </div>
</template>

<style scoped>
.answer-btn {
    background: #1a103d;
    border: 2px solid #facc15;
    color: #fff8e7;
    font-size: 1rem;
    padding: 0.5rem 1.2rem;
    border-radius: 0.5rem;
    position: relative;
    overflow: hidden;
    transition: all 0.3s ease;
}

.answer-btn:hover:not(:disabled) {
    background: #facc15;
    color: #120733;
    box-shadow: 0 0 15px #facc15;
}

.answer-crossed {
    opacity: 0.5;
    cursor: not-allowed;
}

.answer-crossed::before,
.answer-crossed::after {
    content: "";
    position: absolute;
    top: 50%;
    left: 0;
    width: 100%;
    height: 2px;
    background-color: red;
    transform: rotate(25deg);
}

.answer-crossed::after {
    transform: rotate(-25deg);
}

@keyframes shake {
    0%, 100% { transform: translateX(0); }
    20% { transform: translateX(-6px); }
    40% { transform: translateX(6px); }
    60% { transform: translateX(-4px); }
    80% { transform: translateX(4px); }
}

.animate-shake {
    animation: shake 0.5s ease-in-out;
}
@keyframes pulse-glow {
    0%, 100% {
        box-shadow: 0 0 10px #facc15, 0 0 20px #facc15, 0 0 30px #facc15;
        transform: scale(1);
    }
    50% {
        box-shadow: 0 0 20px #ffd700, 0 0 40px #ffd700, 0 0 60px #ffd700;
        transform: scale(1.05);
    }
}

.waiting-pulse {
    animation: pulse-glow 1s infinite;
    border-color: #facc15 !important;
}
</style>
