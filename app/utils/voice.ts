export function speakText(text: string, lang = 'en-US', rate = 1, pitch = 1.2) {
    return new Promise<void>((resolve) => {
        if (!('speechSynthesis' in window)) {
            console.warn('SpeechSynthesis API is not supported in this browser.')
            resolve()
            return
        }

        const synth = window.speechSynthesis
        let voices: SpeechSynthesisVoice[] = []

        const loadVoices = () => {
            voices = synth.getVoices()

            const femaleKeywords = [
                'female', 'nữ', 'woman',
                'Zira', 'Samantha', 'Eva', 'Joanna',
                'Google US English Female', 'Google UK English Female'
            ]

            let voice = voices.find(v =>
                v.lang === lang
                && femaleKeywords.some(keyword =>
                    v.name.toLowerCase().includes(keyword.toLowerCase())
                )
            )

            if (!voice) {
                voice = voices.find(v => v.lang === lang)
            }

            if (!voice) {
                voice = voices[0]
            }

            console.log('🎤 Voice selected:', voice?.name)

            const utter = new SpeechSynthesisUtterance(text)
            utter.voice = voice || null
            utter.lang = lang
            utter.rate = rate
            utter.pitch = pitch
            utter.onend = () => resolve()

            synth.cancel()
            synth.speak(utter)
        }

        if (synth.getVoices().length === 0) {
            synth.onvoiceschanged = loadVoices
        } else {
            loadVoices()
        }
    })
}
