import { describe, expect, it } from 'vitest';
import {
  estimateBase64Bytes,
  formatVoiceConnectionLabel,
  isVoiceFallbackMode,
} from '../services/voiceProtocol';

describe('voiceProtocol', () => {
  it('estimates base64 bytes safely', () => {
    expect(estimateBase64Bytes('')).toBe(0);
    expect(estimateBase64Bytes('YWJjZA==')).toBeGreaterThanOrEqual(4);
  });

  it('detects fallback voice mode', () => {
    expect(isVoiceFallbackMode({ mode: 'mock-transcript' })).toBe(true);
    expect(isVoiceFallbackMode({ fallbackTranscript: true })).toBe(true);
    expect(isVoiceFallbackMode({ mode: 'openai-realtime-proxy' })).toBe(false);
  });

  it('formats connection label based on runtime state', () => {
    expect(
      formatVoiceConnectionLabel({
        connected: false,
        streaming: false,
        latencyMs: null,
        voiceStatus: null,
      })
    ).toBe('Offline');

    expect(
      formatVoiceConnectionLabel({
        connected: true,
        streaming: false,
        latencyMs: null,
        voiceStatus: { busy: true },
      })
    ).toBe('Processing');

    expect(
      formatVoiceConnectionLabel({
        connected: true,
        streaming: true,
        latencyMs: 88,
        voiceStatus: { mode: 'openai-realtime-proxy' },
      })
    ).toBe('Live 88ms');
  });
});
