<script setup lang="ts">
const ladderMode = ref<'none' | 'full' | 'milestones'>('none')
const lifelineHighlight = ref<'fifty' | 'phone' | 'audience' | null>(null)
const showMC = ref(true)
const showQuestion = ref(false)

function handleHighlightLifeline(type: 'fifty' | 'phone' | 'audience') {
    lifelineHighlight.value = type
}

function startGame() {
    showMC.value = false
    showQuestion.value = true
}
</script>

<template>
    <div>
        <MillionaireLifelines
            :highlight="lifelineHighlight"
            @lifeline-done="lifelineHighlight = null"
        />
        <MCIntro
            v-if="showMC"
            @show-ladder="ladderMode = 'full'"
            @highlight-milestones="ladderMode = 'milestones'"
            @highlight-lifeline="handleHighlightLifeline"
            @start-game="startGame"
        />
        <MillionaireBackground />
        <MillionaireQuiz
            :mode="ladderMode"
            @done="ladderMode = 'none'"
        />

        <QuestionScreen
            v-if="showQuestion"
            class="fade-in"
        />
    </div>
</template>

<style scoped>
.fade-in {
    animation: fadeIn 0.5s ease forwards;
}

@keyframes fadeIn {
    from {
        opacity: 0;
        transform: translateY(20px);
    }
    to {
        opacity: 1;
        transform: translateY(0);
    }
}
</style>
