export interface VoiceStatusPayload {
  configured: boolean;
  mode: string;
  maxFramesPerMinute: number;
  maxFrameBytes: number;
  supportsRealtimeTranscription: boolean;
  fallbackTranscript: boolean;
  busy?: boolean;
  joined?: boolean;
  roomId?: string;
  usageCount?: number;
  remainingFrames?: number;
}

export interface VoiceErrorPayload {
  code: string;
  message: string;
  ts: number;
  detail?: string;
  resetInMs?: number;
  estimatedBytes?: number;
  maxFrameBytes?: number;
}

export function estimateBase64Bytes(base64: string): number {
  if (!base64) return 0;
  return Math.ceil((base64.length * 3) / 4);
}

export function isVoiceFallbackMode(payload: Partial<VoiceStatusPayload> | null | undefined): boolean {
  return String(payload?.mode || '') === 'mock-transcript' || Boolean(payload?.fallbackTranscript);
}

export function formatVoiceConnectionLabel(args: {
  connected: boolean;
  streaming: boolean;
  latencyMs: number | null;
  voiceStatus: Partial<VoiceStatusPayload> | null;
}): string {
  const { connected, streaming, latencyMs, voiceStatus } = args;
  if (!connected) return 'Offline';
  if (voiceStatus?.busy) return 'Processing';
  if (streaming) return `Live${latencyMs !== null ? ` ${latencyMs}ms` : ''}`;
  if (isVoiceFallbackMode(voiceStatus)) return 'Fallback voice';
  return 'Ready';
}
