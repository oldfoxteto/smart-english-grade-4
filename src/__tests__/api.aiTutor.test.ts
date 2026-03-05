import { beforeEach, describe, expect, it, vi } from 'vitest';
import { askAiTutor, API_BASE_URL } from '../core/api';

describe('askAiTutor', () => {
  beforeEach(() => {
    localStorage.clear();
    localStorage.setItem('lisan_access_token', 'token-1');
    (global.fetch as unknown as ReturnType<typeof vi.fn>).mockReset();
  });

  it('calls backend proxy and normalizes response', async () => {
    const fetchMock = global.fetch as unknown as ReturnType<typeof vi.fn>;
    fetchMock.mockResolvedValueOnce({
      ok: true,
      status: 200,
      json: async () => ({
        reply: 'Short tutor reply',
        correction: 'He goes to school.',
        safety: { blocked: false, reason: null },
      }),
    });

    const response = await askAiTutor({
      userMessage: 'he go to school',
      scenario: 'free',
      langCode: 'en-US',
      history: [{ role: 'user', text: 'hi' }],
    });

    expect(fetchMock).toHaveBeenCalledTimes(1);
    const [url, init] = fetchMock.mock.calls[0];
    expect(String(url)).toBe(`${API_BASE_URL}/ai/tutor/reply`);
    expect((init as RequestInit).method).toBe('POST');

    const body = JSON.parse(String((init as RequestInit).body));
    expect(body.userMessage).toBe('he go to school');
    expect(body.scenario).toBe('daily');
    expect(body.scenarioRaw).toBe('free');
    expect(body.message).toBe('he go to school');
    expect(body.langCode).toBe('en-US');

    expect(response.reply).toBe('Short tutor reply');
    expect(response.correction).toBe('He goes to school.');
    expect(response.safety.blocked).toBe(false);
  });
});
