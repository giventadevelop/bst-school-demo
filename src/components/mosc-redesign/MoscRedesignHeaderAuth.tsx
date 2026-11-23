'use client';

import Image from 'next/image';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { LogOut, User } from 'lucide-react';
import { useEffect, useRef, useState } from 'react';
import { useHeaderAuth } from '@/components/header/useHeaderAuth';

const DESKTOP_DROPDOWN_PANEL =
  'mosc-header-dropdown-panel absolute top-full right-0 mt-2 min-w-[16rem] rounded-lg border border-white/20 bg-burgundy-dark shadow-[0_12px_40px_rgba(0,0,0,0.45)] z-50 max-h-[70vh] overflow-y-auto';

const DESKTOP_SUBMENU_LINK =
  'block py-2.5 pl-4 pr-4 text-[13px] font-medium tracking-[0.02em] antialiased transition-all duration-200 no-underline visited:no-underline';
const DESKTOP_SUBMENU_IDLE =
  'text-parchment-light/95 visited:text-parchment-light/95 hover:text-white hover:bg-white/10';
const DESKTOP_SUBMENU_ACTIVE =
  'text-white visited:text-white font-semibold bg-white/20 border-l-[3px] border-warmGold-light';

function MoscUserAvatarDropdown({
  user,
  onSignOut,
  isSigningOut,
}: {
  user: ReturnType<typeof useHeaderAuth>['user'];
  onSignOut: () => void;
  isSigningOut: boolean;
}) {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const pathname = usePathname();

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    if (isOpen) document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [isOpen]);

  const userImageUrl = user?.imageUrl || user?.hasImage ? user?.imageUrl : null;
  const userName =
    user?.firstName || user?.fullName || user?.emailAddresses?.[0]?.emailAddress || 'User';
  const userEmail = user?.emailAddresses?.[0]?.emailAddress || '';

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="flex h-10 w-10 min-h-[40px] min-w-[40px] items-center justify-center overflow-hidden rounded-full border-2 border-burgundy/30 bg-parchment-light hover:border-burgundy focus:outline-none focus:ring-2 focus:ring-burgundy/40 focus:ring-offset-2 transition-all duration-200 hover:scale-105"
        aria-label="User menu"
        aria-expanded={isOpen}
        aria-haspopup="true"
      >
        {userImageUrl ? (
          <Image
            src={userImageUrl}
            alt={userName}
            width={40}
            height={40}
            className="h-full w-full rounded-full object-cover"
            unoptimized
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center rounded-full bg-gradient-to-br from-burgundy to-warmBrown text-white">
            <User size={18} className="text-white" aria-hidden />
          </div>
        )}
      </button>

      {isOpen && (
        <div className={`${DESKTOP_DROPDOWN_PANEL} w-72`} role="menu" aria-label="User menu">
          <div className="border-b border-white/15 px-4 py-4">
            <div className="flex items-center gap-3">
              {userImageUrl ? (
                <Image
                  src={userImageUrl}
                  alt={userName}
                  width={48}
                  height={48}
                  className="h-12 w-12 shrink-0 rounded-full object-cover ring-2 ring-white/30"
                  unoptimized
                />
              ) : (
                <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-burgundy to-warmBrown text-white">
                  <User size={22} className="text-white" aria-hidden />
                </div>
              )}
              <div className="min-w-0 flex-1">
                <p className="truncate text-sm font-semibold text-white">{userName}</p>
                {userEmail && (
                  <p className="mt-0.5 truncate text-xs text-parchment-light/80">{userEmail}</p>
                )}
              </div>
            </div>
          </div>
          <div className="py-2">
            <Link
              href="/profile"
              onClick={() => setIsOpen(false)}
              className={`${DESKTOP_SUBMENU_LINK} flex items-center gap-2 ${
                pathname === '/profile' ? DESKTOP_SUBMENU_ACTIVE : DESKTOP_SUBMENU_IDLE
              }`}
              role="menuitem"
            >
              <User size={16} aria-hidden />
              <span>Profile</span>
            </Link>
            <button
              type="button"
              onClick={() => {
                setIsOpen(false);
                onSignOut();
              }}
              disabled={isSigningOut}
              className={`${DESKTOP_SUBMENU_LINK} flex w-full items-center gap-2 text-left ${
                isSigningOut
                  ? 'cursor-not-allowed text-parchment-light/50'
                  : 'text-rose-200 hover:bg-rose-500/20 hover:text-white'
              }`}
              role="menuitem"
            >
              <LogOut size={16} aria-hidden />
              <span>{isSigningOut ? 'Signing Out...' : 'Sign Out'}</span>
            </button>
          </div>
        </div>
      )}
    </div>
  );
}


type MoscRedesignHeaderAuthProps = {
  layout: 'desktop' | 'mobile';
  onCloseMobileMenu?: () => void;
};

export default function MoscRedesignHeaderAuth({
  layout,
  onCloseMobileMenu,
}: MoscRedesignHeaderAuthProps) {
  const { userId, isLoaded, user, isSigningOut, handleSignOut } = useHeaderAuth({
    logPrefix: '[MoscRedesignHeaderAuth]',
  });

  if (!isLoaded) return null;

  if (layout === 'desktop') {
    if (!userId) {
      return (
        <div className="flex shrink-0 flex-nowrap items-center gap-2 sm:gap-3">
          <Link
            href="/sign-in"
            className="whitespace-nowrap text-sm font-semibold tracking-wide text-burgundy/90 visited:text-burgundy/90 no-underline transition-colors hover:text-burgundy"
          >
            Sign In
          </Link>
          <Link
            href="/sign-up"
            className="whitespace-nowrap rounded-md bg-burgundy px-3 py-1.5 text-sm font-semibold tracking-wide text-white no-underline shadow-sm transition-all duration-200 hover:bg-burgundy-dark hover:shadow-md"
          >
            Sign up
          </Link>
        </div>
      );
    }

    return (
      <div className="flex shrink-0 flex-nowrap items-center gap-2 sm:gap-3">
        <MoscUserAvatarDropdown user={user} onSignOut={handleSignOut} isSigningOut={isSigningOut} />
      </div>
    );
  }

  if (!userId) {
    return (
      <div className="mb-4 space-y-2 rounded-lg border border-burgundy/15 bg-parchment-light/80 p-3">
        <Link
          href="/sign-in"
          className="block w-full rounded-md py-2.5 px-4 text-center text-sm font-semibold text-burgundy-dark no-underline transition-colors hover:bg-burgundy/8"
          onClick={onCloseMobileMenu}
        >
          Sign In
        </Link>
        <Link
          href="/sign-up"
          className="block w-full rounded-md bg-burgundy py-2.5 px-4 text-center text-sm font-semibold text-white no-underline shadow-sm transition-colors hover:bg-burgundy-dark"
          onClick={onCloseMobileMenu}
        >
          Sign up
        </Link>
      </div>
    );
  }

  const userName =
    user?.firstName || user?.fullName || user?.emailAddresses?.[0]?.emailAddress || 'User';

  return (
    <div className="mb-4 border-b border-burgundy/15 pb-4">
      <div className="mb-3 flex items-center gap-3 rounded-lg border border-burgundy/10 bg-parchment-light/80 p-3">
        {user?.imageUrl ? (
          <Image
            src={user.imageUrl}
            alt={userName}
            width={48}
            height={48}
            className="h-12 w-12 shrink-0 rounded-full object-cover ring-2 ring-burgundy/30"
            unoptimized
          />
        ) : (
          <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-burgundy to-warmBrown text-white">
            <User size={22} aria-hidden />
          </div>
        )}
        <div className="min-w-0 flex-1">
          <p className="truncate text-sm font-semibold text-burgundy-dark">{userName}</p>
          {user?.emailAddresses?.[0]?.emailAddress && (
            <p className="mt-0.5 truncate text-xs text-burgundy/70">
              {user.emailAddresses[0].emailAddress}
            </p>
          )}
        </div>
      </div>

      <Link
        href="/profile"
        className="mb-2 flex items-center gap-2 rounded-md px-2.5 py-2.5 text-sm font-semibold text-burgundy-dark no-underline transition-colors hover:bg-burgundy/8"
        onClick={onCloseMobileMenu}
      >
        <User size={18} aria-hidden />
        <span>Profile</span>
      </Link>

      <button
        type="button"
        onClick={() => {
          onCloseMobileMenu?.();
          handleSignOut();
        }}
        disabled={isSigningOut}
        className={`flex w-full items-center justify-center gap-2 rounded-md border py-2.5 px-4 text-sm font-semibold transition-colors ${
          isSigningOut
            ? 'cursor-not-allowed border-burgundy/10 text-burgundy/40'
            : 'border-rose-200 text-rose-600 hover:border-rose-300 hover:bg-rose-50'
        }`}
      >
        <LogOut size={16} aria-hidden />
        <span>{isSigningOut ? 'Signing Out...' : 'Sign Out'}</span>
      </button>

    </div>
  );
}
