'use client';

import { useAuth, useClerk, useUser } from '@clerk/nextjs';
import { useCallback, useEffect, useState } from 'react';
import { isPrimaryHostname, isSatelliteHostname } from '@/lib/clerkSatellite';

type UseHeaderAuthOptions = {
  logPrefix?: string;
};

export function useHeaderAuth({ logPrefix = '[HeaderAuth]' }: UseHeaderAuthOptions = {}) {
  const { userId, isLoaded } = useAuth();
  const { user } = useUser();
  const { signOut } = useClerk();
  const [isSigningOut, setIsSigningOut] = useState(false);
  const [pendingSignOut, setPendingSignOut] = useState(false);

  useEffect(() => {
    if (typeof window === 'undefined') return;

    const urlParams = new URLSearchParams(window.location.search);
    const clerkSignedOut = urlParams.get('clerk_signout');

    if (clerkSignedOut === 'true') {
      setPendingSignOut(true);
      urlParams.delete('clerk_signout');
      const newUrl = window.location.pathname + (urlParams.toString() ? `?${urlParams.toString()}` : '');
      window.history.replaceState({}, '', newUrl);
    }
  }, []);

  useEffect(() => {
    if (!pendingSignOut || !isLoaded) return;

    const performSignOut = async () => {
      try {
        await signOut();
      } catch (error) {
        console.error(`${logPrefix} signOut() error on satellite:`, error);
      }

      Object.keys(localStorage).forEach((key) => {
        if (key.includes('clerk') || key.includes('__clerk')) {
          localStorage.removeItem(key);
        }
      });

      setPendingSignOut(false);
      window.location.replace(window.location.pathname);
    };

    performSignOut();
  }, [pendingSignOut, isLoaded, signOut, logPrefix]);

  const handleSignOut = useCallback(async () => {
    setIsSigningOut(true);
    localStorage.setItem('clerk_signout_broadcast', Date.now().toString());

    const hostname = typeof window !== 'undefined' ? window.location.hostname : '';
    const primaryDomain = process.env.NEXT_PUBLIC_PRIMARY_DOMAIN || 'www.adwiiseagent.ai';
    const primaryHost = primaryDomain.replace(/^https?:\/\//, '').replace(/\/$/, '');

    if (isPrimaryHostname(hostname)) {
      try {
        await signOut();
        window.location.href = '/';
      } catch (error) {
        console.error(`${logPrefix} Error signing out:`, error);
        setIsSigningOut(false);
      }
      return;
    }

    if (isSatelliteHostname(hostname)) {
      const primarySignOutUrl = `https://${primaryHost}/auth/signout-redirect`;
      const returnUrl = encodeURIComponent(window.location.origin);
      window.location.href = `${primarySignOutUrl}?redirect_url=${returnUrl}`;
      return;
    }

    try {
      await signOut();
      window.location.href = '/';
    } catch (error) {
      console.error(`${logPrefix} Error signing out:`, error);
      setIsSigningOut(false);
    }
  }, [signOut, logPrefix]);

  return {
    userId,
    isLoaded,
    user,
    isSigningOut,
    handleSignOut,
  };
}
