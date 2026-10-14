import { createSign, createVerify } from 'node:crypto'

/**
 * Finik RSA-SHA256 request/webhook signing — ported 1:1 from the official
 * Finik npm package's canonical-string algorithm (confirmed against a real
 * working integration), NOT a generic guess. Canonical format:
 *
 *   {method lowercase}\n
 *   {rawurldecode(path)}\n
 *   host:{host}&{sorted x-api-* headers, lowercased key, joined by &}\n
 *   [query params line, only present when non-empty]\n
 *   {JSON body with only TOP-LEVEL keys sorted alphabetically; nested
 *    objects like "Data" keep their original key order; empty body -> ''}
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
  return createSign('RSA-SHA256').update(data).end().sign(privateKeyPem, 'base64')
}

export function verify(
  data: string,
  signatureBase64: string,
  publicKeyPem: string,
): boolean {
  try {
    return createVerify('RSA-SHA256')
      .update(data)
      .end()
      .verify(publicKeyPem, signatureBase64, 'base64')
  } catch {
    return false
  }
}
