<script setup lang="ts">
const props = defineProps<{
    disabled?: boolean
    canUseLifelines?: boolean
    highlight?: 'fifty' | 'phone' | 'audience' | null
}>()

const activeHighlight = ref<'fifty' | 'phone' | 'audience' | null>(null)

const emit = defineEmits<{
    (e: 'lifeline-done'): void
    (e: 'use-lifeline', type: 'fiftyFifty' | 'askAudience' | 'phoneFriend'): void
}>()

const localCanUseLifelines = ref(props.canUseLifelines ?? false)

watch(() => props.canUseLifelines, (val) => {
    localCanUseLifelines.value = val ?? false
})

watch(() => props.highlight, (val) => {
    if (val) {
        activeHighlight.value = val
        setTimeout(() => {
            activeHighlight.value = null
            emit('lifeline-done')
            window.dispatchEvent(new Event('lifeline-done'))
        }, 1200)
    }
})

const usedLifelines = ref({
    fifty: false,
    phone: false,
    audience: false
})

function useFiftyFifty() {
    if (props.disabled || usedLifelines.value.fifty) return
    usedLifelines.value.fifty = true
    emit('use-lifeline', 'fiftyFifty')
    console.log('🔍 50:50 used!')
}

function usePhone() {
    if (props.disabled || usedLifelines.value.phone) return
    usedLifelines.value.phone = true
    emit('use-lifeline', 'phoneFriend')
    console.log('📞 Phone a Friend used!')
}

function useAudience() {
    if (props.disabled || usedLifelines.value.audience) return
    usedLifelines.value.audience = true
    emit('use-lifeline', 'askAudience')
    console.log('👥 Ask the Audience used!')
}
</script>

<template>
    <div
        class="fixed top-6 left-1/2 -translate-x-1/2 z-30 flex gap-4
           bg-[#120733bb] backdrop-blur-md px-6 py-3 rounded-full
           border border-yellow-400/40 shadow-lg"
    >
        <button
            :disabled="!localCanUseLifelines || usedLifelines.fifty"
            class="lifeline-btn"
            :class="{ highlight: activeHighlight === 'fifty' }"
            @click="useFiftyFifty"
        >
            50:50
        </button>

        <button
            :disabled="!localCanUseLifelines || usedLifelines.phone"
            class="lifeline-btn"
            :class="{ highlight: activeHighlight === 'phone' }"
            @click="usePhone"
        >
            📞
        </button>

        <button
            :disabled="!localCanUseLifelines || usedLifelines.audience"
            class="lifeline-btn"
            :class="{ highlight: activeHighlight === 'audience' }"
            @click="useAudience"
        >
            👥
        </button>
    </div>
</template>

<style scoped>
.lifeline-btn {
    background: transparent;
    border: 2px solid #facc15;
    color: #fff8e7;
    font-weight: bold;
    padding: 0.5rem 1.2rem;
    border-radius: 9999px;
    font-size: 1rem;
    transition: all 0.3s ease;
}
.lifeline-btn:hover:not(:disabled) {
    background: #facc15;
    color: #120733;
    box-shadow: 0 0 15px #facc15;
}
.lifeline-btn:disabled {
    opacity: 0.4;
    cursor: not-allowed;
}
.highlight {
    background: #facc15 !important;
    color: #120733 !important;
    box-shadow: 0 0 20px #facc15, 0 0 40px #facc15;
    transform: scale(1.1);
}
</style>
