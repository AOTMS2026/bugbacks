import { useState, useCallback } from 'react';

export const useTextToSpeech = () => {
    const [isSpeaking, setIsSpeaking] = useState(false);

    const speak = useCallback((text: string) => {
        if (!('speechSynthesis' in window)) {
            console.warn('Text-to-speech not supported');
            return;
        }

        // Cancel any current speaking
        window.speechSynthesis.cancel();

        const utterance = new SpeechSynthesisUtterance(text);
        utterance.lang = 'en-US';
        utterance.rate = 1;

        utterance.onstart = () => setIsSpeaking(true);
        utterance.onend = () => setIsSpeaking(false);
        utterance.onerror = () => setIsSpeaking(false);

        window.speechSynthesis.speak(utterance);
    }, []);

    const stop = useCallback(() => {
        if ('speechSynthesis' in window) {
            window.speechSynthesis.cancel();
            setIsSpeaking(false);
        }
    }, []);

    return { isSpeaking, speak, stop };
};
