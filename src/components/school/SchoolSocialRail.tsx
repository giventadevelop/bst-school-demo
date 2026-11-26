'use client';

import { useState } from 'react';
import { useTenantSettings } from '@/components/TenantSettingsProvider';

type SocialItem = {
  id: string;
  label: string;
  href: string;
  external: boolean;
  className: string;
};

function clean(value?: string | null) {
  const trimmed = value?.trim() ?? '';
  return trimmed.length > 0 ? trimmed : '';
}

function whatsappHref(value: string) {
  if (/^https?:\/\//i.test(value)) return value;
  const digits = value.replace(/\D/g, '');
  return digits ? `https://api.whatsapp.com/send?phone=${digits}` : '';
}

function telHref(value: string) {
  if (value.toLowerCase().startsWith('tel:')) return value;
  return `tel:${value.replace(/\s/g, '')}`;
}

function Icon({ id }: { id: string }) {
  if (id === 'whatsapp') {
    return (
      <svg viewBox="0 0 24 24" aria-hidden>
        <path fill="currentColor" d="M20.5 3.5A11 11 0 0 0 2.1 17.2L1 23l5.9-1.1A11 11 0 0 0 20.5 3.5zm-8.5 17a9.1 9.1 0 0 1-4.6-1.3l-.3-.2-3.5.7.7-3.4-.2-.3A9.1 9.1 0 1 1 12 20.5zm5-6.8c-.3-.1-1.6-.8-1.8-.9s-.4-.1-.6.1-.7.9-.8 1-.3.2-.6.1a7.4 7.4 0 0 1-2.2-1.4 8.2 8.2 0 0 1-1.5-1.9c-.2-.3 0-.4.1-.6l.4-.5.2-.3a.5.5 0 0 0 0-.5c0-.1-.6-1.4-.8-1.9s-.4-.4-.6-.4h-.5a1 1 0 0 0-.7.3 3 3 0 0 0-.9 2.2 5.2 5.2 0 0 0 1.1 2.8 11.9 11.9 0 0 0 4.5 4 4.2 4.2 0 0 0 3.1.2 2.6 2.6 0 0 0 1.7-1.2 2.1 2.1 0 0 0 .1-1.2c-.1-.1-.3-.2-.6-.3z" />
      </svg>
    );
  }
  if (id === 'facebook') {
    return (
      <svg viewBox="0 0 24 24" aria-hidden>
        <path fill="currentColor" d="M14.5 8.5V6.8c0-.7.5-1 1.2-1H17V3h-2.1C12.2 3 11 4.4 11 6.6v1.9H9v2.8h2V21h3.5v-9.7h2.3l.4-2.8h-2.7z" />
      </svg>
    );
  }
  if (id === 'phone') {
    return (
      <svg viewBox="0 0 24 24" aria-hidden>
        <path fill="currentColor" d="M6.6 3.8c.3-.3.8-.4 1.2-.2l2.2 1c.4.2.6.6.6 1.1l-.3 2.2a1 1 0 0 1-.6.7l-1.3.5a12.4 12.4 0 0 0 5.9 5.9l.5-1.3c.1-.4.4-.6.7-.6l2.2-.3c.5 0 .9.2 1.1.6l1 2.2c.2.4.1.9-.2 1.2l-1.5 1.5c-.3.3-.8.5-1.2.4C10.7 18.8 5.2 13.3 4.1 6.5c-.1-.4.1-.9.4-1.2l2.1-1.5z" />
      </svg>
    );
  }
  if (id === 'instagram') {
    return (
      <svg viewBox="0 0 24 24" aria-hidden>
        <path fill="currentColor" d="M8 3h8a5 5 0 0 1 5 5v8a5 5 0 0 1-5 5H8a5 5 0 0 1-5-5V8a5 5 0 0 1 5-5zm8 2H8a3 3 0 0 0-3 3v8a3 3 0 0 0 3 3h8a3 3 0 0 0 3-3V8a3 3 0 0 0-3-3zm-4 3.2A3.8 3.8 0 1 1 8.2 12 3.8 3.8 0 0 1 12 8.2zm0 2A1.8 1.8 0 1 0 13.8 12 1.8 1.8 0 0 0 12 10.2zM17.2 6.8a1 1 0 1 1-1 1 1 1 0 0 1 1-1z" />
      </svg>
    );
  }
  if (id === 'youtube') {
    return (
      <svg viewBox="0 0 24 24" aria-hidden>
        <path fill="currentColor" d="M23 12.2s0-3.2-.4-4.6a3 3 0 0 0-2.1-2.1C18.9 5 12 5 12 5s-6.9 0-8.5.5a3 3 0 0 0-2.1 2.1C1 9 1 12.2 1 12.2s0 3.2.4 4.6a3 3 0 0 0 2.1 2.1C5.1 19 12 19 12 19s6.9 0 8.5-.5a3 3 0 0 0 2.1-2.1c.4-1.4.4-4.6.4-4.6zM9.8 15.5v-6.6l6.2 3.3z" />
      </svg>
    );
  }
  return (
    <svg viewBox="0 0 24 24" aria-hidden>
      <path fill="currentColor" d="M14 4h6v6h-2V7.4l-7.3 7.3-1.4-1.4L16.6 6H14V4zM6 6h5v2H8v8h8v-3h2v5H6V6z" />
    </svg>
  );
}

/** Left-edge social bar. Icons appear only when tenant settings has a value. */
export default function SchoolSocialRail() {
  const { settings, loading } = useTenantSettings();
  const [open, setOpen] = useState(true);

  if (loading && !settings) return null;

  const whatsapp = whatsappHref(clean(settings?.whatsappUrl));
  const facebook = clean(settings?.facebookUrl);
  const phone = clean(settings?.phoneNumber);
  const instagram = clean(settings?.instagramUrl);
  const youtube = clean(settings?.youtubeUrl);
  const twitter = clean(settings?.twitterUrl);
  const linkedin = clean(settings?.linkedinUrl);
  const tiktok = clean(settings?.tiktokUrl);

  const items: SocialItem[] = [
    whatsapp && { id: 'whatsapp', label: 'WhatsApp', href: whatsapp, external: true, className: 'is-whatsapp' },
    facebook && { id: 'facebook', label: 'Facebook', href: facebook, external: true, className: 'is-facebook' },
    phone && { id: 'phone', label: 'Phone', href: telHref(phone), external: false, className: 'is-phone' },
    instagram && { id: 'instagram', label: 'Instagram', href: instagram, external: true, className: 'is-instagram' },
    youtube && { id: 'youtube', label: 'YouTube', href: youtube, external: true, className: 'is-youtube' },
    twitter && { id: 'twitter', label: 'X', href: twitter, external: true, className: 'is-twitter' },
    linkedin && { id: 'linkedin', label: 'LinkedIn', href: linkedin, external: true, className: 'is-linkedin' },
    tiktok && { id: 'tiktok', label: 'TikTok', href: tiktok, external: true, className: 'is-tiktok' },
  ].filter(Boolean) as SocialItem[];

  if (items.length === 0) return null;

  return (
    <div className={`school-social-rail${open ? '' : ' is-collapsed'}`}>
      <button
        type="button"
        className="school-social-rail-toggle"
        aria-expanded={open}
        aria-label={open ? 'Hide social links' : 'Show social links'}
        onClick={() => setOpen((value) => !value)}
      >
        {open ? '←' : '→'}
      </button>
      <ul>
        {items.map((item) => (
          <li key={item.id} className={item.className}>
            <a
              href={item.href}
              {...(item.external ? { target: '_blank', rel: 'noopener noreferrer' } : {})}
              aria-label={item.label}
            >
              <span className="school-social-rail-icon">
                <Icon id={item.id} />
              </span>
              <span className="school-social-rail-label">{item.label}</span>
            </a>
          </li>
        ))}
      </ul>
    </div>
  );
}
