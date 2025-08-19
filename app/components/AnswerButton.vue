<script setup lang="ts">

interface Props {
    label?: string
    answer: string
    index: number
    correctIndex: number | null
    selectedIndex: number | null
    removedAnswers: number[]
    audienceResult?: number[]
    phoneSuggestion?: number | null
    isWaiting: boolean
    isTimeUp: boolean
    timeLeft: number
}

const props = defineProps<Props>()

const emit = defineEmits<{
    (e: 'select', index: number): void
}>()

const isCorrect = computed(() =>
    props.correctIndex !== null && props.index === props.correctIndex
)

const isSelected = computed(() => props.index === props.selectedIndex)
const isRemoved = computed(() => props.removedAnswers.includes(props.index))
const isPhoneSuggested = computed(() => props.phoneSuggestion === props.index)

const buttonClasses = computed(() => ({
    '!bg-green-500 !text-white':
        !props.isWaiting
        && ((isCorrect.value && props.isTimeUp)
          || (props.selectedIndex !== null && isCorrect.value)),
    '!bg-red-500 !text-white animate-shake':
        !props.isWaiting && isSelected.value && !isCorrect.value,
    'waiting-pulse': props.isWaiting && isSelected.value,
    '!ring-4 !ring-blue-400': isPhoneSuggested.value,
    'answer-crossed': isRemoved.value
}))
</script>

<template>
    <button
        class="answer-btn"
        :class="buttonClasses"
        :disabled="selectedIndex !== null || isRemoved || (isTimeUp && !isSelected) || timeLeft <= 0"
        @click="emit('select', index)"
    >
        {{ label }} {{ answer }}
        <span v-if="audienceResult?.length"> — {{ audienceResult[index] }}%</span>
    </button>
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
