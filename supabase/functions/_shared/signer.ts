import { constants, createHash, createPublicKey, createSign, createVerify } from 'node:crypto'

/**
 * Finik RSA-SHA256 request/webhook signing. Canonical format:
 *
 *   {method lowercase}\n
 *   {urldecode(path)}\n
 *   host:{host}&{sorted x-api-* headers, lowercased key, joined by &}\n
 *   [query params line, only present when non-empty]\n
 *   {body}
 */
export function canonicalString(
  method: string,
  path: string,
  host: string,
  apiHeaders: Record<string, string>,
  body: Record<string, unknown>,
  queryParams: Record<string, string> = {},
): string {
  const parts = [method.toLowerCase(), decodeURIComponent(path), headersLine(host, apiHeaders)]

  const query = queryLine(queryParams)
  if (query !== '') parts.push(query)

  parts.push(jsonBody(body))

  return parts.join('\n')
}

// Same as canonicalString, but for verifying an INBOUND request (the Finik
// webhook): uses the exact bytes of the body as received, with no
// re-sorting/re-serialization. A sender's signature is computed over what
// it actually transmitted — the webhook's real body isn't top-level-key-
// sorted the way canonicalString()'s reconstruction assumes (confirmed from
// production logs: raw payload leads with "fields", not alphabetically
// first "amount") — so for verification we must sign the literal text.
export function canonicalStringLiteral(
  method: string,
  path: string,
  host: string,
  apiHeaders: Record<string, string>,
  rawBody: string,
  queryParams: Record<string, string> = {},
): string {
  const parts = [method.toLowerCase(), decodeURIComponent(path), headersLine(host, apiHeaders)]

  const query = queryLine(queryParams)
  if (query !== '') parts.push(query)

  parts.push(rawBody)

  return parts.join('\n')
}

function headersLine(host: string, apiHeaders: Record<string, string>): string {
  const lines = [`host:${host}`]
  const keys = Object.keys(apiHeaders).sort()
  for (const key of keys) lines.push(`${key.toLowerCase()}:${apiHeaders[key]}`)
  return lines.join('&')
}

function queryLine(queryParams: Record<string, string>): string {
  const keys = Object.keys(queryParams).sort()
  if (keys.length === 0) return ''
  return keys
    .map((key) => `${encodeURIComponent(key)}=${encodeURIComponent(queryParams[key] ?? '')}`)
    .join('&')
}

function jsonBody(body: Record<string, unknown>): string {
  const keys = Object.keys(body)
  if (keys.length === 0) return ''
  const sorted: Record<string, unknown> = {}
  for (const key of keys.sort()) sorted[key] = body[key]
  return JSON.stringify(sorted)
}

export function sign(data: string, privateKeyPem: string): string {
  return createSign('RSA-SHA256').update(data).end().sign(normalizePem(privateKeyPem, 'PRIVATE KEY'), 'base64')
}

export function verify(
  data: string,
  signatureBase64: string,
  publicKeyPem: string,
  padding: 'pkcs1' | 'pss' = 'pkcs1',
): boolean {
  try {
    return createVerify('RSA-SHA256')
      .update(data)
      .end()
      .verify(
        {
          key: normalizePem(publicKeyPem, 'PUBLIC KEY'),
          padding: padding === 'pss' ? constants.RSA_PKCS1_PSS_PADDING : constants.RSA_PKCS1_PADDING,
        },
        signatureBase64,
        'base64',
      )
  } catch {
    return false
  }
}

// Secret-manager UIs/CLIs routinely mangle multi-line PEM values: the real
// newlines get flattened to literal "\n" text, or the -----BEGIN/END-----
// wrapper gets stripped leaving bare base64. Node's crypto rejects any of
// that outright ("invalid PEM ...") rather than tolerating it, so normalize
// before every use instead of assuming the stored secret is well-formed.
function normalizePem(value: string, label: 'PUBLIC KEY' | 'PRIVATE KEY'): string {
  let pem = value.trim().replace(/\\n/g, '\n').replace(/\r\n/g, '\n')
  if (!pem.includes('-----BEGIN')) {
    const body = pem.replace(/\s+/g, '')
    const lines = body.match(/.{1,64}/g) ?? []
    pem = `-----BEGIN ${label}-----\n${lines.join('\n')}\n-----END ${label}-----`
  }
  return pem
}

// Diagnostic only, never logs the key itself — confirms FINIK_WEBHOOK_PUBLIC_KEY
// actually parses as a usable RSA public key, its size, and a SHA-256
// fingerprint of its DER encoding. The fingerprint is safe to share (it's a
// one-way hash, like an SSH key fingerprint) — send it to Finik support and
// ask them to confirm it matches the public key their webhook signer uses,
// without either side pasting the actual key anywhere.
export function describeKey(publicKeyPem: string): string {
  try {
    const key = createPublicKey(normalizePem(publicKeyPem, 'PUBLIC KEY'))
    const details = key.asymmetricKeyDetails
    const der = key.export({ type: 'spki', format: 'der' })
    const fingerprint = createHash('sha256').update(der).digest('hex')
    return `type=${key.asymmetricKeyType} modulusBits=${details?.modulusLength ?? '?'} sha256=${fingerprint}`
  } catch (err) {
    return `unparseable: ${String(err)}`
  }
}
