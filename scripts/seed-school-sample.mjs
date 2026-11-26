/**
 * Copy Christ Nagar scrape text and photos into the existing school APIs.
 * Skips a record when the same slug (or person, or title) is already stored.
 *
 * Usage: node scripts/seed-school-sample.mjs
 */
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const scrapeCandidates = [
  'F:/project_workspace/christ-nagar-school/christ-nagar-school/christnagarschoolicse.edu.in',
  path.resolve(root, '../christ-nagar-school/christnagarschoolicse.edu.in'),
];
const scrapeRoot = scrapeCandidates.find((dir) => fs.existsSync(path.join(dir, 'index.html')));
if (!scrapeRoot) {
  throw new Error(`Christ Nagar scrape not found. Looked in:\n${scrapeCandidates.join('\n')}`);
}
const sampleDir = path.join(root, 'public', 'school', 'samples');
const footerWidgetIds = new Set(['d428ba3', '23e8185', '71223e4']);

function loadEnv(file) {
  const env = {};
  if (!fs.existsSync(file)) return env;
  for (const line of fs.readFileSync(file, 'utf8').split(/\r?\n/)) {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith('#')) continue;
    const eq = trimmed.indexOf('=');
    if (eq < 1) continue;
    let value = trimmed.slice(eq + 1).trim();
    if ((value.startsWith('"') && value.endsWith('"')) || (value.startsWith("'") && value.endsWith("'"))) {
      value = value.slice(1, -1);
    }
    env[trimmed.slice(0, eq).trim()] = value;
  }
  return env;
}

function pick(env, ...keys) {
  for (const key of keys) {
    if (env[key]) return env[key];
  }
  return '';
}

function decode(value) {
  return value
    .replace(/&#8217;|&#8216;|&rsquo;|&lsquo;/g, "'")
    .replace(/&#8220;|&#8221;|&ldquo;|&rdquo;/g, '"')
    .replace(/&#8211;|&ndash;/g, '-')
    .replace(/&amp;/g, '&')
    .replace(/&nbsp;/g, ' ')
    .replace(/&#(\d+);/g, (_, code) => String.fromCharCode(Number(code)));
}

function htmlToText(html) {
  return decode(
    html
      .replace(/<script[\s\S]*?<\/script>/gi, ' ')
      .replace(/<style[\s\S]*?<\/style>/gi, ' ')
      .replace(/<br\s*\/?>/gi, '\n')
      .replace(/<\/p>/gi, '\n\n')
      .replace(/<[^>]+>/g, ' ')
  )
    .replace(/[ \t]+\n/g, '\n')
    .replace(/[ \t]{2,}/g, ' ')
    .replace(/\n{3,}/g, '\n\n')
    .trim();
}

function pageFile(rel) {
  return path.join(scrapeRoot, rel, 'index.html');
}

function readPage(rel) {
  const file = pageFile(rel);
  const html = fs.readFileSync(file, 'utf8');
  const main = html.split('data-elementor-type="footer"')[0];
  return { file, dir: path.dirname(file), html, main };
}

function textBlocks(main) {
  const blocks = [];
  const re = /data-id="([^"]+)"[\s\S]{0,500}?data-widget_type="text-editor\.default"[^>]*>([\s\S]*?)<\/div>/g;
  let match;
  while ((match = re.exec(main))) {
    if (footerWidgetIds.has(match[1])) continue;
    const text = htmlToText(match[2]);
    if (text.length > 40) blocks.push(text);
  }
  const quotes = [];
  const quoteRe = /elementor-testimonial__text">([\s\S]*?)<\/div>/g;
  while ((match = quoteRe.exec(main))) {
    const text = htmlToText(match[1]);
    if (text.length > 40) quotes.push(text);
  }
  return { blocks, quotes };
}

function people(main) {
  const found = [];
  const re = /elementor-image-box-wrapper">([\s\S]*?)<\/div>\s*<\/div>/g;
  let match;
  while ((match = re.exec(main))) {
    const chunk = match[1];
    const img = chunk.match(/src="([^"]+)"/);
    const title = chunk.match(/elementor-image-box-title">([\s\S]*?)<\/h3>/);
    const desc = chunk.match(/elementor-image-box-description">([\s\S]*?)<\/p>/);
    if (!title) continue;
    found.push({
      name: htmlToText(title[1]),
      detail: desc ? htmlToText(desc[1]) : '',
      src: img ? img[1] : '',
    });
  }
  return found;
}

function uploadPhoto(url) {
  if (!url || !url.includes('wp-content/uploads')) return '';
  if (/logo|androidapp|cropped-|favicon|elementor\/css|\.(css|js)(\?|$)/i.test(url)) return '';
  if (/\d\.png$/i.test(url)) return '';
  return url.split('?')[0];
}

function images(main) {
  const found = [];
  const re = /<img\b[^>]*>/g;
  let match;
  while ((match = re.exec(main))) {
    const tag = match[0];
    const src = uploadPhoto((tag.match(/\ssrc="([^"]+)"/) || [])[1]);
    const srcset = (tag.match(/\ssrcset="([^"]+)"/) || [])[1] || '';
    const sized = srcset
      .split(',')
      .map((part) => {
        const bits = part.trim().split(/\s+/);
        return { url: uploadPhoto(bits[0]), width: Number((bits[1] || '').replace('w', '')) || 0 };
      })
      .filter((part) => part.url);
    const full = [src, ...sized.map((part) => part.url)].find((url) => url && !/-\d+x\d+\.(jpe?g|png|webp)$/i.test(url));
    sized.sort((a, b) => b.width - a.width);
    const url = full || sized.find((part) => part.width >= 300)?.url || '';
    if (!url) continue;
    if (!found.includes(url)) found.push(url);
  }
  return found;
}

function copyImage(pageDir, src, destName) {
  if (!src) return '';
  const abs = path.normalize(path.join(pageDir, src.split('?')[0]));
  if (!fs.existsSync(abs)) return '';
  const ext = path.extname(abs).toLowerCase() || '.jpg';
  const filename = `${destName}${ext}`;
  fs.mkdirSync(sampleDir, { recursive: true });
  fs.copyFileSync(abs, path.join(sampleDir, filename));
  return `/school/samples/${filename}`;
}

function clip(value, max) {
  const text = (value || '').replace(/\s+/g, ' ').trim();
  if (text.length <= max) return text;
  return `${text.slice(0, max - 1).trim()}…`;
}

function splitName(full) {
  const cleaned = full.replace(/\s+/g, ' ').trim();
  const parts = cleaned.split(' ');
  const honorifics = new Set(['ms', 'mr', 'mrs', 'dr', 'rev', 'fr', 'sr', 'prof']);
  const suffixes = new Set(['cmi', 'cmicmi']);
  while (parts.length && honorifics.has(parts[0].toLowerCase().replace(/\./g, ''))) parts.shift();
  while (parts.length && suffixes.has(parts[parts.length - 1].toLowerCase().replace(/\./g, ''))) parts.pop();
  const firstName = parts[0] || cleaned;
  const lastName = parts.slice(1).join(' ') || 'Staff';
  return { firstName: clip(firstName, 50), lastName: clip(lastName, 50) };
}

function bundle(rel) {
  const page = readPage(rel);
  const { blocks, quotes } = textBlocks(page.main);
  const body = [...blocks, ...quotes].join('\n\n').trim();
  const titleMatch = page.main.match(/<h1[^>]*>([\s\S]*?)<\/h1>/);
  const title = titleMatch ? htmlToText(titleMatch[1]) : rel;
  const pics = images(page.main);
  return {
    rel,
    dir: page.dir,
    title,
    body,
    summary: clip(body, 900),
    people: people(page.main),
    imageSrc: pics[0] || '',
    pics,
  };
}

function dateFromSlug(slug) {
  const match = String(slug).match(/(?:19|20)\d{2}/);
  return match ? `${match[0]}-06-01` : '2019-01-01';
}

function safeBundle(rel) {
  if (!fs.existsSync(pageFile(rel))) return null;
  try {
    return bundle(rel);
  } catch (error) {
    console.error(`SKIP read ${rel} ${error.message}`);
    return null;
  }
}

function localImage(pageDir, src) {
  if (!src) return '';
  const abs = path.normalize(path.join(pageDir, src.split('?')[0]));
  return fs.existsSync(abs) ? abs : '';
}

const departments = [
  ['english', 'English', 'english-2'],
  ['malayalam', 'Malayalam', 'malayalam'],
  ['hindi', 'Hindi', 'hindi-2'],
  ['mathematics', 'Mathematics', 'mathematics-2'],
  ['physics', 'Physics', 'physics'],
  ['chemistry', 'Chemistry', 'chemistry'],
  ['biology', 'Biology', 'biology'],
  ['computer-science', 'Computer Science', 'computer-science'],
  ['commerce', 'Commerce', 'commerce'],
  ['history-geography', 'History and Geography', 'history-geography'],
  ['german', 'German', 'department-of-german'],
  ['geography', 'Geography', 'department-of-geography'],
  ['general-science', 'General science', 'department-of-general-science'],
  ['physical-training', 'Physical training', 'physical-training'],
  ['art-music-dance', 'Yoga, art, dance, music, band and NCC', 'art-music-dance'],
  ['librarian', 'Librarian', 'yoga-2'],
];

const facilities = [
  ['library', 'Library', 'library'],
  ['biology-lab', 'Biology lab', 'biology-lab'],
  ['chemistry-lab', 'Chemistry lab', 'chemistry-lab'],
  ['computer-lab', 'Computer lab', 'computer-lab'],
  ['music-room', 'Music room', 'music-room'],
  ['bus', 'School bus', 'bus-facilities'],
  ['information-center', 'Information center', 'information-center'],
  ['physics-lab', 'Physics lab', 'physics-lab'],
];

const activities = [
  ['english-club', 'English club', 'english-club', 'CLUB'],
  ['hindi-club', 'Hindi club', 'hindi-club', 'CLUB'],
  ['malayalam-club', 'Malayalam club', 'malayalam-club', 'CLUB'],
  ['maths-club', 'Maths club', 'maths-club', 'CLUB'],
  ['science-club', 'Science club', 'science-club', 'CLUB'],
  ['quiz-club', 'Quiz club', 'quiz-club', 'CLUB'],
  ['basketball', 'Basketball', 'basketball', 'SPORT'],
  ['chess', 'Chess', 'chess', 'SPORT'],
  ['karate', 'Karate', 'karate', 'SPORT'],
  ['yoga', 'Yoga', 'yoga-2', 'SPORT'],
  ['ncc', 'NCC', 'ncc', 'SPORT'],
  ['band', 'Band', 'band', 'CLUB'],
  ['roller-skating', 'Roller skating', 'roller-skating', 'SPORT'],
  ['aerobics', 'Aerobics', 'aerobics', 'SPORT'],
];

const pages = [
  ['about', 'About the school', 'about-us'],
  ['principals-message', "Principal's message", 'principals-message'],
  ['academics', 'Academics', 'courses-offering-isc'],
  ['admissions', 'Admissions', 'information-center'],
];

const newsPages = [
  ['a-joyous-beginning-2026-27', 'a-joyous-beginning-to-the-academic-year-2026-27'],
  ['merit-day-2026', 'excellence-in-focus-merit-day-2026'],
  ['prathibhotsav-2026', 'prathibhotsav-2026-a-vibrant-tapestry-of-talent-and-expression'],
  ['christ-nagar-at-50', 'christ-nagar-at-50-a-year-of-celebration-begins'],
  ['rangotsav-2026', 'rangotsav-2026-an-inter-school-cultural-showcase'],
  ['teachers-day-2026', 'honouring-the-guiding-lights-teachers-day-2026'],
  ['talent-day-2026', 'talent-day-2026-a-lesson-beyond-the-classroom'],
  ['horse-project', 'horse-project-swiss-collaboration'],
  ['artmile-japan', 'artmile-japan-collaboration'],
  ['celebration-of-faith', 'a-celebration-of-faith-excellence-and-festivity'],
  ['black-and-white-day', 'a-striking-contrast-black-and-white-day'],
  ['rising-to-responsibility', 'rising-to-responsibility'],
  ['newsletter-2026', 'newsletter-2026'],
  ['german-pasch', 'german-pasch-school-partners-for-the-future'],
];

const highlights = [
  ['derozio-award', 'achievements/a-beacon-of-excellence-fr-dr-mathew-thengumpally-cmi-honoured-with-the-derozio-award', '2026'],
  ['la-fest-2026', 'achievements/christ-nagar-higher-secondary-school-creates-a-remarkable-impression-at-la-fest-2026', '2026'],
  ['citation-of-eminence', 'achievements/citation-of-eminence', '2026'],
  ['iso-9001', 'achievements/iso-90012015', '2026'],
];

function departmentBody(item, teachers) {
  if (item.body) return item.body;
  if (!teachers.length) return `${item.title} at Christ Nagar Higher Secondary School.`;
  const names = teachers.map((person) => `${person.name}${person.detail ? ` (${person.detail})` : ''}`).join('; ');
  return `Faculty of the ${item.title} department: ${names}.`;
}

async function main() {
  const env = { ...loadEnv(path.join(root, '.env.local')), ...loadEnv(path.join(root, '.env')) };
  const apiBase = pick(env, 'NEXT_PUBLIC_API_BASE_URL', 'AMPLIFY_NEXT_PUBLIC_API_BASE_URL').replace(/\/$/, '');
  const tenantId = pick(env, 'NEXT_PUBLIC_TENANT_ID', 'AMPLIFY_NEXT_PUBLIC_TENANT_ID');
  const username = pick(env, 'API_JWT_USER', 'AMPLIFY_API_JWT_USER', 'NEXT_PUBLIC_API_JWT_USER');
  const password = pick(env, 'API_JWT_PASS', 'AMPLIFY_API_JWT_PASS', 'NEXT_PUBLIC_API_JWT_PASS');
  if (!apiBase || !tenantId || !username || !password) {
    throw new Error('Missing API base URL, tenant id, or JWT credentials in .env.local');
  }

  const auth = await fetch(`${apiBase}/api/authenticate`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ username, password, rememberMe: true }),
  });
  if (!auth.ok) throw new Error(`Authenticate failed: ${auth.status}`);
  const token = (await auth.json()).id_token;
  if (!token) throw new Error('Authenticate response had no id_token');

  async function api(method, resource, { query = '', body } = {}) {
    const response = await fetch(`${apiBase}/api/${resource}${query ? `?${query}` : ''}`, {
      method,
      headers: {
        Authorization: `Bearer ${token}`,
        'X-Tenant-ID': tenantId,
        ...(body ? { 'Content-Type': 'application/json' } : {}),
      },
      body: body ? JSON.stringify(body) : undefined,
    });
    const text = await response.text();
    let data = null;
    if (text) {
      try {
        data = JSON.parse(text);
      } catch {
        data = text;
      }
    }
    return { ok: response.ok, status: response.status, data };
  }

  function rows(data) {
    if (Array.isArray(data)) return data;
    if (data && Array.isArray(data.content)) return data.content;
    return [];
  }

  async function exists(resource, query) {
    const result = await api('GET', resource, { query: `tenantId.equals=${encodeURIComponent(tenantId)}&${query}&size=1` });
    if (!result.ok) return false;
    return rows(result.data).length > 0;
  }

  async function create(resource, body) {
    const result = await api('POST', resource, { body: { ...body, tenantId } });
    if (!result.ok) {
      const detail = typeof result.data === 'string' ? result.data.slice(0, 240) : JSON.stringify(result.data).slice(0, 240);
      console.error(`FAIL ${resource} ${body.slug || body.title || body.personName || body.headline || ''} ${result.status} ${detail}`);
      return false;
    }
    console.log(`OK ${resource} ${body.slug || body.title || body.personName || body.headline || ''}`);
    return true;
  }

  const now = new Date().toISOString();
  let created = 0;
  let skipped = 0;

  async function save(resource, keyQuery, body) {
    if (await exists(resource, keyQuery)) {
      skipped += 1;
      console.log(`SKIP ${resource} ${body.slug || body.title || body.personName || body.headline || ''}`);
      return;
    }
    if (await create(resource, body)) created += 1;
  }

  for (const [slug, fallbackTitle, rel] of pages) {
    const item = bundle(rel);
    const imageUrl = copyImage(item.dir, item.imageSrc, slug);
    await save('school-pages', `slug.equals=${slug}`, {
      slug,
      title: item.title || fallbackTitle,
      summary: item.summary || fallbackTitle,
      body: item.body || item.title || fallbackTitle,
      imageUrl,
      sortOrder: pages.findIndex((row) => row[0] === slug),
      isActive: true,
    });
  }

  for (const [slug, name, rel] of departments) {
    const item = bundle(rel);
    const teachers = item.people;
    const imageUrl = copyImage(item.dir, item.imageSrc || teachers[0]?.src, slug);
    const body = departmentBody({ title: name, body: item.body }, teachers);
    await save('school-departments', `slug.equals=${slug}`, {
      slug,
      name,
      summary: clip(body, 900),
      body,
      imageUrl,
      sortOrder: departments.findIndex((row) => row[0] === slug),
      isActive: true,
    });
    for (const [index, person] of teachers.entries()) {
      const names = splitName(person.name);
      const profileImageUrl = copyImage(item.dir, person.src, `${slug}-${index + 1}`);
      const query = `firstName.equals=${encodeURIComponent(names.firstName)}&lastName.equals=${encodeURIComponent(names.lastName)}`;
      await save('school-staff-members', query, {
        staffCategory: 'TEACHING',
        stage: 'HSS',
        ...names,
        designation: 'Teacher',
        qualification: clip(person.detail, 120),
        subjectName: name,
        profileImageUrl,
        bio: person.detail,
        priorityOrder: index,
        isActive: true,
      });
    }
  }

  for (const [slug, name, rel] of facilities) {
    const item = bundle(rel);
    const imageUrl = copyImage(item.dir, item.imageSrc, slug);
    const body = item.body || `${name} at Christ Nagar Higher Secondary School.`;
    await save('school-facilities', `slug.equals=${slug}`, {
      slug,
      name,
      summary: clip(body, 900) || name,
      body,
      imageUrl,
      sortOrder: facilities.findIndex((row) => row[0] === slug),
      isActive: true,
    });
  }

  for (const [slug, name, rel, activityKind] of activities) {
    const item = bundle(rel);
    const imageUrl = copyImage(item.dir, item.imageSrc || item.people[0]?.src, slug);
    const body = item.body || departmentBody({ title: name, body: '' }, item.people.slice(0, 4));
    await save('school-activities', `slug.equals=${slug}`, {
      slug,
      name,
      activityKind,
      summary: clip(body, 900) || name,
      body,
      imageUrl,
      sortOrder: activities.findIndex((row) => row[0] === slug),
      isActive: true,
    });
  }

  const admin = bundle('administration');
  for (const [index, person] of admin.people.entries()) {
    const names = splitName(person.name);
    const profileImageUrl = copyImage(admin.dir, person.src, `admin-${index + 1}`);
    await save(
      'school-staff-members',
      `firstName.equals=${encodeURIComponent(names.firstName)}&lastName.equals=${encodeURIComponent(names.lastName)}`,
      {
        staffCategory: 'ADMINISTRATION',
        stage: 'ALL',
        ...names,
        designation: clip(person.detail, 120) || 'Administrator',
        qualification: '',
        subjectName: '',
        profileImageUrl,
        bio: person.detail,
        priorityOrder: index,
        isActive: true,
      }
    );
  }

  const kg = bundle('teaching-kg');
  for (const [index, person] of kg.people.entries()) {
    const names = splitName(person.name);
    const profileImageUrl = copyImage(kg.dir, person.src, `kg-${index + 1}`);
    await save(
      'school-staff-members',
      `firstName.equals=${encodeURIComponent(names.firstName)}&lastName.equals=${encodeURIComponent(names.lastName)}`,
      {
        staffCategory: 'TEACHING',
        stage: 'KG',
        ...names,
        designation: 'Kindergarten teacher',
        qualification: clip(person.detail, 120),
        subjectName: '',
        profileImageUrl,
        bio: person.detail,
        priorityOrder: 20 + index,
        isActive: true,
      }
    );
  }

  const support = bundle('supporting-staff');
  for (const [index, person] of support.people.entries()) {
    const names = splitName(person.name);
    const profileImageUrl = copyImage(support.dir, person.src, `support-${index + 1}`);
    await save(
      'school-staff-members',
      `firstName.equals=${encodeURIComponent(names.firstName)}&lastName.equals=${encodeURIComponent(names.lastName)}`,
      {
        staffCategory: 'SUPPORTING',
        stage: 'ALL',
        ...names,
        designation: clip(person.detail, 120) || 'Support staff',
        qualification: '',
        subjectName: '',
        profileImageUrl,
        bio: person.detail,
        priorityOrder: 40 + index,
        isActive: true,
      }
    );
  }

  for (const [slug, rel, academicYear] of highlights) {
    const item = bundle(rel);
    const imageUrl = copyImage(item.dir, item.imageSrc, slug);
    await save('school-highlights', `personName.equals=${encodeURIComponent(clip(item.title, 180))}`, {
      personName: clip(item.title, 180),
      subtitle: clip(item.summary, 180),
      imageUrl,
      academicYear,
      sortOrder: highlights.findIndex((row) => row[0] === slug),
      isActive: true,
    });
  }

  for (const [slug, rel] of newsPages) {
    const item = bundle(rel);
    const featuredImageUrl = copyImage(item.dir, item.imageSrc, slug);
    const body = item.body || item.title;
    await save('profile-writings', `title.equals=${encodeURIComponent(clip(item.title, 500))}`, {
      title: clip(item.title, 500),
      slug,
      excerpt: clip(body, 500),
      body,
      featuredImageUrl,
      writingType: 'ORIGINAL',
      status: 'PUBLISHED',
      publishedAt: '2026-10-01',
      displayOrder: newsPages.findIndex((row) => row[0] === slug),
      createdAt: now,
      updatedAt: now,
    });
  }

  const notices = [
    ['Plus Two model examination timetable is published under Downloads.', '/downloads'],
    ['Prathibhotsav 2026 photographs are in the gallery.', '/gallery'],
    ['Admissions enquiries are open at the school office.', '/admissions'],
  ];
  for (const [headline, linkUrl] of notices) {
    const result = await api('GET', 'news-flashes', {
      query: `tenantId.equals=${encodeURIComponent(tenantId)}&size=20`,
    });
    if (!result.ok) {
      console.error(`SKIP news-flashes (${result.status})`);
      break;
    }
    const already = rows(result.data).some((row) => row.headline === headline || row.title === headline);
    if (already) {
      skipped += 1;
      console.log(`SKIP news-flashes ${headline}`);
      continue;
    }
    if (await create('news-flashes', { headline, title: headline, linkUrl, isActive: true })) created += 1;
  }

  const invoices = [
    ['Plus One admission fee 2027-28', 18500],
    ['Plus Two admission fee 2027-28', 19500],
  ];
  for (const [title, amountDue] of invoices) {
    await save('school-fee-invoices', `title.equals=${encodeURIComponent(title)}`, {
      title,
      academicYear: '2027-28',
      feeKind: 'ADMISSION',
      studentName: 'Sample Student',
      classLabel: title.startsWith('Plus One') ? 'Plus One' : 'Plus Two',
      payerName: 'Sample Parent',
      payerEmail: 'parent@example.com',
      payerPhone: '04712318485',
      amountDue,
      currency: 'INR',
      dueDate: '2027-05-15',
      status: 'OPEN',
    });
  }

  async function findOne(resource, query) {
    const result = await api('GET', resource, {
      query: `tenantId.equals=${encodeURIComponent(tenantId)}&${query}&size=1`,
    });
    if (!result.ok) return null;
    return rows(result.data)[0] || null;
  }

  async function saveEvent(title, startDate, item) {
    const storedTitle = clip(title, 180);
    await save('event-details', `title.equals=${encodeURIComponent(storedTitle)}`, {
      title: storedTitle,
      caption: clip(item?.title || storedTitle, 255),
      description: clip(item?.body || item?.title || storedTitle, 900),
      startDate,
      endDate: startDate,
      promotionStartDate: '2026-11-23',
      startTime: '09:00',
      endTime: '15:00',
      timezone: 'Asia/Kolkata',
      location: 'Christ Nagar Higher Secondary School, Kowdiar',
      fromEmail: 'office@example.com',
      isActive: true,
      isFeaturedEvent: false,
      isCompetitionEvent: false,
      isLive: false,
      isRecurring: false,
      isRegistrationRequired: false,
      isSportsEvent: false,
      featuredEventPriorityRanking: 0,
      liveEventPriorityRanking: 0,
      createdAt: now,
      updatedAt: now,
    });
  }

  const events = [
    ['School reopening', '2027-06-01', 'events/school-reopening'],
    ['Prathibhotsav arts fest', '2027-01-20', 'events/prathibhotsav-26-arts-fest'],
    ['Merit day', '2027-03-12', 'excellence-in-focus-merit-day-2026'],
    ['Girls cell inauguration', '2019-01-01', 'events/girls-cell-inauguration'],
    ['Prathibhotsav inter-house cultural fest', '2026-08-12', 'events/prathibhotsav-26-inter-house-cultural-fest'],
  ];
  for (const [title, startDate, rel] of events) {
    await saveEvent(title, startDate, safeBundle(rel));
  }

  const galleryRoot = path.join(scrapeRoot, 'photo_gallery');
  const gallerySlugs = fs.existsSync(galleryRoot)
    ? fs
        .readdirSync(galleryRoot, { withFileTypes: true })
        .filter((entry) => entry.isDirectory() && fs.existsSync(path.join(galleryRoot, entry.name, 'index.html')))
        .map((entry) => entry.name)
    : [];

  const appUrl = 'http://localhost:3004';

  async function uploadAlbumPhoto(albumId, filePath, displayOrder) {
    const filename = path.basename(filePath);
    const ext = path.extname(filePath).toLowerCase();
    const type = ext === '.png' ? 'image/png' : ext === '.webp' ? 'image/webp' : ext === '.gif' ? 'image/gif' : 'image/jpeg';
    const bytes = fs.readFileSync(filePath);
    const form = new FormData();
    form.append('files', new Blob([bytes], { type }), filename);
    form.append('titles', filename);
    form.append('descriptions', filename);
    form.append('tenantId', tenantId);
    form.append('isPublic', 'true');
    form.append('albumId', String(albumId));
    form.append('eventId', '');
    form.append('displayOrder', String(displayOrder));
    form.append('startDisplayingFromDate', now.slice(0, 10));
    const response = await fetch(`${appUrl}/api/proxy/event-medias/upload-multiple`, {
      method: 'POST',
      headers: { 'X-Tenant-ID': tenantId },
      body: form,
    });
    if (!response.ok) {
      const detail = (await response.text()).slice(0, 180);
      console.error(`FAIL album photo ${filename} ${response.status} ${detail}`);
      return null;
    }
    const data = await response.json().catch(() => null);
    const media = Array.isArray(data) ? data[0] : data;
    return media?.id ? media : null;
  }

  async function unusedPhoto(filename) {
    const result = await api('GET', 'event-medias', {
      query: `tenantId.equals=${encodeURIComponent(tenantId)}&title.equals=${encodeURIComponent(filename)}&size=20`,
    });
    if (!result.ok) return null;
    return rows(result.data).find((row) => row.albumId == null) || null;
  }

  async function attachToAlbum(media, albumId, displayOrder) {
    const payload = {
      id: media.id,
      title: media.title || '',
      eventMediaType: media.eventMediaType || 'image/jpeg',
      storageType: media.storageType || 'S3',
      createdAt: media.createdAt || now,
      isHomePageHeroImage: false,
      isFeaturedEventImage: false,
      isLiveEventImage: false,
      albumId,
      eventId: null,
      tenantId,
      updatedAt: now,
      description: media.description || '',
      fileUrl: media.fileUrl,
      isPublic: true,
      eventFlyer: false,
      isEventManagementOfficialDocument: false,
      displayOrder,
      isHeroImage: false,
      isActiveHeroImage: false,
      startDisplayingFromDate: now.slice(0, 10),
      priorityRanking: 0,
    };
    const response = await fetch(`${apiBase}/api/event-medias/${media.id}`, {
      method: 'PATCH',
      headers: {
        Authorization: `Bearer ${token}`,
        'X-Tenant-ID': tenantId,
        'Content-Type': 'application/merge-patch+json',
      },
      body: JSON.stringify(payload),
    });
    if (!response.ok) {
      console.error(`FAIL attach ${media.id} ${(await response.text()).slice(0, 180)}`);
      return false;
    }
    return true;
  }

  for (const slug of gallerySlugs) {
    const rel = `photo_gallery/${slug}`;
    const item = safeBundle(rel);
    if (!item) continue;
    const title = clip(item.title || slug.replace(/-/g, ' '), 180);
    const startDate = dateFromSlug(slug);
    await saveEvent(title, startDate, item);

    const coverImageUrl = copyImage(item.dir, item.imageSrc, `album-${slug}`);
    const year = Number(startDate.slice(0, 4));
    await save('gallery-albums', `title.equals=${encodeURIComponent(title)}`, {
      title,
      description: clip(item.body || title, 900),
      coverImageUrl,
      isPublic: true,
      displayOrder: gallerySlugs.indexOf(slug),
      albumYear: year,
      eventLocation: 'Christ Nagar Higher Secondary School, Kowdiar',
      eventDateStart: startDate,
      createdAt: now,
      updatedAt: now,
    });

    const album = await findOne('gallery-albums', `title.equals=${encodeURIComponent(title)}`);
    if (!album?.id) {
      console.log(`SKIP album photos ${title} (album not found)`);
      continue;
    }
    const existingMedia = await api('GET', 'event-medias', {
      query: `tenantId.equals=${encodeURIComponent(tenantId)}&albumId.equals=${album.id}&size=1`,
    });
    if (existingMedia.ok && rows(existingMedia.data).length > 0) {
      console.log(`SKIP album photos ${title}`);
      continue;
    }
    const files = (item.pics || [])
      .map((src) => localImage(item.dir, src))
      .filter(Boolean)
      .slice(0, 4);
    if (!files.length) console.log(`SKIP album photos ${title} (no local files, pics=${(item.pics || []).length})`);
    for (const [index, filePath] of files.entries()) {
      const filename = path.basename(filePath);
      try {
        let media = await unusedPhoto(filename);
        if (!media) media = await uploadAlbumPhoto(album.id, filePath, index);
        if (media && (await attachToAlbum(media, album.id, index))) {
          console.log(`OK album photo ${filename}`);
        }
      } catch (error) {
        console.error(`FAIL album photo ${filename} ${error.message}`);
      }
    }
  }

  const downloads = [
    ['First term calendar', 'wp-content/uploads/2026/06/FirstTerm.pdf', 'first-term-calendar.pdf'],
    ['Bus routes', 'wp-content/uploads/2026/06/BUSROUTES.pdf', 'bus-routes.pdf'],
  ];
  for (const [title, rel, filename] of downloads) {
    const source = path.join(scrapeRoot, rel);
    if (!fs.existsSync(source)) {
      console.error(`SKIP profile-media-assets missing ${rel}`);
      continue;
    }
    fs.mkdirSync(sampleDir, { recursive: true });
    fs.copyFileSync(source, path.join(sampleDir, filename));
    const fileSizeBytes = fs.statSync(source).size;
    await save('profile-media-assets', `title.equals=${encodeURIComponent(title)}`, {
      title,
      description: title,
      fileUrl: `/school/samples/${filename}`,
      fileType: 'application/pdf',
      mediaKind: 'DOCUMENT',
      fileSizeBytes,
      displayOrder: downloads.findIndex((row) => row[0] === title),
      isDownloadable: true,
      requiresEmail: false,
      createdAt: now,
      updatedAt: now,
    });
  }

  const videoHtml = fs.readFileSync(path.join(scrapeRoot, 'video-gallery', 'index.html'), 'utf8');
  const videoRe =
    /youtube\.com\/embed\/([A-Za-z0-9_-]{11})[\s\S]{0,900}?elementor-heading-title[^>]*>([\s\S]*?)<\/h1>/g;
  const listed = await api('GET', 'gallery-youtube-videos', {
    query: `tenantId.equals=${encodeURIComponent(tenantId)}&size=100`,
  });
  const existingVideos = listed.ok ? rows(listed.data) : [];
  let videoIndex = 0;
  let videoMatch;
  const seenVideoIds = new Set();
  while ((videoMatch = videoRe.exec(videoHtml))) {
    const youtubeId = videoMatch[1];
    if (seenVideoIds.has(youtubeId)) continue;
    seenVideoIds.add(youtubeId);
    const title = clip(htmlToText(videoMatch[2]), 180);
    const youtubeUrl = `https://www.youtube.com/watch?v=${youtubeId}`;
    if (existingVideos.some((row) => String(row.youtubeUrl || '').includes(youtubeId) || row.title === title)) {
      skipped += 1;
      console.log(`SKIP gallery-youtube-videos ${title}`);
      continue;
    }
    if (
      await create('gallery-youtube-videos', {
        title,
        youtubeUrl,
        description: title,
        displayOrder: videoIndex,
        isActive: true,
        createdAt: now,
        updatedAt: now,
      })
    ) {
      created += 1;
    }
    videoIndex += 1;
  }

  console.log(`Done. Created ${created}, skipped ${skipped}.`);
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
