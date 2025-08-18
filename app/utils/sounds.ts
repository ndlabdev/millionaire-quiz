export const waitingSound = new Audio('/waitingSound.m4a')
export const correctSound = new Audio('/correctSound.m4a')
export const wrongSound = new Audio('/wrongSound.m4a')

waitingSound.volume = 1
correctSound.volume = 1
wrongSound.volume = 1

export function stopAllSounds() {
    console.log('⏹️ Stopping all sounds...')

    waitingSound.pause()
    waitingSound.currentTime = 0

    correctSound.pause()
    correctSound.currentTime = 0

    wrongSound.pause()
    wrongSound.currentTime = 0

    console.log('🎵 Status:', {
        waiting: { paused: waitingSound.paused, current: waitingSound.currentTime },
        correct: { paused: correctSound.paused, current: correctSound.currentTime },
        wrong: { paused: wrongSound.paused, current: wrongSound.currentTime }
    })
}

export function playSound(audio: HTMLAudioElement) {
    stopAllSounds()
    audio.play().catch(err => console.warn('Audio blocked:', err))
}
