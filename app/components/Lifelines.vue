<script setup lang="ts">
const usedLifelines = ref({
    fifty: false,
    phone: false,
    audience: false
})

function useFiftyFifty() {
    if (usedLifelines.value.fifty) return
    usedLifelines.value.fifty = true
    console.log('🔍 50:50 used!')
}

function usePhone() {
    if (usedLifelines.value.phone) return
    usedLifelines.value.phone = true
    console.log('📞 Phone a Friend used!')
}

function useAudience() {
    if (usedLifelines.value.audience) return
    usedLifelines.value.audience = true
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
            :disabled="usedLifelines.fifty"
            class="lifeline-btn"
            @click="useFiftyFifty"
        >
            50:50
        </button>

        <button
            :disabled="usedLifelines.phone"
            class="lifeline-btn"
            @click="usePhone"
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
  box-shadow: 0 0 10px #facc15;
}
.lifeline-btn:disabled {
  opacity: 0.4;
  cursor: not-allowed;
}
</style>
