<script setup lang="ts">
const ladderMode = ref<'none' | 'full' | 'milestones'>('none')
</script>

<template>
    <div>
        <MCIntro
            @show-ladder="ladderMode = 'full'"
            @highlight-milestones="ladderMode = 'milestones'"
        />
        <MillionaireBackground />
        <MillionaireQuiz
            :mode="ladderMode"
            @done="ladderMode = 'none'"
        />
    </div>
</template>
