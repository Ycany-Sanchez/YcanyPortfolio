/** Shared contact-form contract. Only handleContact performs server-side work. */
export const projectTypes = [
  'Backend & APIs',
  'AI integration',
  'Workflow automation',
  'Something else',
] as const;

export const timelineOptions = [
  'Exploring possibilities',
  'Within a month',
  '1–3 months',
  'Flexible',
] as const;

export const budgetOptions = [
  'Prefer to discuss',
  'Under $500',
  '$500–$1,500',
  '$1,500–$5,000',
  '$5,000+',
] as const;

export interface ContactPayload {
  name: string;
  email: string;
  projectType: (typeof projectTypes)[number];
  goals: string;
  budget?: (typeof budgetOptions)[number];
  timeline: (typeof timelineOptions)[number];
  website: string;
  startedAt: number;
  submissionId: string;
}

export type ContactFieldErrors = Partial<Record<keyof ContactPayload, string>>;

export interface ContactResponse {
  message: string;
  fieldErrors?: ContactFieldErrors;
}

export type ContactValidation =
  | { ok: true; data: ContactPayload }
  | { ok: false; fieldErrors: ContactFieldErrors; status: 400 | 429 };

const MAX_BODY_BYTES = 16 * 1024;
const MIN_FILL_TIME_MS = 3_000;
const MAX_FORM_AGE_MS = 24 * 60 * 60 * 1_000;
const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const UUID_PATTERN = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-8][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;

export function validateContact(value: unknown, now = Date.now()): ContactValidation {
  if (!value || typeof value !== 'object' || Array.isArray(value)) {
    return { ok: false, status: 400, fieldErrors: { goals: 'Please complete the project brief.' } };
  }

  const input = value as Record<string, unknown>;
  const errors: ContactFieldErrors = {};
  const name = typeof input.name === 'string' ? input.name.trim() : '';
  const email = typeof input.email === 'string' ? input.email.trim() : '';
  const goals = typeof input.goals === 'string' ? input.goals.trim() : '';
  const website = typeof input.website === 'string' ? input.website.trim() : '';
  const budget = input.budget === undefined || input.budget === '' ? undefined : input.budget;

  if (name.length < 2 || name.length > 100 || /[\r\n]/.test(name)) {
    errors.name = 'Enter a name between 2 and 100 characters.';
  }
  if (email.length > 254 || !EMAIL_PATTERN.test(email)) {
    errors.email = 'Enter a valid email address.';
  }
  if (!projectTypes.includes(input.projectType as ContactPayload['projectType'])) {
    errors.projectType = 'Choose the kind of project you have in mind.';
  }
  if (goals.length < 20 || goals.length > 5_000) {
    errors.goals = 'Tell me about your project in 20 to 5,000 characters.';
  }
  if (budget !== undefined && !budgetOptions.includes(budget as NonNullable<ContactPayload['budget']>)) {
    errors.budget = 'Choose a budget range or leave it open for discussion.';
  }
  if (!timelineOptions.includes(input.timeline as ContactPayload['timeline'])) {
    errors.timeline = 'Choose an approximate timeline.';
  }
  if (website || (input.website !== undefined && typeof input.website !== 'string')) {
    errors.website = 'The project brief could not be accepted.';
  }
  if (typeof input.submissionId !== 'string' || !UUID_PATTERN.test(input.submissionId)) {
    errors.submissionId = 'Refresh the page and try again.';
  }

  let tooFast = false;
  if (typeof input.startedAt !== 'number' || !Number.isFinite(input.startedAt)) {
    errors.startedAt = 'Refresh the page before submitting your brief.';
  } else {
    const elapsed = now - input.startedAt;
    if (elapsed < 0 || elapsed > MAX_FORM_AGE_MS) {
      errors.startedAt = 'This form has expired. Refresh the page and try again.';
    } else if (elapsed < MIN_FILL_TIME_MS) {
      errors.startedAt = 'Please take a moment to review your brief, then try again.';
      tooFast = true;
    }
  }

  if (Object.keys(errors).length) {
    return { ok: false, fieldErrors: errors, status: tooFast ? 429 : 400 };
  }

  return {
    ok: true,
    data: {
      name,
      email,
      projectType: input.projectType as ContactPayload['projectType'],
      goals,
      budget: budget as ContactPayload['budget'],
      timeline: input.timeline as ContactPayload['timeline'],
      website,
      startedAt: input.startedAt as number,
      submissionId: input.submissionId as string,
    },
  };
}

export interface ContactDependencies {
  env?: Record<string, string | undefined>;
  fetch?: typeof globalThis.fetch;
  now?: () => number;
  timeoutMs?: number;
}

function json(status: number, body: ContactResponse, extraHeaders?: Record<string, string>): Response {
  return new Response(JSON.stringify(body), {
    status,
    headers: {
      'Content-Type': 'application/json; charset=utf-8',
      'Cache-Control': 'no-store',
      'X-Content-Type-Options': 'nosniff',
      ...extraHeaders,
    },
  });
}

async function readJson(request: Request): Promise<unknown> {
  const declaredLength = request.headers.get('content-length');
  if (declaredLength && Number(declaredLength) > MAX_BODY_BYTES) {
    throw new RangeError('Request is too large');
  }
  if (!request.body) throw new SyntaxError('Request body is missing');

  const reader = request.body.getReader();
  const chunks: Uint8Array[] = [];
  let length = 0;
  try {
    while (true) {
      const { done, value } = await reader.read();
      if (done) break;
      length += value.byteLength;
      if (length > MAX_BODY_BYTES) {
        await reader.cancel();
        throw new RangeError('Request is too large');
      }
      chunks.push(value);
    }
  } finally {
    reader.releaseLock();
  }

  const bytes = new Uint8Array(length);
  let offset = 0;
  for (const chunk of chunks) {
    bytes.set(chunk, offset);
    offset += chunk.byteLength;
  }
  return JSON.parse(new TextDecoder('utf-8', { fatal: true }).decode(bytes));
}

/** Dependency injection keeps tests offline: no real messages are sent by the suite. */
export async function handleContact(request: Request, dependencies: ContactDependencies = {}): Promise<Response> {
  const env = dependencies.env ?? process.env;
  const fetchEmail = dependencies.fetch ?? globalThis.fetch;
  const now = dependencies.now ?? Date.now;

  const origin = request.headers.get('origin');
  const allowedOrigins = new Set([new URL(request.url).origin]);
  if (env.SITE_URL) {
    try {
      allowedOrigins.add(new URL(env.SITE_URL).origin);
    } catch {
      return json(503, { message: 'The inquiry form is unavailable. Please email me directly.' });
    }
  }
  if (origin && !allowedOrigins.has(origin)) {
    return json(403, { message: 'Please send your brief from this website.' });
  }
  if (request.headers.get('content-type')?.split(';')[0].trim().toLowerCase() !== 'application/json') {
    return json(415, { message: 'Please submit the project brief using the form.' });
  }

  let value: unknown;
  try {
    value = await readJson(request);
  } catch (error) {
    if (error instanceof RangeError) {
      return json(413, { message: 'The brief is too long. Please keep it under 16 KB.' });
    }
    return json(400, { message: 'The brief could not be read. Please try again.' });
  }

  const validation = validateContact(value, now());
  if (!validation.ok) {
    return json(validation.status, {
      message: validation.status === 429 ? 'Please review your brief and try again in a moment.' : 'Please check the highlighted fields.',
      fieldErrors: validation.fieldErrors,
    }, validation.status === 429 ? { 'Retry-After': '3' } : undefined);
  }

  const apiKey = env.RESEND_API_KEY?.trim();
  const from = env.CONTACT_FROM_EMAIL?.trim();
  const recipient = env.CONTACT_TO_EMAIL?.trim() || 'ycanyashra.sanchez2006@gmail.com';
  if (!apiKey || !from || /[\r\n]/.test(from) || !EMAIL_PATTERN.test(recipient) || recipient.length > 254) {
    return json(503, { message: 'The inquiry form is unavailable right now. Please email me directly; your brief has not been sent.' });
  }

  const brief = validation.data;
  const text = [
    'New portfolio project inquiry',
    '',
    `Name: ${brief.name}`,
    `Email: ${brief.email}`,
    `Project type: ${brief.projectType}`,
    `Budget: ${brief.budget ?? 'Prefer to discuss'}`,
    `Timeline: ${brief.timeline}`,
    '',
    'Project goals:',
    brief.goals,
  ].join('\n');

  try {
    const response = await fetchEmail('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
        'Idempotency-Key': `portfolio-inquiry-${brief.submissionId.toLowerCase()}`,
      },
      body: JSON.stringify({
        from,
        to: [recipient],
        reply_to: brief.email,
        subject: `Portfolio inquiry: ${brief.projectType}`,
        text,
      }),
      signal: AbortSignal.timeout(dependencies.timeoutMs ?? 8_000),
      cache: 'no-store',
    });
    if (!response.ok) throw new Error('Email provider rejected the request');
    const result: unknown = await response.json();
    if (!result || typeof result !== 'object' || !('id' in result) || typeof result.id !== 'string' || !result.id.trim()) {
      throw new Error('Email provider did not confirm acceptance');
    }
    return json(200, { message: 'Your project brief has been sent. Thank you for getting in touch.' });
  } catch {
    return json(502, { message: 'Your brief could not be confirmed as sent. Please try again or email me directly.' });
  }
}
