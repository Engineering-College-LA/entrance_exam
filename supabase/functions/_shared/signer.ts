import { constants, createHash, createPublicKey, createSign, createVerify } from 'node:crypto'

/**
 * Finik RSA-SHA256 request/webhook signing — ported 1:1 from Finik's own
 * reference PHP Signer class (verified: their sample payload + beta pubkey
 * + signature round-trips through this exact algorithm). Canonical format:
 *
 *   {method lowercase}\n
 *   {urldecode(path)}\n
 *   host:{host}&{sorted x-api-* headers, lowercased key, joined by &}\n
 *   [query params line, only present when non-empty]\n
 *   {JSON body with only TOP-LEVEL keys sorted alphabetically; nested
 *    objects like "fields" keep their original key order; empty body -> '';
 *    slashes/unicode left unescaped — matches PHP's
 *    JSON_UNESCAPED_SLASHES|JSON_UNESCAPED_UNICODE, which JSON.stringify
 *    already does by default}
 *
 * Finik always re-sorts top-level body keys before signing, regardless of
 * what order the body is actually transmitted in — so verification must
 * reconstruct the same sorted JSON, not hash the literal received bytes.
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

export function verify(data: string, signatureBase64: string, publicKeyPem: string): boolean {
  try {
    return createVerify('RSA-SHA256')
      .update(data)
      .end()
      .verify(
        {
          key: normalizePem(publicKeyPem, 'PUBLIC KEY'),
          padding: constants.RSA_PKCS1_PADDING,
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
