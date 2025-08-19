<script setup lang="ts">
import type CountdownType from './Countdown.vue'
import type TypewriterType from './Typewriter.vue'
import type MusicToggleType from './MusicToggle.vue'

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

const musicRef = ref<InstanceType<typeof MusicToggleType> | null>(null)
const countdownRef = ref<InstanceType<typeof CountdownType> | null>(null)
const typewriterRef = ref<InstanceType<typeof TypewriterType> | null>(null)

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

    typewriterRef.value?.typeLine(currentQuestion.value.question)
    await speakText(currentQuestion.value.question)

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
        <Typewriter
            ref="typewriterRef"
            :text="currentQuestion?.question ?? ''"
            :speed="40"
        />

        <!-- Answers -->
        <div class="grid grid-cols-2 gap-4 max-w-3xl w-full">
            <AnswerButton
                v-for="(answer, index) in currentQuestion?.answers"
                v-show="visibleAnswers[index]"
                :key="answer"
                :label="answerLabels[index]"
                :answer="answer"
                :index="index"
                :correct-index="currentQuestion?.correctIndex ?? null"
                :selected-index="selectedIndex"
                :removed-answers="removedAnswers"
                :audience-result="audienceResult"
                :phone-suggestion="phoneSuggestion"
                :is-waiting="isWaiting"
                :is-time-up="isTimeUp"
                :time-left="(countdownRef?.timeLeft ?? 0)"
                @select="selectAnswer"
            />
        </div>

        <GameOverModal
            :show="showGameOver"
            :message="gameOverMessage"
            @restart="() => navigateTo('/')"
        />
    </div>
</template>
