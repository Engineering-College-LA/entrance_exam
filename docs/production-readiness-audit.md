# Production readiness audit — 17 October 2026

## Verdict and scope

Vercel + Supabase is a reasonable architecture for 1,000 registered students. The reviewed implementation is not ready for a trusted admissions examination or unrestricted production collection of student data until the security and durability issues below are addressed. Buying a larger plan does not fix these issues.

Reviewed repository commit `c2a1cb2`, React/Vite frontend, copied static admin pages, SQL migrations, and Supabase payment functions. Production deployment identity, applied database policies, billing plan, usage metrics, backups, function settings and secrets were not verified. Findings describe repository behavior; where deployed configuration differs, verify it directly. No production data was modified and no load test was run. Only audit documents were added.

## Priority findings

| Priority | Finding and evidence | Required action |
| --- | --- | --- |
| Critical | `supabase/migrations/20260514120000_open_door_registrations.sql`, `20261014090000_paid_exam_registrations.sql`, and Olympiad migrations allow anonymous reads/deletes of registrations. Student and parent contact details are exposed if these policies are deployed. | Replace public access with student ownership and actual staff authorization. Serve payment status through an authenticated owner-scoped endpoint. Test denied reads/writes as anonymous users and as another student. |
| Critical | `20260625000000_create_exams.sql` allows anonymous mutation of questions and exams; `20261017150000_settings_table_and_countdown.sql` allows anonymous settings changes, including the setting consumed as the Olympiad fee. | Restrict mutations to trusted staff roles enforced by the database/server. Public access should expose only intentionally public catalog fields. |
| Critical | `src/static/pages/admin/login.html:131` contains literal credentials; login and roles are local sessionStorage flags (`dashboard.html:1229`). | Replace with Supabase Auth, server-verified staff roles, and staff MFA. Remove shared credentials. Merely hiding the admin URL or changing the password is insufficient. |
| Critical | Tracked `test_db.js`, `test_pooler.js`, `test_pooler_options.js`, `test_pooler_postgres.js`, `test_ipv6.js`, `test_sni.js` contain literal database-password assignments. `.env` is tracked and not excluded. Values were withheld from audit outputs; current validity is unverified. | Rotate any real credentials represented by these literals, replace with environment lookups, add secret scanning and an example env file. Audit Git history. Public Supabase publishable/anon keys are expected in browsers; privileged database passwords and service-role keys are not. |
| High | `src/components/LoginModal.tsx:8` uses fixed test OTP; `src/App.tsx:95` treats a localStorage phone as account identity. | Use verified Supabase sessions and bind records to `auth.uid()`. Replacing only the SMS UI leaves authorization broken. |
| High | `src/App.tsx:115` fetches all questions including `correct`; `src/pages/Exam.tsx:35` grades locally; `src/pages/Report.tsx:64` submits client-calculated grades. Retake prevention is localStorage-based. | Store private answer keys separately, issue server-owned attempts, verify payment eligibility, enforce deadlines/attempt limits, and grade answers on the server. Browser anti-cheat is only a signal. |
| High | Admin templates interpolate database values into `innerHTML`, e.g. `dashboard.html:2346` and `:2423`. Public inputs can reach these fields. | Render user data with text nodes/framework escaping; remove inline event-string interpolation. Add server validation and appropriate security headers as defense in depth. |
| High | Answers/timer are React state (`src/hooks/examHooks.ts:29` and `:56`). Results save asynchronously, only warning on failure (`Report.tsx:84`), after showing a report. | Autosave answers to a durable attempt, use a server deadline, allow reconnect/resume, make submission idempotent, and show confirmed success only after persistence. |
| High at scale | Admin initialization (`dashboard.html:2897`) fetches whole tables without pagination; `App.tsx:115` also fetches the whole question table. Default API row limits can silently truncate results. | Add server-side pagination/search/counts and paginated exports; fetch only the selected exam's safe question fields. Test with more than 1,000 records. |
| Medium | Result and open-door IDs use only client milliseconds (`Report.tsx:41`, `openDoorRegistration.ts:14`). Two students submitting in one millisecond can collide; retries can also duplicate logical operations. | Use server/UUID IDs plus explicit idempotency keys and database uniqueness constraints for business rules. |
| Medium | Payment creation has no application-level user authentication, rate limit or retry idempotency. Webhook updates read status then update without a conditional status predicate; it only handles pending records. Raw headers/body are logged. | Add authenticated ownership, throttling, idempotency, atomic status transitions, provider reconciliation for ambiguous failures, amount/currency verification per provider contract, and redacted logs. Test duplicate and out-of-order webhooks. Signature verification and server-selected prices are good existing foundations. |
| Medium | `PaymentResult.tsx:189` schedules a pending poll based only on status/paymentId. Another pending result leaves dependencies unchanged and does not schedule the next poll. | Use a bounded polling loop with cleanup/backoff; ensure confirmation works if Realtime is unavailable. |
| Medium | Schema setup is split between migrations and root scripts. `events`/`event_id` setup is in `migrate.js`; an applicants creation migration was not found. Static admin pages hardcode a Supabase project. | Establish one reproducible migration path, separate staging from production, centralize environment configuration, and verify a fresh database setup. |

## Capacity and operations

Account count is not simultaneous load. One thousand registrations distributed across days is modest. One thousand students requesting OTPs or submitting exams in the same minute is a different workload and needs measured acceptance tests. Browser REST calls do not each require a dedicated Postgres connection.

An illustrative 1,000 students × 3 attempts × 30 answers produces 90,000 answer rows, normally a manageable relational workload with appropriate indexes; actual storage depends on row shape and indexes. Avoid storing copied question banks or large logs in every submission.

Stage realistic tests with synthetic data: registration, login throttling, exam start bursts, autosave, submission bursts, payment callbacks, reconnects and admin exports. Ramp 50 → 200 → 500 → 1,000 concurrent students if that is the actual peak requirement. Mock SMS and payment delivery during load tests to avoid charges and real transactions. Measure database CPU/memory, p95 latency, errors, lost/duplicate submissions and recovery. An initial acceptance target could be p95 API latency below one second and zero lost or duplicate final submissions; refine against actual user experience.

Budget for Supabase Pro for production continuity/backups, an appropriate Vercel plan, SMS usage and any static-egress gateway. See the companion provider research for current quotas/prices. Do not upgrade compute simply because registered-user count reaches 1,000; use observed load. Free quotas are not an availability guarantee, and backups are not failover.

Monitor failed saves, OTP delivery and abuse, stale pending payments, database usage, uptime and spend. Assign ownership for alerts, restore testing, credential rotation and exam-day support. Define recovery point/time targets and test a restore before a real exam period. Retain minimal student data and define who can export it and when it is deleted.

## Domain and OTP design

Use an admissions subdomain of the college's existing domain if the college controls its DNS and approves that branding, for example `admissions.college.edu.kh` using the spelling supplied by the user. Confirm the exact spelling before changing DNS. There is no need to buy another domain to obtain an outbound IP.

Add the subdomain in Vercel and use the precise DNS record Vercel supplies. Leave existing college website and email records intact. Configure HTTPS, canonical redirects, Supabase site/redirect URLs and the payment return URL. A frontend-domain change does not require moving the existing Supabase webhook URL.

The website's DNS address is an inbound destination. An SMS provider's IP allowlist normally checks the source address of the server making the SMS request. A new domain or CNAME does not establish that source address. Supabase Edge Functions also lack fixed egress IPs; a database IPv4 add-on does not solve function egress.

Nikita SMSPRO's published offer (Appendix 1, section 1) describes IP restrictions as enabled at the customer's request. First confirm whether credential-authenticated HTTPS without an IP allowlist is permitted for this account. If yes, use a Supabase Send SMS hook handled by an Edge Function that calls Nikita directly; no fixed-IP gateway is necessary. The provider's identity is interpreted from the user's mention of Nikita and should be confirmed against their account.

If the account requires a fixed source IP, use:

```text
Student browser → Supabase Auth (OTP issuance/verification)
                         ↓ Send SMS hook
                authenticated SMS gateway with static public egress IP
                         ↓
                       Nikita → student's phone
```

Supabase should manage OTP expiry, verification and sessions. A supported Send SMS hook delivers through a narrowly scoped gateway; authenticate/verify hook requests, restrict destinations/message format, prevent replay, rate limit by phone/IP with allowance for shared college networks, and never create a public arbitrary-SMS relay. Never put Nikita credentials in Vite environment variables or browser code. Confirm hook availability on the selected plan and Nikita delivery coverage, sender approval, pricing and burst limits.

A small managed gateway/static-egress service may be simpler economically than Vercel's static-IP add-on; a self-managed VPS also requires patching, monitoring and recovery. Existing college infrastructure is suitable only if it actually sends the request through a stable public NAT/egress IP and someone operates it reliably. If using Vercel static IPs, SMS requests must execute in correctly configured Vercel functions, not Supabase functions or the browser.

## Execution order

1. Verify deployed policies and credentials immediately; restrict unsafe production access until protected flows are ready. Rotate real exposed secrets.
2. Implement real student/staff authentication and RLS together, with cross-account permission tests.
3. Implement private answer keys, server-authoritative attempts/grading and durable submissions.
4. Confirm Nikita's account-specific IP policy; integrate directly over authenticated HTTPS or through verified static egress as needed. Add abuse controls and delivery monitoring. Review Supabase Auth SMS burst limits before opening registration.
5. Add pagination, idempotency, payment reconciliation and reproducible migrations; move admin code into the maintained application with shared types/services.
6. Establish staging, CI build/lint/security checks and focused integration tests. Set backups, alerts and operating ownership, then run peak-load/recovery tests before launch.

## Verification performed

- `npm run build`: passes; main JS bundle 590.38 kB minified / 159.71 kB gzip, with a chunk-size warning. Code splitting can improve mobile startup but is lower priority than authorization and data durability.
- `npm run lint`: fails with 18 errors and 3 warnings, primarily explicit-any and React hook/purity issues.
- No test script or CI workflow was found in the reviewed project. Root database diagnostic scripts are not an automated application test suite and were not executed.
- No authenticated production dashboard access, live policy verification, Nikita send, restore drill or load test was performed.

## Primary references

- [Supabase query pagination and default row cap](https://supabase.com/docs/reference/javascript/select)
- [Supabase function egress limitations](https://supabase.com/docs/guides/troubleshooting/why-supabase-edge-functions-cannot-provide-static-egress-ips-for-whitelisting-3d78b0)
- [Supabase Send SMS hook](https://supabase.com/docs/guides/auth/auth-hooks/send-sms-hook)
- [Nikita public offer](https://smspro.nikita.kg/kg/oferta.html)
- [Current hosting and OTP provider research](hosting-provider-research.md)
