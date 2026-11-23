'use client';

import { useState, type FormEvent } from 'react';
import { buildContactFormPayload } from '@/lib/contactForm';

type Status = 'idle' | 'sending' | 'sent' | 'failed';

const FIELD =
  'mt-1.5 w-full rounded-xl border border-sch-border-input bg-sch-surface px-4 py-3 text-base text-sch-text placeholder:text-sch-muted/70';

export default function SchoolContactForm() {
  const [status, setStatus] = useState<Status>('idle');
  const [error, setError] = useState('');

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (status === 'sending') return;
    const form = event.currentTarget;
    const data = new FormData(form);
    const name = String(data.get('name') || '').trim();
    const email = String(data.get('email') || '').trim();
    const phone = String(data.get('phone') || '').trim();
    const subject = String(data.get('subject') || '').trim();
    const message = String(data.get('message') || '').trim();

    const [firstName, ...rest] = name.split(/\s+/);
    // The existing contact endpoint has no subject or phone field, so both travel in the message body.
    const messageBody = [subject && `Subject: ${subject}`, phone && `Phone: ${phone}`, message].filter(Boolean).join('\n\n');

    setStatus('sending');
    setError('');
    try {
      const response = await fetch('/api/proxy/contact-form-email', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(
          buildContactFormPayload({
            firstName: firstName || name,
            lastName: rest.join(' ') || 'N/A',
            messageBody,
            senderEmail: email,
          })
        ),
      });
      if (!response.ok) throw new Error(`Request failed (${response.status})`);
      form.reset();
      setStatus('sent');
    } catch (cause) {
      console.error('[school contact]', cause);
      setError('Your message could not be sent. Please try again, or phone the school office.');
      setStatus('failed');
    }
  }

  if (status === 'sent') {
    return (
      <div role="status" className="mt-6 rounded-xl border border-sch-success/40 bg-sch-success/10 p-5">
        <p className="font-semibold text-sch-success">Thank you. Your message has been sent.</p>
        <p className="mt-1 text-sm text-sch-muted">The school office will reply to the email address you gave.</p>
        <button type="button" onClick={() => setStatus('idle')} className="mt-4 text-sm font-semibold text-sch-accent underline underline-offset-4">
          Send another message
        </button>
      </div>
    );
  }

  return (
    <form onSubmit={submit} className="mt-6 grid gap-5 sm:grid-cols-2">
      <label className="block text-sm font-semibold">
        Full name
        <input name="name" type="text" required autoComplete="name" className={FIELD} />
      </label>
      <label className="block text-sm font-semibold">
        Email
        <input name="email" type="email" required autoComplete="email" className={FIELD} />
      </label>
      <label className="block text-sm font-semibold">
        Phone <span className="font-normal text-sch-muted">(optional)</span>
        <input name="phone" type="tel" autoComplete="tel" className={FIELD} />
      </label>
      <label className="block text-sm font-semibold">
        Subject
        <input name="subject" type="text" required className={FIELD} />
      </label>
      <label className="block text-sm font-semibold sm:col-span-2">
        Message
        <textarea name="message" required rows={6} className={FIELD} />
      </label>
      <div className="sm:col-span-2">
        {status === 'failed' && (
          <p role="alert" className="mb-4 text-sm font-semibold text-sch-danger">
            {error}
          </p>
        )}
        <button
          type="submit"
          disabled={status === 'sending'}
          className="inline-flex min-h-[48px] items-center justify-center rounded-full bg-sch-accent px-8 text-sm font-semibold text-sch-on-accent transition-colors hover:bg-sch-accent-strong disabled:opacity-60"
        >
          {status === 'sending' ? 'Sending…' : 'Send message'}
        </button>
      </div>
    </form>
  );
}
