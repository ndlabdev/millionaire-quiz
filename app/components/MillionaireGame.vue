<script setup lang="ts">
import { ref } from 'vue'

const questions = [
    {
        question: 'What is the capital of France?',
        answers: ['Berlin', 'Madrid', 'Paris', 'Rome'],
        correct: 2
    },
    {
        question: 'Which planet is known as the Red Planet?',
        answers: ['Venus', 'Mars', 'Jupiter', 'Saturn'],
        correct: 1
    }
]

interface QuestionLevel {
    number: number
    amount: string
    milestone?: boolean
}

const levels: QuestionLevel[] = [
    { number: 15, amount: '1,000,000', milestone: true },
    { number: 14, amount: '500,000' },
    { number: 13, amount: '250,000' },
    { number: 12, amount: '125,000' },
    { number: 11, amount: '64,000' },
    { number: 10, amount: '32,000', milestone: true },
    { number: 9, amount: '16,000' },
    { number: 8, amount: '8,000' },
    { number: 7, amount: '4,000' },
    { number: 6, amount: '2,000' },
    { number: 5, amount: '1,000', milestone: true },
    { number: 4, amount: '500' },
    { number: 3, amount: '300' },
    { number: 2, amount: '200' },
    { number: 1, amount: '100' }
]

const showLadder = ref(false)
const currentQuestionIndex = ref(0)
const removedAnswers = ref<number[]>([])
const usedLifelines = ref({
    fifty: false,
    phone: false,
    audience: false
})

function startGame() {
    showLadder.value = true
}

function selectAnswer(index: number) {
    if (index === questions[currentQuestionIndex.value].correct) {
        console.log('✅ Correct!')
        currentQuestionIndex.value++
        removedAnswers.value = []
    } else {
        console.log('❌ Wrong!')
    }
}

// Lifeline: 50:50
function useFiftyFifty() {
    if (usedLifelines.value.fifty) return
    usedLifelines.value.fifty = true
    const wrongIndexes = questions[currentQuestionIndex.value].answers
        .map((_, idx) => idx)
        .filter(idx => idx !== questions[currentQuestionIndex.value].correct)
    removedAnswers.value = wrongIndexes.sort(() => 0.5 - Math.random()).slice(0, 2)
}

// Lifeline: Phone a Friend
function usePhoneFriend() {
    if (usedLifelines.value.phone) return
    usedLifelines.value.phone = true
    alert(`📞 Your friend thinks the answer is: ${questions[currentQuestionIndex.value].answers[questions[currentQuestionIndex.value].correct]}`)
}

// Lifeline: Ask the Audience
function useAudience() {
    if (usedLifelines.value.audience) return
    usedLifelines.value.audience = true
    alert('📊 Audience poll: 10% / 15% / 60% / 15% (highest for the correct answer)')
}
</script>

<template>
    <div class="relative w-full h-full flex items-center justify-center">
        <!-- Câu hỏi -->
        <div class="w-[700px] p-6 bg-[#1a103d]/90 rounded-lg border border-yellow-400/50 shadow-xl">
            <!-- Lifelines -->
            <div class="flex justify-center gap-4 mb-6">
                <button
                    :disabled="usedLifelines.fifty"
                    class="lifeline-btn"
                    @click="useFiftyFifty"
                >
                    50:50
                </button>
                <button
                    :disabled="usedLifelines.phone"
                    class="lifeline-btn"
                    @click="usePhoneFriend"
                >
                    📞
                </button>
                <button
                    :disabled="usedLifelines.audience"
                    class="lifeline-btn"
                    @click="useAudience"
                >
                    👥
                </button>
            </div>

            <!-- Question text -->
            <div class="text-white text-lg font-bold mb-6 text-center">
                {{ questions[currentQuestionIndex]?.question }}
            </div>

            <!-- Answers -->
            <div class="grid grid-cols-2 gap-4">
                <button
                    v-for="(ans, idx) in questions[currentQuestionIndex]?.answers"
                    :key="idx"
                    :disabled="removedAnswers.includes(idx)"
                    class="px-4 py-3 rounded-lg border border-yellow-400/50 text-white
                 bg-[#120733dd] hover:bg-yellow-400 hover:text-black
                 transition-all duration-300 font-semibold disabled:opacity-30"
                    @click="selectAnswer(idx)"
                >
                    {{ ans }}
                </button>
            </div>
        </div>

        <!-- Prize Ladder -->
        <transition name="slide-quiz">
            <div
                v-if="showLadder"
                class="absolute right-4 top-1/2 -translate-y-1/2 w-64
               bg-[#120733dd] backdrop-blur-md border border-yellow-400/50
               shadow-xl rounded-lg overflow-hidden"
            >
                <ul>
                    <li
                        v-for="(level, index) in levels"
                        :key="level.number"
                        class="flex justify-between px-4 py-2 text-white text-sm uppercase transition-all duration-300"
                        :class="[
                            currentQuestionIndex === levels.length - 1 - index
                                ? 'bg-yellow-400 text-black'
                                : level.milestone
                                    ? 'bg-gradient-to-r from-purple-900 to-purple-800 border border-yellow-300 text-[#fff8e7] shadow-[0_0_12px_rgba(250,204,21,0.5)] font-bold'
                                    : '',
                        ]"
                    >
                        <span>{{ level.number }}</span>
                        <span>${{ level.amount }}</span>
                    </li>
                </ul>
            </div>
        </transition>

        <!-- Start Button -->
        <button
            v-if="!showLadder"
            class="absolute bottom-8 px-6 py-3 bg-yellow-400 text-black font-bold rounded-lg shadow-lg hover:bg-yellow-500 transition"
            @click="startGame"
        >
            Start Game
        </button>
    </div>
</template>

<style scoped>
.lifeline-btn {
  background: #2b1d59;
  border: 2px solid #facc15;
  color: white;
  font-weight: bold;
  padding: 0.5rem 1.2rem;
  border-radius: 9999px;
  transition: all 0.3s;
}
.lifeline-btn:hover:not(:disabled) {
  background: #facc15;
  color: black;
}
.lifeline-btn:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.slide-quiz-enter-from {
  transform: translateX(120%);
  opacity: 0;
}
.slide-quiz-enter-to {
  transform: translateX(0);
  opacity: 1;
}
.slide-quiz-leave-from {
  transform: translateX(0);
  opacity: 1;
}
.slide-quiz-leave-to {
  transform: translateX(120%);
  opacity: 0;
}
.slide-quiz-enter-active,
.slide-quiz-leave-active {
  transition: all 0.6s ease;
}
</style>
