/**
 * Read a request body as text with a strict byte cap, aborting early.
 *
 * Why this exists: `await req.text()` and `await req.json()` both buffer
 * the *entire* incoming body before you can check its size. An attacker
 * can send a chunked request without `Content-Length` and force the
 * runtime to allocate hundreds of MB before any of our caps kick in.
 *
 * This reads the body as a stream and bails the moment we've seen more
 * than `maxBytes`, returning `{ tooLarge: true }` so the caller can
 * respond with HTTP 413 immediately.
 */
export async function readBodyText(
  req: Request,
  maxBytes: number
): Promise<{ tooLarge: true } | { tooLarge: false; text: string }> {
  // Fast-path on declared length.
  const lengthHeader = req.headers.get("content-length")
  if (lengthHeader) {
    const declared = parseInt(lengthHeader, 10)
    if (Number.isFinite(declared) && declared > maxBytes) {
      return { tooLarge: true }
    }
  }

  if (!req.body) {
    return { tooLarge: false, text: "" }
  }

  const reader = req.body.getReader()
  const decoder = new TextDecoder("utf-8")
  let total = 0
  let text = ""

  try {
    while (true) {
      const { value, done } = await reader.read()
      if (done) break
      if (value) {
        total += value.byteLength
        if (total > maxBytes) {
          // Cancel so the upstream stops sending more bytes.
          try {
            await reader.cancel()
          } catch {
            // ignore
          }
          return { tooLarge: true }
        }
        text += decoder.decode(value, { stream: true })
      }
    }
    text += decoder.decode()
  } finally {
    try {
      reader.releaseLock()
    } catch {
      // ignore
    }
  }

  return { tooLarge: false, text }
}
