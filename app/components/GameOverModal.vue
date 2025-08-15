<script setup lang="ts">
interface Props {
    show: boolean
    message: string
}

defineProps<Props>()
defineEmits<{ (e: 'restart'): void }>()
</script>

<template>
    <transition name="fade">
        <div
            v-if="show"
            class="fixed inset-0 flex items-center justify-center bg-black/70 backdrop-blur-sm z-50"
        >
            <div
                class="bg-gradient-to-b from-purple-800 to-purple-900 border-4 border-yellow-400 rounded-2xl shadow-xl p-8 text-center w-[90%] max-w-md animate-scale-in"
            >
                <h2 class="text-yellow-300 text-3xl font-bold mb-4">
                    Game Over
                </h2>
                <p class="text-white text-lg mb-6">
                    {{ message }}
                </p>

                <button
                    class="bg-yellow-400 hover:bg-yellow-300 text-purple-900 font-bold px-6 py-3 rounded-lg shadow-lg transition-all"
                    @click="$emit('restart')"
                >
                    Play Again
                </button>
            </div>
        </div>
    </transition>
</template>

<style scoped>
.fade-enter-active,
.fade-leave-active {
    transition: opacity 0.3s ease;
}
.fade-enter-from,
.fade-leave-to {
    opacity: 0;
}

@keyframes scaleIn {
    from {
        transform: scale(0.8);
        opacity: 0;
    }
    to {
        transform: scale(1);
        opacity: 1;
    }
}
.animate-scale-in {
    animation: scaleIn 0.3s ease;
}
</style>
