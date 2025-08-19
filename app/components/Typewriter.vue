<script setup lang="ts">
interface Props {
    text: string
    speed?: number
    autoStart?: boolean
}

const props = withDefaults(defineProps<Props>(), {
    speed: 40,
    autoStart: true
})

const display = ref('')
let timer: number | null = null

// --- core typewriter ---
function typeLine(text: string): Promise<void> {
    return new Promise<void>((resolve) => {
        if (timer) {
            clearInterval(timer)
            timer = null
        }

        display.value = ''
        let i = 0

        if (props.speed <= 0) {
            display.value = text
            resolve()
            return
        }

        timer = window.setInterval(() => {
            if (i < text.length) {
                display.value += text[i]
                i++
            } else {
                clearInterval(timer!)
                timer = null
                resolve()
            }
        }, props.speed)
    })
}

// --- skip ---
function skip() {
    if (timer) {
        clearInterval(timer)
        timer = null
    }
    display.value = props.text
}

// --- lifecycle ---
onMounted(() => {
    if (props.autoStart) {
        typeLine(props.text)
    } else {
        display.value = ''
    }
})

watch(
    () => props.text,
    (newText) => {
        skip()
        if (props.autoStart) {
            typeLine(newText)
        } else {
            display.value = ''
        }
    }
)

onBeforeUnmount(() => {
    if (timer) {
        clearInterval(timer)
        timer = null
    }
})

defineExpose({
    typeLine,
    skip
})
</script>

<template>
    <div
        class="bg-[#120733dd] backdrop-blur-md border-2 border-yellow-400 rounded-lg px-8 py-4 text-white text-xl max-w-3xl text-center shadow-lg"
    >
        {{ display }}
    </div>
</template>
