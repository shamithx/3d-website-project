"use client";

import { useCallback, useEffect, useRef, useState } from "react";

type SpeakOptions = {
  text: string;
  lang: string;
  onBoundary?: (charIndex: number) => void;
  onEnd?: () => void;
  rate?: number;
};

export function useSpeech() {
  const [supported, setSupported] = useState(false);
  const [speaking, setSpeaking] = useState(false);
  const [paused, setPaused] = useState(false);
  const [voices, setVoices] = useState<SpeechSynthesisVoice[]>([]);
  const utteranceRef = useRef<SpeechSynthesisUtterance | null>(null);

  useEffect(() => {
    if (typeof window === "undefined" || !("speechSynthesis" in window)) return;
    setSupported(true);
    const load = () => setVoices(window.speechSynthesis.getVoices());
    load();
    window.speechSynthesis.addEventListener("voiceschanged", load);
    return () => {
      window.speechSynthesis.removeEventListener("voiceschanged", load);
      window.speechSynthesis.cancel();
    };
  }, []);

  const hasVoiceFor = useCallback(
    (lang: string) => voices.some((voice) => voice.lang.toLowerCase().startsWith(lang.toLowerCase().slice(0, 2))),
    [voices],
  );

  const stop = useCallback(() => {
    if (typeof window === "undefined" || !("speechSynthesis" in window)) return;
    window.speechSynthesis.cancel();
    setSpeaking(false);
    setPaused(false);
    utteranceRef.current = null;
  }, []);

  const pause = useCallback(() => {
    if (typeof window === "undefined" || !("speechSynthesis" in window)) return;
    window.speechSynthesis.pause();
    setPaused(true);
  }, []);

  const resume = useCallback(() => {
    if (typeof window === "undefined" || !("speechSynthesis" in window)) return;
    window.speechSynthesis.resume();
    setPaused(false);
  }, []);

  const speak = useCallback(
    ({ text, lang, onBoundary, onEnd, rate = 0.94 }: SpeakOptions) => {
      if (typeof window === "undefined" || !("speechSynthesis" in window)) return;
      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = lang;
      utterance.rate = rate;
      utterance.pitch = 1;
      const match =
        voices.find((voice) => voice.lang.toLowerCase() === lang.toLowerCase()) ??
        voices.find((voice) => voice.lang.toLowerCase().startsWith(lang.slice(0, 2).toLowerCase()));
      if (match) utterance.voice = match;
      utterance.onstart = () => {
        setSpeaking(true);
        setPaused(false);
      };
      utterance.onend = () => {
        setSpeaking(false);
        setPaused(false);
        utteranceRef.current = null;
        onEnd?.();
      };
      utterance.onerror = () => {
        setSpeaking(false);
        setPaused(false);
      };
      if (onBoundary) {
        utterance.onboundary = (event) => {
          if (event.name === "word" || event.name === "sentence") onBoundary(event.charIndex);
        };
      }
      utteranceRef.current = utterance;
      window.speechSynthesis.speak(utterance);
    },
    [voices],
  );

  return { supported, speaking, paused, voices, hasVoiceFor, speak, pause, resume, stop };
}
