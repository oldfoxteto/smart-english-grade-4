import { useState, useRef, useEffect, useCallback } from 'react';
import {
  Alert,
  Avatar,
  Box,
  Button,
  Chip,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Fab,
  IconButton,
  InputAdornment,
  Menu,
  MenuItem,
  Paper,
  TextField,
  Tooltip,
  Typography,
} from '@mui/material';
import { ArrowBack, Call, CallEnd, CameraAlt, Close, Mic, MicOff, Send, TipsAndUpdates } from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import { AnimatePresence, motion } from 'framer-motion';
import Webcam from 'react-webcam';
import {
  askAiTutor,
  ApiError,
  getApiHealth,
  getSafetyPolicy,
  getVisionConsent,
  saveVisionConsent,
  trackAnalyticsEvent,
  type AiTutorResponse,
} from '../core/api';
import { getCurrentUser } from '../core/auth';
import { getVoiceSocket } from '../services/voiceSocket';
import { VoiceCooldownBanner } from '../components/VoiceCooldownBanner';
import { playfulPalette } from '../theme/playfulPalette';

interface Message {
  id: string;
  role: 'user' | 'bot';
  text: string;
  time: string;
  imageBase64?: string;
  isTyping?: boolean;
}

const LANGUAGES = [
  { code: 'ar-SA', label: 'Arabic', flag: 'SA', ttsLang: 'ar-SA', name: 'Arabic' },
  { code: 'en-US', label: 'English', flag: 'US', ttsLang: 'en-US', name: 'English' },
  { code: 'el-GR', label: 'Greek', flag: 'GR', ttsLang: 'el-GR', name: 'Greek' },
] as const;

const SCENARIOS: Array<{ id: 'free' | 'restaurant' | 'airport' | 'shopping' | 'vision'; title: string; icon: string }> = [
  { id: 'free', title: 'Free Chat', icon: 'chat' },
  { id: 'restaurant', title: 'Restaurant', icon: 'food' },
  { id: 'airport', title: 'Airport', icon: 'flight' },
  { id: 'shopping', title: 'Shopping', icon: 'shop' },
  { id: 'vision', title: 'What is this?', icon: 'vision' },
];

type TutorLanguage = (typeof LANGUAGES)[number];

function formatTime() {
  return new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
}

function toBase64(buffer: ArrayBuffer) {
  const bytes = new Uint8Array(buffer);
  let binary = '';
  const chunk = 0x8000;
  for (let i = 0; i < bytes.length; i += chunk) {
    binary += String.fromCharCode(...bytes.subarray(i, i + chunk));
  }
  return btoa(binary);
}

function resolveRecorderMimeType() {
  if (typeof MediaRecorder === 'undefined' || typeof MediaRecorder.isTypeSupported !== 'function') {
    return null;
  }
  const candidates = [
    'audio/webm;codecs=opus',
    'audio/webm',
    'audio/mp4',
  ];
  return candidates.find((mime) => MediaRecorder.isTypeSupported(mime)) || null;
}

function toTutorErrorText(error: unknown): string {
  if (error instanceof ApiError) {
    if (error.status === 401) {
      return 'Your session expired. Please sign in again.';
    }
    if (error.status === 429) {
      return 'The service is busy. Please wait a moment and retry.';
    }
    if (error.message === 'AI_PROXY_FAILED' || error.message === 'AI_SERVICE_UNAVAILABLE') {
      return 'AI service is temporarily unavailable. Please try again in a minute.';
    }
    return error.message;
  }

  if (error instanceof Error) {
    const lower = error.message.toLowerCase();
    if (lower.includes('failed to fetch') || lower.includes('network')) {
      return 'Cannot reach the server. Check your internet connection and retry.';
    }
  }

  return 'Connection failed. Please try again.';
}

const AITutorPage = () => {
  const navigate = useNavigate();
  const currentUser = getCurrentUser();

  const [activeLang, setActiveLang] = useState<TutorLanguage>(LANGUAGES[1]);
  const [langMenuAnchor, setLangMenuAnchor] = useState<null | HTMLElement>(null);
  const [activeScenario, setActiveScenario] = useState<'free' | 'restaurant' | 'airport' | 'shopping' | 'vision'>('free');

  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [latestCorrection, setLatestCorrection] = useState<string | null>(null);
  const [errorText, setErrorText] = useState<string | null>(null);
  const [aiMode, setAiMode] = useState<'unknown' | 'openai' | 'fallback'>('unknown');

  const [showWebcam, setShowWebcam] = useState(false);
  const webcamRef = useRef<Webcam>(null);

  const [visionAllowed, setVisionAllowed] = useState(false);
  const [policyRules, setPolicyRules] = useState<string[]>([]);
  const [showConsentDialog, setShowConsentDialog] = useState(false);
  const [guardianName, setGuardianName] = useState('');
  const [consentSaving, setConsentSaving] = useState(false);

  const [isCallMode, setIsCallMode] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const [botIsSpeaking, setBotIsSpeaking] = useState(false);

  const [connected, setConnected] = useState(false);
  const [streaming, setStreaming] = useState(false);
  const [latencyMs, setLatencyMs] = useState<number | null>(null);
  const [voiceLimitedTill, setVoiceLimitedTill] = useState<number | null>(null);
  const [cooldownLeft, setCooldownLeft] = useState<number | null>(null);

  const isCallModeRef = useRef(false);
  const botIsSpeakingRef = useRef(false);
  const loadingRef = useRef(false);
  const recognitionRef = useRef<any>(null);

  const voiceSocketRef = useRef<any>(null);
  const reconnectStartedAtRef = useRef<number | null>(null);
  const voiceConnectErrorCountRef = useRef(0);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const baseRoom = currentUser?.id ? `room-${currentUser.id}` : 'room-guest';
  const roomIdRef = useRef(`${baseRoom}-${globalThis.crypto?.randomUUID?.() || Date.now()}`);

  const endRef = useRef<HTMLDivElement>(null);
  const sendRef = useRef<(text?: string, imageBase64?: string) => Promise<void>>(async () => undefined);

  useEffect(() => {
    setMessages([
      {
        id: 'welcome',
        role: 'bot',
        text: 'Hello! I am LISAN. Choose a scenario and start speaking or typing.',
        time: formatTime(),
      },
    ]);
  }, []);

  useEffect(() => {
    let active = true;
    void getApiHealth()
      .then((health) => {
        if (!active) return;
        setAiMode(health.ai?.mode || 'fallback');
      })
      .catch(() => {
        if (!active) return;
        setAiMode('unknown');
      });
    return () => {
      active = false;
    };
  }, []);

  useEffect(() => {
    if (aiMode === 'fallback' && activeScenario === 'vision') {
      setActiveScenario('free');
      setShowWebcam(false);
    }
  }, [aiMode, activeScenario]);

  useEffect(() => {
    isCallModeRef.current = isCallMode;
    botIsSpeakingRef.current = botIsSpeaking;
    loadingRef.current = loading;
  }, [isCallMode, botIsSpeaking, loading]);

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  useEffect(() => {
    getVisionConsent()
      .then((resp) => {
        setVisionAllowed(resp.allowVision);
        setGuardianName(resp.guardianName || '');
      })
      .catch(() => {
        setVisionAllowed(false);
      });

    getSafetyPolicy()
      .then((policy) => setPolicyRules(Array.isArray(policy.rules) ? policy.rules : []))
      .catch(() => setPolicyRules([]));
  }, []);

  const initRecognition = useCallback((langCode: string) => {
    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (!SpeechRecognition) return;

    if (recognitionRef.current) {
      try {
        recognitionRef.current.abort();
      } catch {
        // noop
      }
    }

    const rec = new SpeechRecognition();
    rec.lang = langCode;
    rec.continuous = true;
    rec.interimResults = true;

    rec.onstart = () => setIsListening(true);
    rec.onend = () => {
      setIsListening(false);
      if (isCallModeRef.current && !loadingRef.current && !botIsSpeakingRef.current) {
        try {
          rec.start();
        } catch {
          // noop
        }
      }
    };

    rec.onerror = () => {
      setIsListening(false);
    };

    let timer: number | undefined;
    rec.onresult = (event: any) => {
      if (loadingRef.current || botIsSpeakingRef.current) return;

      let interim = '';
      let finalText = '';
      for (let i = event.resultIndex; i < event.results.length; i += 1) {
        const text = String(event.results[i][0].transcript || '');
        if (event.results[i].isFinal) finalText += text;
        else interim += text;
      }

      if (interim) setInput(interim);
      if (finalText) {
        setInput(finalText);
        if (timer) window.clearTimeout(timer);
        timer = window.setTimeout(() => {
          void sendRef.current(finalText);
        }, 900);
      }
    };

    recognitionRef.current = rec;
  }, []);

  useEffect(() => {
    initRecognition(activeLang.code);
  }, [activeLang.code, initRecognition]);

  const speakVoice = useCallback((text: string, langCode: string) => {
    if (!('speechSynthesis' in window)) return;
    window.speechSynthesis.cancel();
    setBotIsSpeaking(true);

    const utterance = new SpeechSynthesisUtterance(text.trim());
    utterance.lang = langCode;
    utterance.rate = langCode.startsWith('ar') ? 0.88 : 0.96;
    utterance.onend = () => {
      setBotIsSpeaking(false);
      if (isCallModeRef.current && recognitionRef.current && !loadingRef.current) {
        try {
          recognitionRef.current.start();
        } catch {
          // noop
        }
      }
    };

    window.speechSynthesis.speak(utterance);
  }, []);

  const stopStreaming = useCallback(() => {
    const rec = mediaRecorderRef.current;
    if (rec && rec.state !== 'inactive') rec.stop();
    if (rec) rec.stream.getTracks().forEach((track) => track.stop());
    mediaRecorderRef.current = null;
    setStreaming(false);
  }, []);

  const ensureVoiceSocket = useCallback(() => {
    if (voiceSocketRef.current) return;

    getVoiceSocket()
      .then((socket) => {
        voiceSocketRef.current = socket;

        socket.on('connect', () => {
          setConnected(true);
          setErrorText(null);
          const started = reconnectStartedAtRef.current;
          if (started) {
            const downtimeMs = Date.now() - started;
            reconnectStartedAtRef.current = null;
            void trackAnalyticsEvent({
              eventName: 'voice_socket_reconnected',
              metadata: { downtimeMs },
            }).catch(() => undefined);
          }
        });
        socket.on('disconnect', (reason: string) => {
          setConnected(false);
          if (reason !== 'io client disconnect') {
            reconnectStartedAtRef.current = Date.now();
            void trackAnalyticsEvent({
              eventName: 'voice_socket_disconnected',
              metadata: { reason },
            }).catch(() => undefined);
          }
        });
        socket.on('connect_error', (error: any) => {
          setConnected(false);
          setErrorText('Voice channel is unavailable right now.');
          voiceConnectErrorCountRef.current += 1;
          void trackAnalyticsEvent({
            eventName: 'voice_socket_connect_error',
            metadata: {
              message: String(error?.message || 'unknown'),
              count: voiceConnectErrorCountRef.current,
            },
          }).catch(() => undefined);
        });
        socket.on('voice:pong', (payload: any) => {
          if (!payload?.ts) return;
          setLatencyMs(Math.max(0, Date.now() - Number(payload.ts)));
        });
        socket.on('voice:status', (payload: any) => {
          const mode = String(payload?.mode || '');
          if (mode === 'mock-transcript') {
            setAiMode('fallback');
          }
          if (payload?.busy === false && !streaming) {
            setErrorText(null);
          }
        });
        socket.on('voice:error', (payload: any) => {
          const message = String(payload?.message || 'Voice channel error.');
          setErrorText(message);
          if (String(payload?.code || '').includes('VOICE_')) {
            stopStreaming();
          }
        });
        socket.on('voice:limit', (payload: any) => {
          const resetInMs = Number(payload?.resetInMs || 60_000);
          setVoiceLimitedTill(Date.now() + resetInMs);
          stopStreaming();
          void trackAnalyticsEvent({
            eventName: 'ai_tutor_cooldown_hit',
            metadata: { scenario: activeScenario, resetInMs },
          }).catch(() => undefined);
        });
        socket.on('voice:transcript', (payload: any) => {
          const text = String(payload?.text || '').trim();
          if (!text) return;
          setMessages((prev) => prev.concat({ id: `${Date.now()}-stt`, role: 'bot', text, time: formatTime() }));
        });
        socket.on('voice:tts', (payload: any) => {
          if (payload?.text) speakVoice(String(payload.text), activeLang.ttsLang);
          if (payload?.audioBase64) {
            const audio = new Audio(`data:audio/mp3;base64,${payload.audioBase64}`);
            void audio.play().catch(() => undefined);
          }
        });
      })
      .catch(() => setConnected(false));
  }, [activeLang.ttsLang, activeScenario, speakVoice, stopStreaming, streaming]);

  const startStreaming = useCallback(async () => {
    if (streaming) return;
    ensureVoiceSocket();

    if (!navigator?.mediaDevices?.getUserMedia || typeof MediaRecorder === 'undefined') {
      throw new Error('Voice capture is not supported on this device/browser.');
    }

    let stream: MediaStream | null = null;
    try {
      stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const mimeType = resolveRecorderMimeType();
      const recorder = mimeType ? new MediaRecorder(stream, { mimeType }) : new MediaRecorder(stream);
      mediaRecorderRef.current = recorder;

      const chunkMimeType = mimeType || 'audio/webm';
      const chunks: Blob[] = [];
      const flush = async () => {
        if (!voiceSocketRef.current || chunks.length === 0) return;
        const blob = new Blob(chunks, { type: chunkMimeType });
        chunks.length = 0;
        const base64 = toBase64(await blob.arrayBuffer());
        voiceSocketRef.current.emit('voice:frame', { roomId: roomIdRef.current, frame: base64 });
      };

      recorder.ondataavailable = async (event) => {
        if (event.data.size === 0) return;
        chunks.push(event.data);
        if (chunks.length >= 3) await flush();
      };

      recorder.onerror = () => {
        setErrorText('Audio capture error. Please retry voice call.');
      };

      recorder.onstop = () => {
        void flush();
      };

      recorder.start(250);
      setStreaming(true);
    } catch (error) {
      if (stream) {
        stream.getTracks().forEach((track) => track.stop());
      }
      mediaRecorderRef.current = null;
      setStreaming(false);
      throw error;
    }
  }, [ensureVoiceSocket, streaming]);

  useEffect(() => {
    if (!connected || !voiceSocketRef.current) return;
    const socket = voiceSocketRef.current;
    const sendPing = () => socket.emit('voice:ping', { ts: Date.now() });
    sendPing();
    const id = window.setInterval(sendPing, 10_000);
    return () => window.clearInterval(id);
  }, [connected]);

  useEffect(() => {
    if (!voiceLimitedTill) {
      setCooldownLeft(null);
      return;
    }
    const update = () => {
      const left = Math.max(0, voiceLimitedTill - Date.now());
      setCooldownLeft(left);
      if (left <= 0) setVoiceLimitedTill(null);
    };
    update();
    const id = window.setInterval(update, 500);
    return () => window.clearInterval(id);
  }, [voiceLimitedTill]);

  const sendMessage = useCallback(
    async (text = input, imageBase64?: string) => {
      const cleanText = text.trim();
      if ((!cleanText && !imageBase64) || loading || botIsSpeaking) return;

      setErrorText(null);
      if (isCallMode && recognitionRef.current) {
        try {
          recognitionRef.current.stop();
        } catch {
          // noop
        }
      }

      const userText = cleanText || 'What is this?';
      const userMsg: Message = {
        id: `${Date.now()}-user`,
        role: 'user',
        text: userText,
        time: formatTime(),
        imageBase64,
      };

      setMessages((prev) => prev.concat(userMsg, { id: 'typing', role: 'bot', text: '...', time: '', isTyping: true }));
      setInput('');
      setLoading(true);
      loadingRef.current = true;

      const history = messages
        .filter((m) => !m.isTyping)
        .slice(-8)
        .map((m) => ({ role: m.role, text: m.text, imageBase64: m.imageBase64 }));

      try {
        void trackAnalyticsEvent({
          eventName: 'ai_tutor_submitted',
          metadata: { scenario: activeScenario, langCode: activeLang.code, hasImage: Boolean(imageBase64) },
        }).catch(() => undefined);

        const response: AiTutorResponse = await askAiTutor({
          userMessage: userText,
          scenario: activeScenario,
          history,
          langCode: activeLang.code,
          imageBase64,
        });

        if (response.safety?.blocked && response.safety.reason === 'NO_GUARDIAN_CONSENT') {
          setShowConsentDialog(true);
        }

        const botReply = String(response.reply || response.tutorReply || "Let's continue.").trim();
        const correction = response.correction || response.correctionAr || null;
        if (correction) setLatestCorrection(correction);

        setMessages((prev) => prev.filter((m) => m.id !== 'typing').concat({ id: `${Date.now()}-bot`, role: 'bot', text: botReply, time: formatTime() }));
        speakVoice(botReply, activeLang.ttsLang);

        void trackAnalyticsEvent({
          eventName: 'ai_tutor_success',
          metadata: { scenario: activeScenario, langCode: activeLang.code, blocked: Boolean(response.safety?.blocked) },
        }).catch(() => undefined);
      } catch (error) {
        const message = toTutorErrorText(error);
        setErrorText(message);
        setMessages((prev) =>
          prev
            .filter((m) => m.id !== 'typing')
            .concat({ id: `${Date.now()}-err`, role: 'bot', text: message, time: formatTime() })
        );
        await trackAnalyticsEvent({
          eventName: 'ai_tutor_retry',
          metadata: { scenario: activeScenario, reason: message },
        }).catch(() => undefined);
      } finally {
        setLoading(false);
        loadingRef.current = false;
        if (isCallModeRef.current && recognitionRef.current && !botIsSpeakingRef.current) {
          try {
            recognitionRef.current.start();
          } catch {
            // noop
          }
        }
      }
    },
    [input, loading, botIsSpeaking, isCallMode, messages, activeScenario, activeLang.code, activeLang.ttsLang, speakVoice]
  );

  useEffect(() => {
    sendRef.current = sendMessage;
  }, [sendMessage]);

  const toggleListen = () => {
    if (isListening) {
      recognitionRef.current?.stop();
    } else {
      try {
        recognitionRef.current?.start();
      } catch {
        // noop
      }
    }
  };

  const toggleCallMode = () => {
    ensureVoiceSocket();

    setIsCallMode((prev) => {
      const next = !prev;
      if (next) {
        if (voiceLimitedTill && voiceLimitedTill > Date.now()) {
          setMessages((old) => old.concat({ id: `${Date.now()}-limit`, role: 'bot', text: 'Voice cooldown active. Please wait.', time: formatTime() }));
          return prev;
        }
        setTimeout(() => {
          try {
            recognitionRef.current?.start();
          } catch {
            // noop
          }
        }, 300);
        voiceSocketRef.current?.emit?.('voice:join', roomIdRef.current);
        void startStreaming().catch((error) => {
          const reason = error instanceof Error ? error.message : 'Microphone stream failed';
          setErrorText('Microphone stream failed');
          void trackAnalyticsEvent({
            eventName: 'voice_stream_start_failed',
            metadata: { reason },
          }).catch(() => undefined);
        });
      } else {
        window.speechSynthesis.cancel();
        setBotIsSpeaking(false);
        try {
          recognitionRef.current?.stop();
        } catch {
          // noop
        }
        stopStreaming();
      }
      return next;
    });
  };

  const aiFallbackMode = aiMode === 'fallback';

  const handleScenarioChange = (scenarioId: 'free' | 'restaurant' | 'airport' | 'shopping' | 'vision') => {
    if (scenarioId === 'vision' && aiFallbackMode) {
      setErrorText('Vision mode requires real AI and is currently unavailable.');
      return;
    }
    setActiveScenario(scenarioId);
    if (scenarioId === 'vision') {
      if (!visionAllowed) {
        setShowConsentDialog(true);
        return;
      }
      setShowWebcam(true);
    } else {
      setShowWebcam(false);
    }
  };

  const saveConsent = async () => {
    if (!guardianName.trim()) return;
    setConsentSaving(true);
    try {
      await saveVisionConsent({ allowVision: true, guardianName: guardianName.trim() });
      setVisionAllowed(true);
      setShowConsentDialog(false);
      setShowWebcam(true);
    } finally {
      setConsentSaving(false);
    }
  };

  const captureAndAsk = () => {
    const imageSrc = webcamRef.current?.getScreenshot();
    if (!imageSrc) return;
    setShowWebcam(false);
    void sendMessage(`What is this? Tell me in English and ${activeLang.name}.`, imageSrc);
  };

  const connectionStatus = connected ? (streaming ? `Live${latencyMs !== null ? ` ${latencyMs}ms` : ''}` : 'Ready') : 'Offline';
  const cooldownActive = voiceLimitedTill !== null && voiceLimitedTill > Date.now();

  if (isCallMode) {
    return (
      <Box
        sx={{
          minHeight: { xs: "72vh", md: "78vh" },
          borderRadius: 5,
          overflow: "hidden",
          background: playfulPalette.candyGradient,
          color: playfulPalette.ink,
          display: "flex",
          flexDirection: "column",
          boxShadow: playfulPalette.glow,
          border: `1px solid ${playfulPalette.line}`,
        }}
      >
        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            gap: 1,
            flexWrap: "wrap",
            p: 2.5,
            borderBottom: `1px solid ${playfulPalette.line}`,
            background: "rgba(255,255,255,0.3)",
          }}
        >
          <Chip label={activeLang.label} sx={{ bgcolor: "rgba(255,255,255,0.6)", color: playfulPalette.ink, fontWeight: 800 }} />
          <Chip label={SCENARIOS.find((s) => s.id === activeScenario)?.title || "Tutor"} sx={{ bgcolor: "rgba(255,255,255,0.6)", color: playfulPalette.ink, fontWeight: 800 }} />
          <Chip
            color={cooldownActive ? "warning" : connected ? "success" : "default"}
            label={connectionStatus}
            sx={{ fontWeight: 800 }}
          />
        </Box>

        <Box sx={{ flex: 1, display: "flex", flexDirection: "column", justifyContent: "center", alignItems: "center", px: 3 }}>
          <motion.div animate={botIsSpeaking ? { scale: [1, 1.08, 1] } : {}} transition={{ duration: 1.2, repeat: Infinity }}>
            <Avatar
              sx={{
                width: 132,
                height: 132,
                bgcolor: "rgba(255,255,255,0.56)",
                color: playfulPalette.ink,
                fontSize: "3rem",
                boxShadow: "0 18px 42px rgba(255, 139, 167, 0.18)",
                border: `1px solid ${playfulPalette.line}`,
              }}
            >
              AI
            </Avatar>
          </motion.div>
          <Typography sx={{ mt: 2, fontWeight: 900, fontSize: "1.15rem" }}>
            {botIsSpeaking ? "Tutor speaking..." : isListening ? "Listening..." : "Thinking..."}
          </Typography>

          {latestCorrection && (
            <Paper
              sx={{
                mt: 3,
                p: 1.6,
                maxWidth: 420,
                borderRadius: 3,
                bgcolor: "rgba(255,255,255,0.52)",
                color: playfulPalette.ink,
                border: `1px solid ${playfulPalette.line}`,
                backdropFilter: "blur(12px)",
              }}
            >
              <Typography sx={{ display: "flex", alignItems: "center", gap: 0.7, fontWeight: 700, fontSize: "0.88rem" }}>
                <TipsAndUpdates fontSize="small" /> Suggestion: {latestCorrection}
              </Typography>
            </Paper>
          )}
        </Box>

        <Box sx={{ px: 4, py: 2, minHeight: 100, display: "flex", alignItems: "center", justifyContent: "center" }}>
          <Typography sx={{ textAlign: "center", fontSize: "1.08rem", color: playfulPalette.ink }}>
            {input || (botIsSpeaking ? messages[messages.length - 1]?.text : "")}
          </Typography>
        </Box>

        {cooldownActive && cooldownLeft !== null && (
          <Box sx={{ px: 3 }}>
            <VoiceCooldownBanner cooldownMs={cooldownLeft} onRetry={toggleCallMode} />
          </Box>
        )}

        <Box sx={{ display: "flex", justifyContent: "center", gap: 3, pb: 4, pt: 1 }}>
          <Fab onClick={toggleListen} sx={{ bgcolor: isListening ? "#F7FBFC" : "rgba(255,255,255,0.55)", color: playfulPalette.ink }}>
            {isListening ? <Mic /> : <MicOff />}
          </Fab>
          <Fab color="error" onClick={toggleCallMode}>
            <CallEnd />
          </Fab>
        </Box>
      </Box>
    );
  }

  return (
    <Box
      sx={{
        position: "relative",
        minHeight: { xs: "72vh", md: "78vh" },
        display: "flex",
        flexDirection: "column",
        borderRadius: 5,
        overflow: "hidden",
        background: "linear-gradient(180deg, #fffdf4 0%, #fff7ee 100%)",
        boxShadow: playfulPalette.glow,
        border: `1px solid ${playfulPalette.line}`,
      }}
    >
      <Box
        sx={{
          p: { xs: 1.6, md: 2 },
          background: playfulPalette.heroGradient,
          color: playfulPalette.ink,
        }}
      >
        <Box sx={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 1.2, flexWrap: "wrap" }}>
          <Box sx={{ display: "flex", alignItems: "center", gap: 1.2 }}>
            <IconButton onClick={() => navigate(-1)} sx={{ color: playfulPalette.ink, bgcolor: "rgba(255,255,255,0.55)" }}>
              <ArrowBack />
            </IconButton>

            <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
              <Avatar sx={{ width: 42, height: 42, bgcolor: "rgba(255,255,255,0.55)", color: playfulPalette.ink }}>AI</Avatar>
              <Box>
                <Typography sx={{ fontWeight: 900, lineHeight: 1.1 }}>LISAN Tutor</Typography>
                <Typography sx={{ fontSize: "0.76rem", color: "rgba(40,75,99,0.72)" }}>Secure AI practice</Typography>
              </Box>
            </Box>
          </Box>

          <Box sx={{ display: "flex", alignItems: "center", gap: 1, flexWrap: "wrap" }}>
            {aiFallbackMode && <Chip size="small" label="Fallback Mode" color="warning" sx={{ fontWeight: 700 }} />}
            <Chip
              size="small"
              label={connected ? "Voice ready" : "Text mode"}
              sx={{ bgcolor: "rgba(255,255,255,0.55)", color: playfulPalette.ink, fontWeight: 800 }}
            />
            <Tooltip title="Language">
              <IconButton onClick={(e) => setLangMenuAnchor(e.currentTarget)} sx={{ color: playfulPalette.ink, bgcolor: "rgba(255,255,255,0.55)" }}>
                {activeLang.flag}
              </IconButton>
            </Tooltip>
          </Box>
        </Box>

        <Typography sx={{ mt: 1.6, color: "rgba(40,75,99,0.78)", maxWidth: 720, lineHeight: 1.65 }}>
          Switch between scenarios, type or speak naturally, and let the tutor correct and guide the conversation.
        </Typography>
      </Box>

      <Menu anchorEl={langMenuAnchor} open={Boolean(langMenuAnchor)} onClose={() => setLangMenuAnchor(null)}>
        {LANGUAGES.map((lang) => (
          <MenuItem
            key={lang.code}
            selected={lang.code === activeLang.code}
            onClick={() => {
              setActiveLang(lang);
              setLangMenuAnchor(null);
            }}
          >
            {lang.flag} {lang.label}
          </MenuItem>
        ))}
      </Menu>

      <Box
        sx={{
          p: 1.2,
          display: "flex",
          gap: 1,
          overflowX: "auto",
          bgcolor: "rgba(255,255,255,0.92)",
          borderBottom: `1px solid ${playfulPalette.line}`,
          backdropFilter: "blur(14px)",
        }}
      >
        <Button
          variant="contained"
          onClick={toggleCallMode}
          sx={{
            borderRadius: 999,
            fontWeight: 900,
            px: 2,
            color: playfulPalette.ink,
            background: playfulPalette.actionGradient,
          }}
          startIcon={<Call />}
        >
          Voice Call
        </Button>
        {SCENARIOS.map((scenario) => (
          <Chip
            key={scenario.id}
            label={scenario.title}
            onClick={() => handleScenarioChange(scenario.id)}
            disabled={aiFallbackMode && scenario.id === 'vision'}
            color={activeScenario === scenario.id ? (scenario.id === 'vision' ? 'secondary' : 'primary') : 'default'}
            variant={activeScenario === scenario.id ? 'filled' : 'outlined'}
            sx={{ fontWeight: 700 }}
          />
        ))}
      </Box>

      {aiFallbackMode && (
        <Alert severity="warning" sx={{ m: 1.5, borderRadius: 3 }}>
          Fallback mode is active. Vision features are temporarily disabled until real AI is enabled.
        </Alert>
      )}

      {errorText && (
        <Alert severity="error" sx={{ m: 1.5, borderRadius: 3 }}>
          {errorText}
        </Alert>
      )}

      <AnimatePresence>
        {showWebcam && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            style={{ position: 'absolute', inset: 0, zIndex: 1200, background: '#000' }}
          >
            <Box sx={{ p: 1.5, display: 'flex', justifyContent: 'space-between', alignItems: 'center', color: '#fff', position: 'absolute', width: '100%', zIndex: 2 }}>
              <Typography sx={{ fontWeight: 800 }}>Vision Capture</Typography>
              <IconButton
                sx={{ color: '#fff' }}
                onClick={() => {
                  setShowWebcam(false);
                  setActiveScenario('free');
                }}
              >
                <Close />
              </IconButton>
            </Box>
            <Webcam
              audio={false}
              ref={webcamRef}
              screenshotFormat="image/jpeg"
              videoConstraints={{ facingMode: 'environment' }}
              style={{ width: '100%', height: '100%', objectFit: 'cover' }}
            />
            <Box sx={{ position: 'absolute', bottom: 28, width: '100%', display: 'flex', justifyContent: 'center' }}>
              <Fab color="secondary" onClick={captureAndAsk}>
                <CameraAlt />
              </Fab>
            </Box>
          </motion.div>
        )}
      </AnimatePresence>

      <Box sx={{ flex: 1, overflowY: 'auto', px: { xs: 1.2, sm: 2 }, py: 1.8, display: 'flex', flexDirection: 'column', gap: 1.5 }}>
        <AnimatePresence initial={false}>
          {messages.map((message, index) => {
            const isBot = message.role === 'bot';
            return (
              <motion.div key={message.id} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}>
                <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: isBot ? 'flex-start' : 'flex-end' }}>
                  <Box sx={{ display: 'flex', gap: 1, maxWidth: '86%', alignItems: 'flex-end', flexDirection: isBot ? 'row' : 'row-reverse' }}>
                    {isBot && <Avatar sx={{ bgcolor: playfulPalette.sky, color: playfulPalette.ink, width: 32, height: 32 }}>AI</Avatar>}
                    <Paper
                      sx={{
                        p: 1.5,
                        px: 2,
                        borderRadius: isBot ? '18px 18px 18px 6px' : '18px 18px 6px 18px',
                        bgcolor: isBot ? 'rgba(255,255,255,0.96)' : playfulPalette.candyGradient,
                        color: playfulPalette.ink,
                        boxShadow: isBot ? '0 12px 30px rgba(255,190,120,0.14)' : '0 14px 30px rgba(255,139,167,0.24)',
                        border: `1px solid ${playfulPalette.line}`,
                      }}
                    >
                      {message.imageBase64 && <img src={message.imageBase64} alt="captured" style={{ width: 180, borderRadius: 8, marginBottom: 8 }} />}
                      <Typography sx={{ whiteSpace: 'pre-wrap' }}>{message.isTyping ? '...' : message.text}</Typography>
                    </Paper>
                  </Box>

                  {index === messages.length - 1 && isBot && latestCorrection && (
                    <Box sx={{ mt: 0.75, ml: 5, px: 1, py: 0.5, bgcolor: playfulPalette.softPeach, borderRadius: 1.5 }}>
                      <Typography sx={{ fontSize: '0.78rem', fontWeight: 700 }}>Tip: {latestCorrection}</Typography>
                    </Box>
                  )}
                </Box>
              </motion.div>
            );
          })}
        </AnimatePresence>
        {cooldownActive && cooldownLeft !== null && <VoiceCooldownBanner cooldownMs={cooldownLeft} onRetry={toggleCallMode} />}
        <div ref={endRef} />
      </Box>

      <Box sx={{ p: 1.5, bgcolor: 'rgba(255,255,255,0.92)', borderTop: `1px solid ${playfulPalette.line}`, backdropFilter: 'blur(14px)' }}>
        <TextField
          fullWidth
          multiline
          maxRows={3}
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Type or speak..."
          onKeyDown={(e) => {
            if (e.key === 'Enter' && !e.shiftKey) {
              e.preventDefault();
              void sendRef.current();
            }
          }}
          InputProps={{
            endAdornment: (
              <InputAdornment position="end" sx={{ gap: 0.5 }}>
                <IconButton onClick={toggleListen} sx={{ bgcolor: isListening ? '#f44336' : playfulPalette.peach, color: '#fff' }}>
                  {isListening ? <MicOff /> : <Mic />}
                </IconButton>
                <IconButton
                  onClick={() => void sendRef.current()}
                  disabled={loading || (!input.trim() && activeScenario !== 'vision')}
                  sx={{ bgcolor: playfulPalette.sky, color: playfulPalette.ink }}
                >
                  <Send />
                </IconButton>
              </InputAdornment>
            ),
          }}
        />
      </Box>

      <Dialog open={showConsentDialog} onClose={() => setShowConsentDialog(false)} maxWidth="sm" fullWidth>
        <DialogTitle>Vision Safety Consent</DialogTitle>
        <DialogContent>
          <Typography sx={{ mb: 1.5 }}>
            Camera mode is disabled for child safety. Parent/guardian approval is required before sending images to AI.
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
            Safety policy: object-only photos allowed. Faces and sensitive personal data are blocked.
          </Typography>
          {policyRules.length > 0 && (
            <Box sx={{ mb: 2, pl: 1 }}>
              {policyRules.slice(0, 4).map((rule) => (
                <Typography key={rule} variant="body2" color="text.secondary" sx={{ mb: 0.5 }}>
                  - {rule}
                </Typography>
              ))}
            </Box>
          )}
          <TextField
            fullWidth
            label="Guardian full name"
            value={guardianName}
            onChange={(e) => setGuardianName(e.target.value)}
            placeholder="Enter parent/guardian name"
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setShowConsentDialog(false)}>Cancel</Button>
          <Button onClick={() => void saveConsent()} variant="contained" disabled={consentSaving || !guardianName.trim()}>
            {consentSaving ? 'Saving...' : 'Approve Vision Mode'}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default AITutorPage;
