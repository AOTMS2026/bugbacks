import { useState, useCallback, useRef } from 'react';

interface SpeechRecognitionResult {
    isFinal: boolean;
    [index: number]: {
        transcript: string;
        confidence: number;
    };
}

interface SpeechRecognitionResultList {
    length: number;
    [index: number]: SpeechRecognitionResult;
}

interface SpeechRecognitionEvent extends Event {
    results: SpeechRecognitionResultList;
}

interface SpeechRecognitionErrorEvent extends Event {
    error: string;
}

interface ISpeechRecognition extends EventTarget {
    continuous: boolean;
    interimResults: boolean;
    lang: string;
    start: () => void;
    stop: () => void;
    abort: () => void;
    onstart: ((this: ISpeechRecognition, ev: Event) => void) | null;
    onresult: ((this: ISpeechRecognition, ev: SpeechRecognitionEvent) => void) | null;
    onend: ((this: ISpeechRecognition, ev: Event) => void) | null;
    onerror: ((this: ISpeechRecognition, ev: SpeechRecognitionErrorEvent) => void) | null;
}

interface IWindow extends Window {
    SpeechRecognition: new () => ISpeechRecognition;
    webkitSpeechRecognition: new () => ISpeechRecognition;
}

export const useSpeechRecognition = () => {
    const [isListening, setIsListening] = useState(false);
    const [transcript, setTranscript] = useState('');

    // Initialize support check lazily to avoid useEffect and sync setState issues
    const [isSupported] = useState(() => {
        if (typeof window === 'undefined') return false;
        const win = window as unknown as IWindow;
        return !!(win.SpeechRecognition || win.webkitSpeechRecognition);
    });

    const recognitionRef = useRef<ISpeechRecognition | null>(null);

    const startListening = useCallback(() => {
        if (!isSupported) return;

        // Stop any existing instance
        if (recognitionRef.current) {
            recognitionRef.current.abort();
        }

        const win = window as unknown as IWindow;
        const SpeechRecognition = win.SpeechRecognition || win.webkitSpeechRecognition;
        const recognition = new SpeechRecognition();
        recognitionRef.current = recognition;

        recognition.continuous = true;
        recognition.interimResults = true;
        recognition.lang = 'en-US';

        recognition.onstart = () => {
            setIsListening(true);
            setTranscript('');
        };

        recognition.onresult = (event: SpeechRecognitionEvent) => {
            let fullTranscript = '';
            for (let i = 0; i < event.results.length; ++i) {
                fullTranscript += event.results[i][0].transcript;
            }
            setTranscript(fullTranscript);
        };

        recognition.onend = () => {
            setIsListening(false);
        };

        recognition.onerror = (event: SpeechRecognitionErrorEvent) => {
            console.error('Speech recognition error', event.error);
            setIsListening(false);
        };

        try {
            recognition.start();
        } catch (error) {
            console.error('Failed to start speech recognition:', error);
            setIsListening(false);
        }
    }, [isSupported]);

    const stopListening = useCallback(() => {
        if (recognitionRef.current) {
            recognitionRef.current.stop();
            setIsListening(false);
        }
    }, []);

    const resetTranscript = useCallback(() => {
        setTranscript('');
    }, []);

    return { isListening, transcript, startListening, stopListening, isSupported, setTranscript, resetTranscript };
};
