<script setup lang="ts">

interface Props {
    seconds: number
}

const props = defineProps<Props>()
const emit = defineEmits<{
    (e: 'timeup'): void
}>()

const timeLeft = ref(props.seconds)
let timer: number | null = null

function start(seconds: number) {
    stop()
    timeLeft.value = seconds
    timer = window.setInterval(() => {
        timeLeft.value--
        if (timeLeft.value <= 0) {
            stop()
            emit('timeup')
        }
    }, 1000)
}

function stop() {
    if (timer) {
        clearInterval(timer)
        timer = null
    }
    timeLeft.value = 0
}

onUnmounted(stop)

defineExpose({
    start,
    stop,
    timeLeft
})
</script>

<template>
    <div
        v-if="timeLeft > 0"
        class="absolute top-4 right-6 text-3xl font-bold transition-all duration-300"
        :class="{
            'text-yellow-400': timeLeft > 10,
            'text-red-500 animate-flash': timeLeft <= 10,
        }"
    >
        {{ timeLeft }}
    </div>
</template>

<style scoped>
@keyframes flash {
    0%, 100% { transform: scale(1); opacity: 1; }
    50% { transform: scale(1.2); opacity: 0.6; }
}

.animate-flash {
    animation: flash 0.5s infinite;
}
</style>
