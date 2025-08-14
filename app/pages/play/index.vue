<script setup lang="ts">
const ladderMode = ref<'none' | 'full' | 'milestones'>('none')
const lifelineHighlight = ref<'fifty' | 'phone' | 'audience' | null>(null)

function handleHighlightLifeline(type: 'fifty' | 'phone' | 'audience') {
    lifelineHighlight.value = type
}
</script>

<template>
    <div>
        <Lifelines
            :highlight="lifelineHighlight"
            @lifeline-done="lifelineHighlight = null"
        />
        <MCIntro
            @show-ladder="ladderMode = 'full'"
            @highlight-milestones="ladderMode = 'milestones'"
            @highlight-lifeline="handleHighlightLifeline"
        />
        <MillionaireBackground />
        <MillionaireQuiz
            :mode="ladderMode"
            @done="ladderMode = 'none'"
        />
    </div>
</template>
