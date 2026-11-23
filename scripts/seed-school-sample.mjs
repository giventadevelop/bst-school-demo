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
const scrapeRoot = 'F:/project_workspace/christ-nagar-school/christ-nagar-school/christnagarschoolicse.edu.in';
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

function images(main) {
  const found = [];
  const re = /<img\b[^>]*>/g;
  let match;
  while ((match = re.exec(main))) {
    const tag = match[0];
    const src = tag.match(/\ssrc="([^"]+)"/);
    if (!src) continue;
    const url = src[1];
    if (!url.includes('wp-content/uploads')) continue;
    if (/logo|androidapp|cropped-|favicon|\d\.png$/i.test(url)) continue;
    if (/-\d+x\d+\.(jpe?g|png|webp)$/i.test(url)) continue;
    const width = Number((tag.match(/\swidth="(\d+)"/) || [])[1] || 0);
    if (width && width < 180) continue;
    found.push(url);
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
  };
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
];

const facilities = [
  ['library', 'Library', 'library'],
  ['biology-lab', 'Biology lab', 'biology-lab'],
  ['chemistry-lab', 'Chemistry lab', 'chemistry-lab'],
  ['computer-lab', 'Computer lab', 'computer-lab'],
  ['music-room', 'Music room', 'music-room'],
  ['bus', 'School bus', 'bus-facilities'],
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
    const teachers = item.people.slice(0, 2);
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
  for (const [index, person] of kg.people.slice(0, 4).entries()) {
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
  for (const [index, person] of support.people.slice(0, 4).entries()) {
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
    await save('profile-writings', `slug.equals=${slug}`, {
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

  const events = [
    ['School reopening', '2027-06-01', 'events/school-reopening'],
    ['Prathibhotsav arts fest', '2027-01-20', 'events/prathibhotsav-26-arts-fest'],
    ['Merit day', '2027-03-12', 'excellence-in-focus-merit-day-2026'],
  ];
  for (const [title, startDate, rel] of events) {
    const item = bundle(rel);
    await save('event-details', `title.equals=${encodeURIComponent(title)}`, {
      title,
      caption: clip(item.title, 255),
      description: clip(item.body || item.title, 900),
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

  console.log(`Done. Created ${created}, skipped ${skipped}.`);
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
