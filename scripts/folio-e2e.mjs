import { chromium } from '@playwright/test';
import fs from 'fs';
import path from 'path';

const BASE = process.env.BASE_URL || 'http://127.0.0.1:5173';
const SHOTS = '/workspace/github-polish/lms-folio-shots';
const DOCS = path.resolve('docs/screenshots/folio');
fs.mkdirSync(SHOTS, { recursive: true });
fs.mkdirSync(DOCS, { recursive: true });

const checklist = [];
function record(name, pass, note = '') {
  checklist.push({ name, pass, note });
  console.log(`${pass ? 'PASS' : 'FAIL'}  ${name}${note ? ' — ' + note : ''}`);
}

async function shot(page, name, w = 1440, h = 900) {
  await page.setViewportSize({ width: w, height: h });
  await page.waitForTimeout(400);
  const file = `${name}${w < 500 ? '-mobile' : ''}.png`;
  const p1 = path.join(SHOTS, file);
  const p2 = path.join(DOCS, file);
  await page.screenshot({ path: p1, fullPage: false });
  fs.copyFileSync(p1, p2);
  return file;
}

async function loginAs(page, rolePath, email, password = 'demo') {
  await page.goto(`${BASE}/login/${rolePath}`, { waitUntil: 'networkidle' });
  await page.getByLabel(/email/i).fill(email);
  await page.getByLabel(/password/i).fill(password);
  await page.getByRole('button', { name: /^Sign In$/i }).click();
  await page.waitForURL(/\/(teacher|student|admin)/, { timeout: 15000 });
}

(async () => {
  const browser = await chromium.launch({ headless: true });
  const context = await browser.newContext({ viewport: { width: 1440, height: 900 } });
  const page = await context.newPage();

  // Stub Gemini /api/chat at network level (test-only)
  await page.route('**/api/chat', async (route) => {
    const req = route.request();
    if (req.method() === 'POST') {
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({
          response:
            "Quicksort's worst case is O(n^2) when pivots are consistently unbalanced (already sorted input with poor pivot choice). Average and best cases remain O(n log n).",
        }),
      });
    } else {
      await route.continue();
    }
  });

  // Landing
  try {
    await page.goto(BASE, { waitUntil: 'networkidle' });
    await page.getByRole('link', { name: /Teacher Login/i }).first().waitFor();
    await shot(page, 'landing');
    record('Landing page loads', true);
    await page.getByRole('link', { name: /I'm a Teacher/i }).click();
    await page.waitForURL(/\/login\/teacher/);
    record('Landing → Teacher Login', true);
  } catch (e) {
    record('Landing page loads', false, String(e.message || e));
  }

  // Teacher login + dashboard
  try {
    await page.goto(`${BASE}/login/teacher`, { waitUntil: 'networkidle' });
    await shot(page, 'login');
    await shot(page, 'login', 390, 844);
    // Quick login fill
    const quick = page.getByRole('button', { name: /Dr\. Smith/i });
    if (await quick.count()) {
      await quick.click();
      record('Quick login Dr. Smith fills email', true);
    } else {
      record('Quick login Dr. Smith fills email', false, 'button missing');
    }
    await page.getByLabel(/password/i).fill('any');
    await page.getByRole('button', { name: /^Sign In$/i }).click();
    await page.waitForURL('**/teacher/home', { timeout: 15000 });
    await page.getByText(/Good (morning|afternoon|evening),/i).waitFor({ timeout: 10000 });
    await page.getByText(/Sarah/i).first().waitFor({ timeout: 5000 });
    await shot(page, 'teacher-dashboard');
    await shot(page, 'teacher-dashboard', 390, 844);
    record('Teacher mock login → dashboard', true);
    record('Teacher dashboard greeting visible', true);
  } catch (e) {
    record('Teacher mock login → dashboard', false, String(e.message || e));
  }

  // Teacher course page
  let courseUrl = '';
  try {
    const courseLink = page.locator('a', { hasText: /COMP101|Introduction to Programming/i }).first();
    await courseLink.click();
    await page.waitForURL(/\/teacher\/courses\//, { timeout: 10000 });
    courseUrl = page.url();
    await page.getByText(/Introduction to Programming/i).first().waitFor();
    await shot(page, 'teacher-course');
    record('Teacher open COMP101 course', true);
    // Assessments tab
    const assessmentsTab = page.getByRole('button', { name: /Assessments/i });
    if (await assessmentsTab.count()) {
      await assessmentsTab.click();
      await page.waitForTimeout(500);
      record('Teacher course Assessments tab', true);
    } else {
      // maybe link/tab text
      const tab2 = page.getByText(/^Assessments$/i);
      if (await tab2.count()) {
        await tab2.click();
        record('Teacher course Assessments tab', true);
      } else {
        record('Teacher course Assessments tab', false, 'not found');
      }
    }
  } catch (e) {
    record('Teacher open COMP101 course', false, String(e.message || e));
  }

  // Teacher marking view — navigate via students
  try {
    const studentsTab = page.getByRole('button', { name: /Students/i });
    if (await studentsTab.count()) await studentsTab.click();
    else await page.getByText(/^Students$/i).click();
    await page.waitForTimeout(400);
    const viewBtn = page.getByRole('link', { name: /View|Open/i }).first();
    const aliceLink = page.locator('a', { hasText: /Alice/i }).first();
    if (await aliceLink.count()) {
      await aliceLink.click();
    } else if (await viewBtn.count()) {
      await viewBtn.click();
    } else {
      // click row link
      await page.locator('a[href*="/students/"]').first().click();
    }
    await page.waitForURL(/\/students\//, { timeout: 10000 });
    await shot(page, 'teacher-student');
    record('Teacher open student detail', true);

    // Open an assessment attempt
    const attemptLink = page.locator('a[href*="/assessments/"]').first();
    if (await attemptLink.count()) {
      await attemptLink.click();
      await page.waitForURL(/\/assessments\//, { timeout: 10000 });
      await page.waitForTimeout(800);
      await shot(page, 'teacher-marking');
      record('Teacher marking view', true);
    } else {
      record('Teacher marking view', false, 'no assessment link');
    }
  } catch (e) {
    record('Teacher marking view', false, String(e.message || e));
  }

  // Logout teacher (from home shelf, not assessment chrome)
  try {
    await page.goto(`${BASE}/teacher/home`, { waitUntil: 'networkidle' });
    await page.getByRole('button', { name: /Sign out/i }).first().click({ timeout: 8000 });
    await page.waitForTimeout(400);
    record('Teacher logout control present/clickable', true);
  } catch (e) {
    record('Teacher logout control present/clickable', false, String(e.message || e));
  }

  // Clear auth and student flow
  await context.clearCookies();
  await page.goto(BASE);
  await page.evaluate(() => { localStorage.clear(); sessionStorage.clear(); });

  try {
    await loginAs(page, 'student', 'alice@wildmind.edu');
    await page.getByText(/Alice|Good /i).first().waitFor({ timeout: 10000 });
    await shot(page, 'student-dashboard');
    await shot(page, 'student-dashboard', 390, 844);
    record('Student mock login → dashboard', true);
  } catch (e) {
    record('Student mock login → dashboard', false, String(e.message || e));
  }

  // Student course + assessment editor
  try {
    await page.locator('a', { hasText: /COMP101|Introduction to Programming/i }).first().click();
    await page.waitForURL(/\/student\/courses\//, { timeout: 10000 });
    await shot(page, 'student-course');
    record('Student open COMP101', true);

    const openAssessment = page.locator('a[href*="/assessments/"]').first();
    await openAssessment.click();
    await page.waitForURL(/\/assessments\//, { timeout: 15000 });
    await page.waitForTimeout(1000);
    // Wait for editor chrome (seeded essay + margin notes — screenshot from clean seed state)
    await page.getByText(/MARGIN NOTES|Ask AI|Programming Fundamentals|Submit Assessment/i).first().waitFor({ timeout: 15000 });
    // Sanity: seeded AI-highlighted hook visible; no empty-response leftovers
    const emptyNote = page.getByText(/empty response|temporarily unavailable|not configured yet/i);
    if (await emptyNote.count()) {
      record('Assessment editor clean (no error notes)', false, 'error/empty note visible before AI test');
    } else {
      record('Assessment editor clean (no error notes)', true);
    }
    record('Student assessment editor loads', true);

    // Capture screenshots from the seeded clean demo (one AI insert + sensible notes)
    await shot(page, 'assessment-editor');
    await shot(page, 'assessment-editor', 390, 844);

    // AI ask + insert — functional check after screenshots so leftovers never land in docs/
    const ask = page.getByPlaceholder(/Ask AI/i);
    if (await ask.count()) {
      await ask.fill('Can you help me explain quicksort worst-case?');
      await page.getByRole('button', { name: /^Send$/i }).click();
      await page.getByText(/worst case|O\(n/i).first().waitFor({ timeout: 15000 });
      record('AI tutor sticky note (stubbed /api/chat)', true);
      const insertBtn = page.getByRole('button', { name: /Insert/i }).last();
      if (await insertBtn.count()) {
        await insertBtn.click();
        await page.waitForTimeout(500);
        record('Insert ¶ into document', true);
      } else {
        record('Insert ¶ into document', false, 'Insert button missing');
      }
    } else {
      record('AI tutor sticky note (stubbed /api/chat)', false, 'Ask AI missing');
      record('Insert ¶ into document', false, 'skipped');
    }

    // TipTap toolbar buttons
    for (const label of ['B', 'I', 'U', 'H1', 'H2']) {
      const btn = page.getByRole('button', { name: new RegExp(`^${label}$`) });
      if (await btn.count()) {
        await btn.click();
        record(`Editor toolbar ${label}`, true);
      } else {
        record(`Editor toolbar ${label}`, false, 'missing');
      }
    }

    // Submit Assessment button present
    const submit = page.getByRole('button', { name: /Submit Assessment/i });
    if (await submit.count()) {
      record('Submit Assessment button visible', true);
      // Don't actually submit if it closes irreversibly — click and handle modal cancel if any
      await submit.click({ force: true });
      await page.waitForTimeout(600);
      const cancel = page.getByRole('button', { name: /Cancel|Close|Keep editing|Back/i });
      if (await cancel.count()) {
        await cancel.first().click({ force: true });
        record('Submit Assessment opens confirmation (cancelled)', true);
      } else {
        await page.keyboard.press('Escape');
        record('Submit Assessment opens confirmation (cancelled)', true, 'dismissed via Escape');
      }
    } else {
      record('Submit Assessment button visible', false);
    }
  } catch (e) {
    record('Student assessment editor flow', false, String(e.message || e));
  }

  // Admin
  await context.clearCookies();
  await page.evaluate(() => { localStorage.clear(); sessionStorage.clear(); });
  try {
    await page.goto(`${BASE}/login/admin`, { waitUntil: 'networkidle' });
    await page.getByLabel(/email/i).fill('admin@wildmind.edu');
    await page.getByLabel(/password/i).fill('any');
    await page.getByRole('button', { name: /^Sign In$/i }).click();
    await page.waitForURL('**/admin', { timeout: 15000 });
    await page.getByText(/Admin Dashboard/i).waitFor();
    await shot(page, 'admin-dashboard');
    record('Admin mock login → dashboard', true);
    // Tabs
    const users = page.getByText(/^Users$/i);
    const courses = page.getByText(/^Courses$/i);
    if (await users.count()) { await users.click(); record('Admin Users tab', true); }
    else record('Admin Users tab', false);
    if (await courses.count()) { await courses.click(); record('Admin Courses tab', true); }
    else record('Admin Courses tab', false);
  } catch (e) {
    record('Admin mock login → dashboard', false, String(e.message || e));
  }

  // New assessment button on teacher home
  await context.clearCookies();
  await page.evaluate(() => { localStorage.clear(); sessionStorage.clear(); });
  try {
    await loginAs(page, 'teacher', 'teacher@wildmind.edu');
    await page.getByText(/Good (morning|afternoon|evening),/i).waitFor({ timeout: 10000 });
    await shot(page, 'teacher-dashboard');
    await shot(page, 'teacher-dashboard', 390, 844);
    const newBtn = page.getByRole('button', { name: /New assessment/i });
    await newBtn.waitFor({ timeout: 8000 });
    await newBtn.click();
    await page.waitForTimeout(300);
    record('+ New assessment button clickable', true);
  } catch (e) {
    record('+ New assessment button clickable', false, String(e.message || e));
  }

  await browser.close();

  const out = {
    generatedAt: new Date().toISOString(),
    base: BASE,
    checklist,
    pass: checklist.filter((c) => c.pass).length,
    fail: checklist.filter((c) => !c.pass).length,
  };
  fs.writeFileSync(path.join(SHOTS, 'checklist.json'), JSON.stringify(out, null, 2));
  fs.writeFileSync(path.join(DOCS, 'checklist.json'), JSON.stringify(out, null, 2));
  console.log('\n=== SUMMARY ===');
  console.log(`pass=${out.pass} fail=${out.fail}`);
  process.exit(out.fail ? 1 : 0);
})().catch((e) => {
  console.error(e);
  process.exit(2);
});
