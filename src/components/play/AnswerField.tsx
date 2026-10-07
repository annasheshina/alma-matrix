"use client";

import { useEffect, useRef, useState } from "react";
import { Mic, MicOff } from "lucide-react";

// Minimal SpeechRecognition typings (not in TS dom lib everywhere)
interface SRResultItem {
  transcript: string;
}
interface SRResult {
  [index: number]: SRResultItem | undefined;
}
interface SREvent {
  resultIndex: number;
  results: ArrayLike<SRResult>;
}
interface SRInstance {
  lang: string;
  continuous: boolean;
  interimResults: boolean;
  onresult: ((e: SREvent) => void) | null;
  onend: (() => void) | null;
  onerror: (() => void) | null;
  start(): void;
  stop(): void;
}
type SRCtor = new () => SRInstance;

declare global {
  interface Window {
    SpeechRecognition?: SRCtor;
    webkitSpeechRecognition?: SRCtor;
  }
}

export default function AnswerField({
  value,
  onChange,
  placeholder,
  rows = 4,
  autoFocus = true,
}: {
  value: string;
  onChange: (v: string) => void;
  placeholder?: string;
  rows?: number;
  autoFocus?: boolean;
}) {
  const [listening, setListening] = useState(false);
  const recRef = useRef<SRInstance | null>(null);
  const supported =
    typeof window !== "undefined" &&
    (window.SpeechRecognition || window.webkitSpeechRecognition);

  useEffect(() => () => recRef.current?.stop(), []);

  const toggleVoice = () => {
    if (!supported) return;
    if (listening) {
      recRef.current?.stop();
      setListening(false);
      return;
    }
    const Ctor = window.SpeechRecognition ?? window.webkitSpeechRecognition;
    if (!Ctor) return;
    const rec = new Ctor();
    rec.lang = "ru-RU";
    rec.continuous = true;
    rec.interimResults = false;
    rec.onresult = (e: SREvent) => {
      const parts: string[] = [];
      for (let i = e.resultIndex; i < e.results.length; i++) {
        const t = e.results[i]?.[0]?.transcript;
        if (t) parts.push(t);
      }
      const text = parts.join(" ").trim();
      if (text) onChange(value ? `${value} ${text}` : text);
    };
    rec.onend = () => setListening(false);
    rec.onerror = () => setListening(false);
    recRef.current = rec;
    rec.start();
    setListening(true);
  };

  return (
    <div>
      {supported && (
        <div className="mb-1 flex justify-end">
          <button
            type="button"
            onClick={toggleVoice}
            aria-label={listening ? "Остановить запись" : "Ответить голосом"}
            className="flex items-center gap-2 text-[11px] uppercase tracking-[0.2em] cursor-pointer"
            style={{ color: listening ? "var(--accent)" : "var(--ink-dim)" }}
          >
            {listening ? <MicOff size={14} /> : <Mic size={14} />}
            {listening ? "слушаю…" : "голосом"}
          </button>
        </div>
      )}
      <textarea
        className="input-quiet"
        rows={rows}
        autoFocus={autoFocus}
        placeholder={placeholder ?? "Запиши то, что приходит…"}
        value={value}
        onChange={(e) => onChange(e.target.value)}
      />
    </div>
  );
}
