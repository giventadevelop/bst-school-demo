'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import type { EventMediaDTO, EventDetailsDTO, EventFeaturedPerformersDTO, EventContactsDTO, EventProgramDirectorsDTO, EventSponsorsJoinDTO } from '@/types';
import { formatInTimeZone } from 'date-fns-tz';
import { EventMediaSlideshow } from '@/app/gallery/components/EventMediaSlideshow';
import { SocialIconLink } from '@/components/social/SocialIconLink';
import { isDonationBasedEvent, isTicketedFundraiserEvent } from '@/lib/donation/utils';
import { resolveBuyTicketsTarget, resolveRegisterTarget } from '@/lib/eventcube/utils';
import EventCardResultsPanel from '@/components/competitions/EventCardResultsPanel';
import { Container, EmptyState, PageBanner, colourAt } from '@/components/school/ui';

function formatTime(time?: string) {
  if (!time) return '';
  const [hour, minute] = time.split(':');
  const date = new Date();
  date.setHours(Number(hour), Number(minute || 0));
  return date.toLocaleTimeString([], { hour: 'numeric', minute: '2-digit', hour12: true });
}

function formatDate(date?: string, timezone = 'America/New_York') {
  if (!date) return '';
  return formatInTimeZone(date, timezone, 'EEEE, MMMM d, yyyy');
}

function toGoogleCalendarDate(date: string, time: string) {
  const [year, month, day] = date.split('-');
  const [hour, minute] = (time || '00:00').split(':');
  return `${year}${month}${day}T${hour.padStart(2, '0')}${minute.padStart(2, '0')}00`;
}

export default function EventDetailPage() {

  const params = useParams();
  const eventId = params?.id;
  const [event, setEvent] = useState<EventDetailsDTO | null>(null);
  const [media, setMedia] = useState<EventMediaDTO[]>([]);
  const [featuredPerformers, setFeaturedPerformers] = useState<EventFeaturedPerformersDTO[]>([]);
  const [contacts, setContacts] = useState<EventContactsDTO[]>([]);
  const [programDirectors, setProgramDirectors] = useState<EventProgramDirectorsDTO[]>([]);
  const [sponsors, setSponsors] = useState<EventSponsorsJoinDTO[]>([]);
  const [sponsorBannerImages, setSponsorBannerImages] = useState<Map<number, string>>(new Map());
  const [loading, setLoading] = useState(true);
  const [showSlideshow, setShowSlideshow] = useState(false);
  const [slideshowInitialIndex, setSlideshowInitialIndex] = useState(0);
// Focus group filter and options for gallery
  const [eventFocusGroupIdFilter, setEventFocusGroupIdFilter] = useState<number | null>(null);
  const [eventFocusGroupOptions, setEventFocusGroupOptions] = useState<{ id: number; name: string }[]>([]);
  const [focusGroupNameByAssociationId, setFocusGroupNameByAssociationId] = useState<Record<number, string>>({});
  const [resultsOpen, setResultsOpen] = useState(false);
useEffect(() => {
    async function fetchEventDetails() {
      if (!eventId) return;
      setLoading(true);
      try {
        // Fetch event details
        const eventRes = await fetch(`/api/proxy/event-details/${eventId}`);
        const eventData: EventDetailsDTO = await eventRes.json();
        setEvent(eventData);

        // Fetch event focus groups and focus group names for filter/labels
        try {
          const efgRes = await fetch(`/api/proxy/event-focus-groups?eventId.equals=${eventId}`);
          const efgData = await efgRes.json();
          const eventFocusGroups = Array.isArray(efgData) ? efgData : [efgData];
          const fgRes = await fetch(`/api/proxy/focus-groups?size=500&sort=name,asc`);
          const fgData = await fgRes.json();
          const focusGroups = Array.isArray(fgData) ? fgData : [fgData];
          const byId = new Map<number, { name: string }>();
          focusGroups.forEach((f: { id?: number; name: string }) => { if (f.id != null) byId.set(f.id, { name: f.name }); });
          const names: Record<number, string> = {};
          const options: { id: number; name: string }[] = [];
          eventFocusGroups.forEach((efg: { id?: number; focusGroupId?: number }) => {
            if (efg.id != null && efg.focusGroupId != null) {
              const name = byId.get(efg.focusGroupId)?.name ?? `Focus group ${efg.id}`;
              names[efg.id] = name;
              options.push({ id: efg.id, name });
            }
          });
          setEventFocusGroupOptions(options);
          setFocusGroupNameByAssociationId(names);
        } catch (e) {
          console.warn('Failed to fetch event focus groups:', e);
        }

        // Media is fetched in a separate effect that respects focus group filter
        // Fetch featured performers
        try {
          const performersParams = new URLSearchParams({
            'eventId.equals': eventId.toString(),
            'isActive.equals': 'true'
            // Removed sort parameter to avoid backend parsing errors
          });
          const performersRes = await fetch(`/api/proxy/event-featured-performers?${performersParams.toString()}`);

          if (!performersRes.ok) {
            console.warn('Featured performers fetch failed:', performersRes.status, performersRes.statusText);
            setFeaturedPerformers([]);
          } else {
            const contentType = performersRes.headers.get('content-type');
            if (contentType && contentType.includes('application/json')) {
              const performersData = await performersRes.json();
              setFeaturedPerformers(Array.isArray(performersData) ? performersData : [performersData]);
            } else {
              console.warn('Featured performers response is not JSON:', contentType);
              setFeaturedPerformers([]);
            }
          }
        } catch (err) {
          console.error('Error fetching featured performers:', err);
          setFeaturedPerformers([]);
        }

        // Fetch contacts
        try {
          const contactsParams = new URLSearchParams({
            'eventId.equals': eventId.toString()
          });
          const contactsRes = await fetch(`/api/proxy/event-contacts?${contactsParams.toString()}`);

          if (!contactsRes.ok) {
            console.warn('Contacts fetch failed:', contactsRes.status, contactsRes.statusText);
            setContacts([]);
          } else {
            const contentType = contactsRes.headers.get('content-type');
            if (contentType && contentType.includes('application/json')) {
              const contactsData = await contactsRes.json();
              setContacts(Array.isArray(contactsData) ? contactsData : [contactsData]);
            } else {
              console.warn('Contacts response is not JSON:', contentType);
              setContacts([]);
            }
          }
        } catch (err) {
          console.error('Error fetching contacts:', err);
          setContacts([]);
        }

        // Fetch program directors
        try {
          const directorsParams = new URLSearchParams({
            'eventId.equals': eventId.toString()
          });
          const directorsRes = await fetch(`/api/proxy/event-program-directors?${directorsParams.toString()}`);

          if (!directorsRes.ok) {
            console.warn('Program directors fetch failed:', directorsRes.status, directorsRes.statusText);
            setProgramDirectors([]);
          } else {
            const contentType = directorsRes.headers.get('content-type');
            if (contentType && contentType.includes('application/json')) {
              const directorsData = await directorsRes.json();
              setProgramDirectors(Array.isArray(directorsData) ? directorsData : [directorsData]);
            } else {
              console.warn('Program directors response is not JSON:', contentType);
              setProgramDirectors([]);
            }
          }
        } catch (err) {
          console.error('Error fetching program directors:', err);
          setProgramDirectors([]);
        }

        // Fetch sponsors from event-sponsors-join table
        try {
          const sponsorsRes = await fetch(`/api/proxy/event-sponsors-join/event/${eventId}`);

          if (!sponsorsRes.ok) {
            console.warn('Sponsors fetch failed:', sponsorsRes.status, sponsorsRes.statusText);
            setSponsors([]);
          } else {
            const contentType = sponsorsRes.headers.get('content-type');
            if (contentType && contentType.includes('application/json')) {
              const sponsorsData = await sponsorsRes.json();
              let sponsorsArray = Array.isArray(sponsorsData) ? sponsorsData : [sponsorsData];

              // Populate sponsor details if they're missing (sponsor object might only have ID)
              console.log('🔄 Checking and populating sponsor details...');
              const populatedSponsors = await Promise.all(
                sponsorsArray.map(async (joinRecord: EventSponsorsJoinDTO) => {
                  // Skip if no sponsor reference
                  if (!joinRecord.sponsor) {
                    console.warn('⚠️ Join record missing sponsor reference:', joinRecord.id);
                    return joinRecord;
                  }

                  // Check if sponsor has ID but missing details (like name)
                  if (joinRecord.sponsor.id && !joinRecord.sponsor.name) {
                    console.log('🔍 Fetching sponsor details for ID:', joinRecord.sponsor.id);
                    try {
                      const sponsorDetailsRes = await fetch(`/api/proxy/event-sponsors/${joinRecord.sponsor.id}`, {
                        cache: 'no-store',
                      });

                      if (sponsorDetailsRes.ok) {
                        const sponsorDetails = await sponsorDetailsRes.json();
                        console.log('✅ Fetched sponsor details:', sponsorDetails);
                        return {
                          ...joinRecord,
                          sponsor: sponsorDetails
                        };
                      } else {
                        console.warn('⚠️ Failed to fetch sponsor details for ID:', joinRecord.sponsor.id, sponsorDetailsRes.status);
                        // Return original record even if fetch failed
                        return joinRecord;
                      }
                    } catch (error) {
                      console.warn('⚠️ Error fetching sponsor details:', error);
                      // Return original record even if fetch failed
                      return joinRecord;
                    }
                  } else if (joinRecord.sponsor.name) {
                    // Sponsor details already populated
                    console.log('✅ Sponsor details already populated for:', joinRecord.sponsor.name);
                  }
                  return joinRecord;
                })
              );

              console.log('✅ Populated sponsors:', populatedSponsors);
              setSponsors(populatedSponsors);

              // Fetch banner images for each sponsor from event_media table
              const bannerImageMap = new Map<number, string>();
              await Promise.all(
                populatedSponsors.map(async (joinRecord: EventSponsorsJoinDTO) => {
                  if (!joinRecord.sponsor?.id) return;

                  try {
                    // Build query parameters for banner image lookup
                    const params = new URLSearchParams();
                    params.append('eventId.equals', eventId.toString());
                    params.append('sponsorId.equals', joinRecord.sponsor.id.toString());
                    params.append('eventMediaType.equals', 'SPONSOR_BANNER');

                    // Add eventSponsorsJoinId if available
                    if (joinRecord.id) {
                      params.append('eventSponsorsJoinId.equals', joinRecord.id.toString());
                    }

                    // Sort by priority ranking (ascending - lower = higher priority)
                    params.append('sort', 'priorityRanking,asc');

                    const bannerRes = await fetch(`/api/proxy/event-medias?${params.toString()}`);
                    if (bannerRes.ok) {
                      const bannerData = await bannerRes.json();

                      // Handle paginated response (Spring Data REST format)
                      let bannerMedia: EventMediaDTO[] = [];
                      if (bannerData && typeof bannerData === 'object' && '_embedded' in bannerData && 'eventMedias' in bannerData._embedded) {
                        bannerMedia = Array.isArray(bannerData._embedded.eventMedias) ? bannerData._embedded.eventMedias : [];
                      } else {
                        bannerMedia = Array.isArray(bannerData) ? bannerData : [bannerData];
                      }

                      // Get the first (highest priority) banner image
                      const bannerImage = bannerMedia.find((m: EventMediaDTO) => m.fileUrl);
                      if (bannerImage?.fileUrl) {
                        bannerImageMap.set(joinRecord.sponsor.id, bannerImage.fileUrl);
                        console.log(`✅ Found banner image for sponsor ${joinRecord.sponsor.id}:`, bannerImage.fileUrl);
                      } else {
                        console.log(`⚠️ No banner image found for sponsor ${joinRecord.sponsor.id}`);
                      }
                    }
                  } catch (error) {
                    console.warn(`⚠️ Error fetching banner image for sponsor ${joinRecord.sponsor.id}:`, error);
                  }
                })
              );

              setSponsorBannerImages(bannerImageMap);
            } else {
              console.warn('Sponsors response is not JSON:', contentType);
              setSponsors([]);
            }
          }
        } catch (err) {
          console.error('Error fetching sponsors:', err);
          setSponsors([]);
        }
      } catch (err) {
        setEvent(null);
        setMedia([]);
        setFeaturedPerformers([]);
        setContacts([]);
        setProgramDirectors([]);
        setSponsors([]);
      } finally {
        setLoading(false);
      }
    }
    fetchEventDetails();
  }, [eventId]);

  // Fetch media (depends on focus group filter)
  useEffect(() => {
    async function fetchMedia() {
      if (!eventId) return;
      const params = new URLSearchParams({
        'eventId.equals': eventId.toString(),
        'isEventManagementOfficialDocument.equals': 'false',
        sort: 'updatedAt,desc',
      });
      if (eventFocusGroupIdFilter != null) {
        params.set('eventFocusGroupId.equals', String(eventFocusGroupIdFilter));
      }
      const mediaRes = await fetch(`/api/proxy/event-medias?${params.toString()}`);
      const mediaData = await mediaRes.json();
      setMedia(Array.isArray(mediaData) ? mediaData : [mediaData]);
    }
    fetchMedia();
  }, [eventId, eventFocusGroupIdFilter]);


  if (loading) {
    return (
      <Container className="py-16">
        <p className="muted">Loading event details…</p>
      </Container>
    );
  }

  if (!event || !event.id) {
    return (
      <Container className="py-16">
        <EmptyState title="Event not found." hint="This event may have been removed." action={{ href: '/events', label: 'Back to events' }} />
      </Container>
    );
  }

  const timezone = event.timezone || 'America/New_York';
  const poster =
    media.find((m) => m.isHomePageHeroImage && m.fileUrl) ||
    media.find((m) => m.eventFlyer && m.fileUrl) ||
    media.find((m) => m.fileUrl);
  const gallery = media.filter((m) => m.fileUrl && m.id !== poster?.id);
  const previewMedia = gallery.slice(0, 12);
  const todayStr = `${new Date().getFullYear()}-${String(new Date().getMonth() + 1).padStart(2, '0')}-${String(new Date().getDate()).padStart(2, '0')}`;
  const eventDateStr = event.startDate ? event.startDate.split('T')[0] : '';
  const isUpcomingLocal = !!eventDateStr && eventDateStr >= todayStr;
  const isPast = !!eventDateStr && !isUpcomingLocal;
  const registerTarget = isUpcomingLocal ? resolveRegisterTarget(event) : null;
  const buyTicketsTarget = isUpcomingLocal ? resolveBuyTicketsTarget(event, { internalPath: 'tickets' }) : null;
  const showDonationButton = isDonationBasedEvent(event) && isUpcomingLocal && !isTicketedFundraiserEvent(event);
  const showCompetitionLinks = event.isCompetitionEvent === true;
  const showResultsButton = showCompetitionLinks && isPast;
  const calendarLink =
    event.startDate && event.startTime && isUpcomingLocal
      ? `https://calendar.google.com/calendar/render?action=TEMPLATE&text=${encodeURIComponent(event.title || '')}&dates=${toGoogleCalendarDate(event.startDate, event.startTime)}/${toGoogleCalendarDate(event.endDate || event.startDate, event.endTime || event.startTime)}&details=${encodeURIComponent(event.description || '')}&location=${encodeURIComponent(event.location || '')}`
      : '';
  const visibleSponsors = [...sponsors]
    .sort((a, b) => (a.sponsor?.priorityRanking ?? 999999) - (b.sponsor?.priorityRanking ?? 999999))
    .filter((join) => join.sponsor?.name)
    .slice(0, 12);

  const actionLink = (href: string, label: string, external?: boolean) => (
    <Link
      key={label}
      href={href}
      className="btn btn-primary"
      {...(external ? { target: '_blank', rel: 'noopener noreferrer' } : {})}
    >
      {label}
    </Link>
  );

  return (
    <>
      <PageBanner
        eyebrow="What's happening"
        title={event.title || 'Event'}
        intro={event.caption || undefined}
        crumbs={[
          { label: 'Events', href: '/events' },
          { label: event.title || 'Event' },
        ]}
      />
      <Container className="py-12 sm:py-16">
        <ul className="mb-8 grid gap-3 sm:grid-cols-3">
          {event.startDate && (
            <li className="card stripe c-blue p-4">
              <p className="muted text-sm">Date</p>
              <p className="h5 mt-1">{formatDate(event.startDate, timezone)}</p>
            </li>
          )}
          {(event.startTime || event.endTime) && (
            <li className="card stripe c-gold p-4">
              <p className="muted text-sm">Time</p>
              <p className="h5 mt-1">
                {formatTime(event.startTime)}
                {event.endTime ? ` – ${formatTime(event.endTime)}` : ''}
              </p>
            </li>
          )}
          {event.location && (
            <li className="card stripe c-plum p-4">
              <p className="muted text-sm">Place</p>
              <p className="h5 mt-1">{event.location}</p>
              <div className="mt-2 flex flex-wrap gap-2">
                <button
                  type="button"
                  className="btn btn-text"
                  onClick={() => {
                    navigator.clipboard.writeText(event.location || '');
                    window.alert('Address copied to clipboard!');
                  }}
                >
                  Copy address
                </button>
                <a
                  className="btn btn-text"
                  href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(event.location)}`}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  Maps
                </a>
              </div>
            </li>
          )}
        </ul>

        <div className="mb-8 flex flex-wrap gap-3">
          {registerTarget && actionLink(registerTarget.href, 'Register', registerTarget.kind === 'external')}
          {buyTicketsTarget && actionLink(buyTicketsTarget.href, 'Buy tickets', buyTicketsTarget.kind === 'external')}
          {showDonationButton && actionLink(`/events/${event.id}/donation`, 'Donate')}
          {showCompetitionLinks && actionLink(`/events/${event.id}/competitions`, 'Competitions')}
          {showResultsButton && (
            <button
              type="button"
              className="btn btn-outline"
              aria-expanded={resultsOpen}
              aria-controls={`event-results-${event.id}`}
              onClick={() => setResultsOpen((open) => !open)}
            >
              {resultsOpen ? 'Hide results' : 'Results'}
            </button>
          )}
          {calendarLink && (
            <a href={calendarLink} target="_blank" rel="noopener noreferrer" className="btn btn-outline">
              Add to calendar
            </a>
          )}
          {isPast && !showResultsButton && (
            <button type="button" className="btn" disabled>
              This event has passed
            </button>
          )}
        </div>
        {showResultsButton && resultsOpen && (
          <div id={`event-results-${event.id}`} className="mb-8">
            <EventCardResultsPanel eventId={event.id} eventTitle={event.title || 'Event'} />
          </div>
        )}

        {poster?.fileUrl && (
          <figure className="card mb-8 overflow-hidden">
            <img src={poster.fileUrl} alt="" className="h-auto w-full object-contain" />
          </figure>
        )}

        {event.description && (
          <div className="sch-prose mb-10">
            {event.description.split(/\n\s*\n/).map((paragraph, index) => (
              <p key={index}>{paragraph}</p>
            ))}
          </div>
        )}

        {event.directionsToVenue && (
          <section className="wash c-green mb-10 rounded-2xl p-6">
            <h2 className="h4">Directions</h2>
            <div className="sch-prose mt-3">
              {event.directionsToVenue.split('\n').map((line, index) => (
                <p key={index}>{line}</p>
              ))}
            </div>
          </section>
        )}

        {contacts.length > 0 && (
          <section className="mb-10">
            <h2 className="h4 mb-4">Contacts</h2>
            <div className="card-grid">
              {contacts.map((contact, index) => (
                <article key={contact.id ?? index} className={`card stripe ${colourAt(index)} p-5`}>
                  <h3 className="h5">{contact.name}</h3>
                  {contact.phone && (
                    <a className="btn btn-text mt-2" href={`tel:${contact.phone}`}>
                      {contact.phone}
                    </a>
                  )}
                  {contact.email && (
                    <a className="btn btn-text" href={`mailto:${contact.email}`}>
                      {contact.email}
                    </a>
                  )}
                </article>
              ))}
            </div>
          </section>
        )}

        {featuredPerformers.length > 0 && (
          <section className="mb-10">
            <h2 className="h4 mb-4">Featured guests</h2>
            <div className="card-grid">
              {featuredPerformers.map((performer, index) => (
                <article key={performer.id ?? index} className={`card stripe ${colourAt(index)}`}>
                  {performer.portraitImageUrl && (
                    <div className="card-photo aspect-square">
                      <img src={performer.portraitImageUrl} alt="" />
                    </div>
                  )}
                  <div className="p-5">
                    <h3 className="h5">{performer.name}</h3>
                    {performer.isHeadliner && <p className="kicker mt-1">Headliner</p>}
                    {performer.stageName && <p className="body mt-1">{performer.stageName}</p>}
                    {performer.role && <p className="muted mt-1">{performer.role}</p>}
                    {performer.bio && <p className="body mt-2 line-clamp-3">{performer.bio}</p>}
                    <div className="mt-3 flex flex-wrap gap-2">
                      {performer.websiteUrl?.trim() && <SocialIconLink platform="website" href={performer.websiteUrl.trim()} />}
                      {performer.facebookUrl?.trim() && <SocialIconLink platform="facebook" href={performer.facebookUrl.trim()} />}
                      {performer.instagramUrl?.trim() && <SocialIconLink platform="instagram" href={performer.instagramUrl.trim()} />}
                      {performer.youtubeUrl?.trim() && <SocialIconLink platform="youtube" href={performer.youtubeUrl.trim()} />}
                      {performer.twitterUrl?.trim() && <SocialIconLink platform="twitter" href={performer.twitterUrl.trim()} />}
                      {performer.linkedinUrl?.trim() && <SocialIconLink platform="linkedin" href={performer.linkedinUrl.trim()} />}
                      {performer.tiktokUrl?.trim() && <SocialIconLink platform="tiktok" href={performer.tiktokUrl.trim()} />}
                    </div>
                  </div>
                </article>
              ))}
            </div>
          </section>
        )}

        {programDirectors.length > 0 && (
          <section className="mb-10">
            <h2 className="h4 mb-4">Directors</h2>
            <div className="card-grid">
              {programDirectors.map((director, index) => (
                <article key={director.id ?? index} className={`card stripe ${colourAt(index)}`}>
                  {director.photoUrl && (
                    <div className="card-photo aspect-square">
                      <img src={director.photoUrl} alt="" />
                    </div>
                  )}
                  <div className="p-5">
                    <h3 className="h5">{director.name}</h3>
                    {director.bio && <p className="body mt-2 whitespace-pre-wrap">{director.bio}</p>}
                  </div>
                </article>
              ))}
            </div>
          </section>
        )}

        {visibleSponsors.length > 0 && (
          <section className="mb-10" id="sponsors">
            <h2 className="h4 mb-4">Sponsors</h2>
            <div className="card-grid">
              {visibleSponsors.map((join, index) => {
                const sponsor = join.sponsor;
                if (!sponsor) return null;
                const image = (sponsor.id && sponsorBannerImages.get(sponsor.id)) || sponsor.bannerImageUrl;
                const card = (
                  <>
                    {image && (
                      <div className="card-photo aspect-[5/4]">
                        <img src={image} alt="" />
                      </div>
                    )}
                    <div className="p-5">
                      <h3 className="h5">{sponsor.name}</h3>
                      {sponsor.tagline && <p className="body mt-1">{sponsor.tagline}</p>}
                      {sponsor.websiteUrl && <span className="btn btn-text mt-2">Visit</span>}
                    </div>
                  </>
                );
                return sponsor.websiteUrl ? (
                  <a
                    key={join.id ?? sponsor.id ?? index}
                    href={sponsor.websiteUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={`card stripe ${colourAt(index)}`}
                  >
                    {card}
                  </a>
                ) : (
                  <article key={join.id ?? sponsor.id ?? index} className={`card stripe ${colourAt(index)}`}>
                    {card}
                  </article>
                );
              })}
            </div>
            {sponsors.filter((join) => join.sponsor?.name).length > 12 && (
              <p className="mt-4">
                <Link href={`/events/${event.id}#sponsors`} className="btn btn-text">
                  See all sponsors
                </Link>
              </p>
            )}
          </section>
        )}

        {gallery.length > 0 && (
          <section className="mb-10">
            <div className="mb-4 flex flex-wrap items-end justify-between gap-3">
              <h2 className="h4">Gallery</h2>
              {eventFocusGroupOptions.length > 0 && (
                <label className="muted text-sm">
                  Focus group{' '}
                  <select
                    className="ml-2 rounded-lg border border-[var(--line)] bg-white px-3 py-2"
                    value={eventFocusGroupIdFilter ?? ''}
                    onChange={(eventChange) => {
                      const value = eventChange.target.value;
                      setEventFocusGroupIdFilter(value ? Number(value) : null);
                    }}
                  >
                    <option value="">All</option>
                    {eventFocusGroupOptions.map((option) => (
                      <option key={option.id} value={option.id}>
                        {option.name}
                      </option>
                    ))}
                  </select>
                </label>
              )}
            </div>
            <div className="card-grid">
              {previewMedia.map((item, index) => {
                const groupId = item.eventFocusGroupId;
                const groupName = groupId != null ? focusGroupNameByAssociationId[groupId] : undefined;
                return (
                  <button
                    key={item.id ?? index}
                    type="button"
                    className={`card stripe ${colourAt(index)} text-left`}
                    onClick={() => {
                      setSlideshowInitialIndex(gallery.findIndex((mediaItem) => mediaItem.id === item.id));
                      setShowSlideshow(true);
                    }}
                  >
                    <div className="card-photo aspect-[5/4]">
                      <img src={item.fileUrl} alt={item.altText || item.title || ''} />
                    </div>
                    <div className="p-4">
                      <h3 className="h5">{item.title || (item.eventMediaType === 'VIDEO' ? 'Video' : 'Photo')}</h3>
                      {groupName && <p className="muted mt-1 text-sm">{groupName}</p>}
                    </div>
                  </button>
                );
              })}
            </div>
            {gallery.length > previewMedia.length && (
              <button
                type="button"
                className="btn btn-outline mt-4"
                onClick={() => {
                  setSlideshowInitialIndex(previewMedia.length);
                  setShowSlideshow(true);
                }}
              >
                View {gallery.length - previewMedia.length} more
              </button>
            )}
          </section>
        )}

        <p className="mt-8">
          <Link href="/events" className="btn btn-text">
            View all events
          </Link>
        </p>
      </Container>

      {showSlideshow && (
        <EventMediaSlideshow
          event={event}
          media={gallery}
          initialIndex={Math.max(0, slideshowInitialIndex)}
          onClose={() => setShowSlideshow(false)}
        />
      )}
    </>
  );
}
