import assert from 'node:assert/strict';
import { randomUUID } from 'node:crypto';
import { test } from 'node:test';
import { handleContact, validateContact, type ContactDependencies } from '../lib/contact.ts';

const now = 1_800_000_000_000;
const configuredEnv = {
  RESEND_API_KEY: 'test-placeholder-only',
  CONTACT_FROM_EMAIL: 'Portfolio <inquiries@example.com>',
};

function payload(overrides: Record<string, unknown> = {}) {
  return {
    name: 'Prospective Client',
    email: 'client@example.com',
    projectType: 'Backend & APIs',
    goals: 'Connect our scheduling system to our existing customer database.',
    budget: 'Prefer to discuss',
    timeline: '1–3 months',
    website: '',
    startedAt: now - 10_000,
    submissionId: randomUUID(),
    ...overrides,
  };
}

function request(value: unknown = payload(), headers: Record<string, string> = {}) {
  return new Request('https://portfolio.example/api/contact', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', Origin: 'https://portfolio.example', ...headers },
    body: JSON.stringify(value),
  });
}

function dependencies(overrides: ContactDependencies = {}): ContactDependencies {
  return {
    env: configuredEnv,
    now: () => now,
    fetch: async () => { throw new Error('Unexpected email request in test'); },
    ...overrides,
  };
}

test('validates and normalizes a complete inquiry, including optional budget', () => {
  const result = validateContact(payload({ name: '  Client Name  ', email: ' client@example.com ', budget: '' }), now);
  assert.equal(result.ok, true);
  if (result.ok) {
    assert.equal(result.data.name, 'Client Name');
    assert.equal(result.data.email, 'client@example.com');
    assert.equal(result.data.budget, undefined);
  }
});

test('rejects invalid fields, forged options, and filled honeypots', () => {
  const result = validateContact(payload({ name: 'A', email: 'bad-address', goals: 'short', projectType: 'Forged', budget: 'Free', timeline: 'Yesterday', website: 'spam.example' }), now);
  assert.equal(result.ok, false);
  if (!result.ok) {
    for (const field of ['name', 'email', 'goals', 'projectType', 'budget', 'timeline', 'website']) {
      assert.ok(result.fieldErrors[field as keyof typeof result.fieldErrors]);
    }
  }
});

test('rejects oversize field values, header-like email, invalid ID, and non-object input', () => {
  for (const value of [null, [], 'hello', payload({ name: 'n'.repeat(101) }), payload({ goals: 'g'.repeat(5_001) }), payload({ email: 'client@example.com\r\nBcc:evil@example.com' }), payload({ submissionId: 'not-a-uuid' })]) {
    assert.equal(validateContact(value, now).ok, false);
  }
});

test('rejects future or expired forms and throttles implausibly fast submissions', async () => {
  for (const startedAt of [now + 1, now - 86_400_001, 'invalid']) {
    const response = await handleContact(request(payload({ startedAt })), dependencies());
    assert.equal(response.status, 400);
  }
  const response = await handleContact(request(payload({ startedAt: now - 500 })), dependencies());
  assert.equal(response.status, 429);
  assert.equal(response.headers.get('Retry-After'), '3');
});

test('reports unavailable configuration without claiming success or calling the provider', async () => {
  const response = await handleContact(request(), dependencies({ env: {} }));
  assert.equal(response.status, 503);
  assert.match((await response.json()).message, /not been sent/);
});

test('requires JSON and rejects mismatched origins', async () => {
  assert.equal((await handleContact(request(payload(), { 'Content-Type': 'text/plain' }), dependencies())).status, 415);
  assert.equal((await handleContact(request(payload(), { Origin: 'https://untrusted.example' }), dependencies())).status, 403);
  assert.equal((await handleContact(request(payload(), { Origin: 'null' }), dependencies())).status, 403);
});

test('accepts the configured canonical origin behind a proxy but never arbitrary origins', async () => {
  const response = await handleContact(request(payload(), { Origin: 'https://canonical.example' }), dependencies({ env: { SITE_URL: 'https://canonical.example' } }));
  assert.equal(response.status, 503);
  const invalidConfig = await handleContact(request(), dependencies({ env: { SITE_URL: 'not-a-url' } }));
  assert.equal(invalidConfig.status, 503);
});

test('rejects malformed JSON and bodies over 16KB, with and without content-length', async () => {
  const malformed = new Request('https://portfolio.example/api/contact', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: '{' });
  assert.equal((await handleContact(malformed, dependencies())).status, 400);
  const huge = payload({ goals: 'x'.repeat(17_000) });
  assert.equal((await handleContact(request(huge), dependencies())).status, 413);
  assert.equal((await handleContact(request(payload(), { 'Content-Length': '17000' }), dependencies())).status, 413);
});

test('checks streamed bytes rather than trusting a short content-length header', async () => {
  const stream = new ReadableStream({
    start(controller) {
      controller.enqueue(new TextEncoder().encode('{"goals":"'));
      controller.enqueue(new TextEncoder().encode('x'.repeat(17_000)));
      controller.close();
    },
  });
  const streamed = new Request('https://portfolio.example/api/contact', {
    method: 'POST', headers: { 'Content-Type': 'application/json', 'Content-Length': '10' }, body: stream,
    duplex: 'half',
  } as RequestInit);
  assert.equal((await handleContact(streamed, dependencies())).status, 413);
});

test('sends a plain-text inquiry with reply-to and a stable idempotency key', async () => {
  const inquiry = payload({ goals: 'Please connect our systems. <script>This remains literal text.</script>' });
  const sent: { url: string; headers: Headers; body: Record<string, unknown> }[] = [];
  const mockFetch: typeof fetch = async (input, init) => {
    sent.push({ url: String(input), headers: new Headers(init?.headers), body: JSON.parse(init?.body as string) });
    return Response.json({ id: 'provider-confirmed-id' });
  };
  for (let attempt = 0; attempt < 2; attempt++) {
    const response = await handleContact(request(inquiry), dependencies({ fetch: mockFetch }));
    assert.equal(response.status, 200);
    assert.match((await response.json()).message, /has been sent/);
    assert.equal(response.headers.get('Cache-Control'), 'no-store');
  }
  assert.equal(sent[0].url, 'https://api.resend.com/emails');
  assert.equal(sent[0].headers.get('Idempotency-Key'), sent[1].headers.get('Idempotency-Key'));
  assert.match(sent[0].headers.get('Idempotency-Key') ?? '', new RegExp(inquiry.submissionId));
  assert.deepEqual(sent[0].body.to, ['ycanyashra.sanchez2006@gmail.com']);
  assert.equal(sent[0].body.reply_to, 'client@example.com');
  assert.match(String(sent[0].body.text), /<script>/);
  assert.equal('html' in sent[0].body, false);
});

test('provider rejection, missing confirmation, invalid JSON and network errors never report success', async () => {
  const responses = [
    async () => Response.json({ message: 'Provider error' }, { status: 422 }),
    async () => Response.json({}),
    async () => new Response('not-json'),
    async () => { throw new Error('Network unavailable'); },
  ];
  for (const mockFetch of responses) {
    const response = await handleContact(request(), dependencies({ fetch: mockFetch }));
    assert.equal(response.status, 502);
    assert.match((await response.json()).message, /could not be confirmed/);
  }
});

test('times out slow provider requests without exposing provider details', async () => {
  const mockFetch: typeof fetch = async (_input, init) => new Promise((_resolve, reject) => {
    init?.signal?.addEventListener('abort', () => reject(new Error('Secret provider detail')), { once: true });
  });
  // Keep the test alive while AbortSignal.timeout uses an unref'ed timer.
  const keepAlive = setTimeout(() => {}, 1_000);
  try {
    const response = await handleContact(request(), dependencies({ fetch: mockFetch, timeoutMs: 10 }));
    assert.equal(response.status, 502);
    assert.doesNotMatch(await response.text(), /Secret provider detail/);
  } finally {
    clearTimeout(keepAlive);
  }
});
