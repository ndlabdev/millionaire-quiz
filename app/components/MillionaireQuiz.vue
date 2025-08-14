<script setup lang="ts">
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

const visible = ref(false)
const activeIndex = ref<number | null>(null)

onMounted(() => {
    visible.value = true

    let i = 0
    const timer = setInterval(() => {
        activeIndex.value = levels.length - 1 - i
        i++
        if (i >= levels.length) {
            clearInterval(timer)

            const milestones = [5, 10, 15]
            let mIndex = 0

            const milestoneTimer = setInterval(() => {
                const targetIndex = levels.findIndex(l => l.number === milestones[mIndex])
                if (targetIndex !== -1) {
                    activeIndex.value = targetIndex
                }
                mIndex++
                if (mIndex >= milestones.length) {
                    clearInterval(milestoneTimer)
                    setTimeout(() => {
                        visible.value = false
                    }, 800)
                }
            }, 600)
        }
    }, 300)
})
</script>

<template>
    <transition name="slide-quiz">
        <div
            v-if="visible"
            class="absolute right-40 top-1/2 -translate-y-1/2 w-64
               bg-[#120733dd] backdrop-blur-md border border-white/20
               shadow-xl rounded-lg overflow-hidden z-10"
        >
            <ul>
                <li
                    v-for="(level, index) in levels"
                    :key="level.number"
                    class="flex justify-between px-4 py-2 text-white text-sm uppercase transition-all duration-300 rounded-lg"
                    :class="[
                        activeIndex === index
                            ? 'bg-yellow-400 text-black'
                            : level.milestone
                                ? 'bg-[#1a103d] text-[#fff8e7] shadow-[0_0_12px_rgba(250,204,21,0.5)] font-bold'
                                : '',
                    ]"
                >
                    <span>{{ level.number }}</span>
                    <span>${{ level.amount }}</span>
                </li>
            </ul>
        </div>
    </transition>
</template>

<style scoped>
.slide-quiz-enter-from {
    transform: translateX(100%);
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
    transform: translateX(100%);
    opacity: 0;
}
.slide-quiz-enter-active,
.slide-quiz-leave-active {
    transition: all 0.6s ease;
}
</style>
