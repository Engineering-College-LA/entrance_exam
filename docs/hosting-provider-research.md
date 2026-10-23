# Hosting, capacity, and OTP research

Checked against official documentation on 2026-10-17. These are published allowances, not measurements of this deployment or guarantees of concurrent exam capacity. No production settings were changed.

## Supabase capacity and subscriptions

| Resource | Free | Pro |
| --- | --- | --- |
| Starting monthly price | $0 | $25, including one Micro project |
| Monthly active Auth users | 50,000 | 100,000 |
| Database | 500 MB | 8 GB included |
| Object storage | 1 GB | 100 GB included |
| Uncached egress | 5 GB | 250 GB included |
| Automatic database backups | Not included | Daily, seven-day retention |
| Inactivity pause | After one week | No inactivity pause |

The paid subscription includes $10 compute credit; extra projects, larger compute, and usage can add costs. Micro has 1 GB RAM and published direct/pooler connection limits of 60/200. Those are database connections, not a limit of 200 students. [Supabase pricing](https://supabase.com/pricing).

**Assessment:** 1,000 registered accounts alone does not require an upgrade. A production admissions system should nevertheless budget for Pro for operational reliability and backups. One thousand simultaneous examinees is a separate workload requiring representative load tests; account allowances do not establish throughput.

Supabase Realtime includes 200 peak connections on Free and 500 on Pro, with paid overage listed separately. These are Realtime connections, not general HTTP users. Only apply this allowance if the application actually uses Realtime. [Billing reference](https://supabase.com/docs/guides/platform/billing-on-supabase).

Database backups exclude uploaded Storage objects. Back those up separately and rehearse restoration. [Backup limitations](https://supabase.com/docs/guides/platform/backups).

## Vercel and baseline budget

Vercel Hobby is limited to personal, non-commercial use. A college's operational admissions application should budget for Pro or obtain explicit eligibility confirmation; being educational is not itself confirmation of personal use. [Hobby documentation](https://vercel.com/docs/plans/hobby).

Pro currently has a $20/month platform fee, includes one deploying seat and $20 infrastructure usage credit; additional deploying seats cost $20/month each. Usage and add-ons can increase the bill. [Pro documentation](https://vercel.com/docs/plans/pro-plan).

**Planning estimate:** one Supabase Micro production project plus one Vercel Pro deploying seat starts around **$45/month**, excluding taxes, SMS, extra compute, backups outside the service, and overages. This is a baseline, not a fixed-price capacity guarantee.

## OTP: domain versus outgoing IP

An app domain identifies where visitors connect. An SMS provider's source-IP allowlist normally checks where the server's outgoing request originates. Changing DNS or buying a new domain does not change that origin. First confirm whether the provider means an outbound source IP, a callback URL, or domain verification; these require different configuration.

Vercel offers Static IPs on Pro/Enterprise. Published price is **$100/month per project plus regional Private Data Transfer**. Outbound function traffic uses a shared static IP pair per region; this does not provide a dedicated inbound website IP and does not apply to edge Routing Middleware. If SMS is sent from Supabase, enabling Vercel Static IPs alone cannot affect it. [Static IP documentation](https://vercel.com/docs/networking/static-ips).

Implementation choices, subject to the provider's requirements:

1. Prefer a compatible SMS service that authenticates server requests with credentials without mandatory source-IP allowlisting, if local delivery and pricing are suitable.
2. If the existing provider requires IP allowlisting, route the actual SMS call through Vercel Functions with Static IPs, or through a small authenticated relay on hosting with a fixed outbound IP. A relay adds patching, monitoring, and availability responsibilities; do not expose an unrestricted SMS proxy.
3. Supabase's Send SMS Hook supports regional/custom providers while Supabase handles its Auth OTP flow. Authenticate hook requests, keep SMS credentials server-side, and send from the hosting environment whose outbound IP is allowlisted. [Send SMS Hook](https://supabase.com/docs/guides/auth/auth-hooks/send-sms-hook).

Supabase Auth defaults to 30 SMS/hour project-wide and a 60-second resend interval per user. Its built-in email provider is limited to two emails/hour. These settings must be reviewed before an admission rush; IP-based login/verification limits also matter for students sharing campus Wi-Fi. These limits describe Supabase Auth, not independently implemented OTP endpoints. [Auth rate limits](https://supabase.com/docs/guides/auth/rate-limits).

Configure CAPTCHA and sending limits to control abuse and SMS cost; validate provider delivery to the actual student phone networks. [Phone authentication](https://supabase.com/docs/guides/auth/phone-login).

### Nikita provider clarification

If the provider is SMSPRO by Nikita in Kyrgyzstan, its public offer, Appendix 1 section 1, describes API IP restrictions as enabled **at the customer's request**. This suggests a fixed IP may not be mandatory for every account. Confirm the applicable account configuration and contract with Nikita before purchasing network infrastructure. [Nikita public offer](https://smspro.nikita.kg/kg/oferta.html).

Its official XML API documents login/password authentication and HTTPS endpoints, error code 3 for an invalid sender IP, and a separate delivery-report callback URL. These establish that sender-IP checks and callback hosting are distinct. Use HTTPS only and keep credentials in backend secrets; the PDF includes plain-HTTP examples that should not be copied into production. Message acceptance is distinct from delivery, so monitor delivery reports. The sample SMS price in the document is illustrative, not a current quote. [Nikita XML API](https://smspro.nikita.kg/kg/documents/smspro.nikita.kg-XML-api.pdf).

**Recommended order:** confirm credential-only HTTPS access is permitted for this account; if yes, integrate Nikita server-side without static-IP spending. If the account requires allowlisting, use an authenticated fixed-egress relay or Vercel Static IPs and register the actual outbound IP(s). Preserve the college domain exactly as supplied until its spelling and DNS ownership are confirmed.

## Recommended domain setup

Use `admissions.college.edu.kh` or `exam.college.edu.kh`, assuming the college controls that domain and approves the name. A separate purchased domain offers no remedy for outbound IP allowlisting and adds renewal/ownership work.

Add the chosen subdomain in the Vercel project's Domains settings, then create only the corresponding CNAME at the existing DNS provider using the exact target Vercel displays. Leave the college's root website, MX/email, and other DNS records intact. Verify TLS and routing. Vercel documents subdomain CNAME configuration and cautions that moving nameservers requires preserving existing records. [Custom-domain setup](https://vercel.com/docs/domains/working-with-domains/add-a-domain).

Then update application origin, permitted redirects, OAuth callbacks if used, and OTP webhook configuration as appropriate to the implementation. Test registration, resend, login, exam submission, and administrative access on the final hostname.

## Evidence still needed before declaring production readiness

- Actual plan, compute size, usage graphs, region, deployed revision, and deployed schema/policies.
- Expected simultaneous users and registration/login burst; actual payload sizes, query latency, and write patterns.
- SMS provider name, source-IP/callback requirements, delivery price, sender registration, and throughput.
- Representative staging tests including shared-IP sign-ins, simultaneous answer saves/submissions, slow networks, retries, and restoration.

Suggested engineering acceptance targets (not provider guarantees): no lost or duplicate submissions, no unauthorized cross-student access, less than 1% failed application requests during the agreed load, and p95 critical API latency below one second under that load. Set final thresholds with the college and measure them before exam day.
