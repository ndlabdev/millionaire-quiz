<template>
    <div class="absolute inset-0 flex flex-col items-center justify-center gap-6 z-20">
        <div class="bg-[#120733dd] backdrop-blur-md border border-yellow-400/50 rounded-lg px-8 py-4 text-white text-xl max-w-3xl text-center shadow-lg">
            Which planet is known as the Red Planet?
        </div>

        <div class="grid grid-cols-2 gap-4 max-w-3xl w-full">
            <button class="answer-btn">
                A: Mercury
            </button>
            <button class="answer-btn">
                B: Venus
            </button>
            <button class="answer-btn">
                C: Mars
            </button>
            <button class="answer-btn">
                D: Jupiter
            </button>
        </div>
    </div>
</template>

<style scoped>
.answer-btn {
    background: #1a103d;
    border: 2px solid #facc15;
    color: #fff8e7;
    font-size: 1.1rem;
    padding: 1rem;
    border-radius: 0.5rem;
    transition: all 0.3s ease;
}
.answer-btn:hover {
    background: #facc15;
    color: #120733;
    box-shadow: 0 0 15px #facc15;
}
</style>
