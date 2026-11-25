'use client';

import { useState, type FormEvent } from 'react';
import { buildContactFormPayload } from '@/lib/contactForm';

type Status = 'idle' | 'sending' | 'sent' | 'failed';

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
      <div role="status" className="panel c-green mt-6">
        <p className="h5">Thank you. Your message has been sent.</p>
        <p className="body mt-2">The school office will reply to the email address you gave.</p>
        <button type="button" onClick={() => setStatus('idle')} className="btn btn-text mt-4">
          Send another message
        </button>
      </div>
    );
  }

  return (
    <form onSubmit={submit} className="mt-6 grid gap-5 sm:grid-cols-2">
      <div className="field">
        <label htmlFor="contact-name">Full name</label>
        <input id="contact-name" name="name" type="text" required autoComplete="name" className="input" />
      </div>
      <div className="field">
        <label htmlFor="contact-email">Email</label>
        <input id="contact-email" name="email" type="email" required autoComplete="email" className="input" />
      </div>
      <div className="field">
        <label htmlFor="contact-phone">
          Phone <span className="muted font-normal">(optional)</span>
        </label>
        <input id="contact-phone" name="phone" type="tel" autoComplete="tel" className="input" />
      </div>
      <div className="field">
        <label htmlFor="contact-subject">Subject</label>
        <input id="contact-subject" name="subject" type="text" required className="input" />
      </div>
      <div className="field sm:col-span-2">
        <label htmlFor="contact-message">Message</label>
        <textarea id="contact-message" name="message" required rows={6} className="input" />
      </div>
      <div className="sm:col-span-2">
        {status === 'failed' && (
          <p role="alert" className="err mb-4">
            {error}
          </p>
        )}
        <button
          type="submit"
          disabled={status === 'sending'}
          className="btn btn-primary"
        >
          {status === 'sending' ? 'Sending…' : 'Send message'}
        </button>
      </div>
    </form>
  );
}
