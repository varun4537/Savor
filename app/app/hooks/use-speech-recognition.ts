'use client';

import { useState, useEffect, useCallback, useRef } from 'react';

interface UseSpeechRecognitionOptions {
    onResult?: (transcript: string) => void;
    onError?: (error: string) => void;
    continuous?: boolean;
    interimResults?: boolean;
}

interface SpeechRecognitionResult {
    transcript: string;
    isListening: boolean;
    isSupported: boolean;
    error: string | null;
    startListening: () => void;
    stopListening: () => void;
}

export function useSpeechRecognition(options: UseSpeechRecognitionOptions = {}): SpeechRecognitionResult {
    const { onResult, onError, continuous = false, interimResults = false } = options;

    const [transcript, setTranscript] = useState('');
    const [isListening, setIsListening] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [isSupported, setIsSupported] = useState(false);

    const recognitionRef = useRef<any>(null);

    useEffect(() => {
        // Check for browser support
        const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;

        if (SpeechRecognition) {
            setIsSupported(true);
            recognitionRef.current = new SpeechRecognition();

            const recognition = recognitionRef.current;

            // Auto-detect language from browser
            recognition.lang = navigator.language || 'en-US';
            recognition.continuous = continuous;
            recognition.interimResults = interimResults;

            recognition.onstart = () => {
                setIsListening(true);
                setError(null);
            };

            recognition.onend = () => {
                setIsListening(false);
            };

            recognition.onerror = (event: any) => {
                console.error('Speech recognition error:', event.error);
                setIsListening(false);

                let errorMessage = 'Speech recognition error';
                switch (event.error) {
                    case 'no-speech':
                        errorMessage = 'No speech detected. Try again.';
                        break;
                    case 'audio-capture':
                        errorMessage = 'No microphone found.';
                        break;
                    case 'not-allowed':
                        errorMessage = 'Microphone access denied.';
                        break;
                    case 'network':
                        errorMessage = 'Network error. Check connection.';
                        break;
                    default:
                        errorMessage = `Error: ${event.error}`;
                }

                setError(errorMessage);
                onError?.(errorMessage);
            };

            recognition.onresult = (event: any) => {
                const results = event.results;
                let finalTranscript = '';

                for (let i = event.resultIndex; i < results.length; i++) {
                    const transcriptPart = results[i][0].transcript;
                    if (results[i].isFinal) {
                        finalTranscript += transcriptPart;
                    }
                }

                if (finalTranscript) {
                    setTranscript(finalTranscript);
                    onResult?.(finalTranscript);
                }
            };
        } else {
            setIsSupported(false);
        }

        return () => {
            if (recognitionRef.current) {
                recognitionRef.current.abort();
            }
        };
    }, [continuous, interimResults, onResult, onError]);

    const startListening = useCallback(() => {
        if (recognitionRef.current && !isListening) {
            setTranscript('');
            setError(null);
            try {
                recognitionRef.current.start();
            } catch (e) {
                console.error('Failed to start recognition:', e);
            }
        }
    }, [isListening]);

    const stopListening = useCallback(() => {
        if (recognitionRef.current && isListening) {
            recognitionRef.current.stop();
        }
    }, [isListening]);

    return {
        transcript,
        isListening,
        isSupported,
        error,
        startListening,
        stopListening
    };
}
