// ============================================================
// Sound System using Web Speech API + Audio Context
// ============================================================

// Text-to-Speech: نطق الكلمات الإنجليزية
export const speakWord = (text: string, lang = 'en-US') => {
    if (!window.speechSynthesis) return;
    window.speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = lang;
    utterance.rate = 0.85;
    utterance.pitch = 1.1;
    utterance.volume = 1;
    window.speechSynthesis.speak(utterance);
};

// ============================================================
// Sound Effects using AudioContext (no external files needed)
// ============================================================

const getAudioContext = (): AudioContext | null => {
    try {
        return new (window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext)();
    } catch {
        return null;
    }
};

const playTone = (
    frequency: number,
    duration: number,
    type: OscillatorType = 'sine',
    volume = 0.3,
    delay = 0
) => {
    const ctx = getAudioContext();
    if (!ctx) return;

    const oscillator = ctx.createOscillator();
    const gainNode = ctx.createGain();

    oscillator.connect(gainNode);
    gainNode.connect(ctx.destination);

    oscillator.type = type;
    oscillator.frequency.setValueAtTime(frequency, ctx.currentTime + delay);

    gainNode.gain.setValueAtTime(0, ctx.currentTime + delay);
    gainNode.gain.linearRampToValueAtTime(volume, ctx.currentTime + delay + 0.01);
    gainNode.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + delay + duration);

    oscillator.start(ctx.currentTime + delay);
    oscillator.stop(ctx.currentTime + delay + duration);
};

// ✅ صوت الإجابة الصحيحة - نغمة صاعدة مبهجة
export const playCorrect = () => {
    playTone(523, 0.15, 'sine', 0.3, 0);      // C5
    playTone(659, 0.15, 'sine', 0.3, 0.1);    // E5
    playTone(784, 0.25, 'sine', 0.3, 0.2);    // G5
};

// ❌ صوت الإجابة الخاطئة - نغمة هابطة
export const playWrong = () => {
    playTone(300, 0.2, 'sawtooth', 0.2, 0);
    playTone(220, 0.3, 'sawtooth', 0.2, 0.15);
};

// 🏆 صوت الفوز بمستوى جديد - نغمة احتفالية
export const playLevelUp = () => {
    const notes = [523, 659, 784, 1047];
    notes.forEach((freq, i) => {
        playTone(freq, 0.2, 'sine', 0.35, i * 0.12);
    });
};

// ⭐ صوت كسب النجوم
export const playStar = () => {
    playTone(880, 0.1, 'sine', 0.25, 0);
    playTone(1100, 0.15, 'sine', 0.25, 0.08);
};

// 🔘 صوت النقر على زر
export const playClick = () => {
    playTone(600, 0.08, 'sine', 0.15, 0);
};

// 🎉 صوت إتمام الاختبار بنجاح
export const playSuccess = () => {
    const melody = [523, 659, 784, 659, 784, 1047];
    melody.forEach((freq, i) => {
        playTone(freq, 0.18, 'sine', 0.3, i * 0.1);
    });
};
