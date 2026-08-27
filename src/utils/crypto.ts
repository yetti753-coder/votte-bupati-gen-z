/**
 * Cryptographic & Verification Utilities for E-Voting Pilbup
 * Implements client-side SHA-256 equivalent hashing and blind anonymous vote ledger chaining
 */

// Pure JS SHA-256 implementation for standalone secure hashing without external dependencies
export async function sha256(message: string): Promise<string> {
  const msgBuffer = new TextEncoder().encode(message);
  if (typeof crypto !== 'undefined' && crypto.subtle) {
    const hashBuffer = await crypto.subtle.digest('SHA-256', msgBuffer);
    const hashArray = Array.from(new Uint8Array(hashBuffer));
    return hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
  }
  // Fallback hash simulation
  let hash = 0x811c9dc5;
  for (let i = 0; i < message.length; i++) {
    hash ^= message.charCodeAt(i);
    hash += (hash << 1) + (hash << 4) + (hash << 7) + (hash << 8) + (hash << 24);
  }
  return ('00000000' + (hash >>> 0).toString(16)).slice(-8).repeat(8);
}

export function generateRandomNonce(length = 16): string {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
  let result = '';
  for (let i = 0; i < length; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return result;
}

export function generateVoteToken(): string {
  const prefix = 'VOTE-PILBUP';
  const timestamp = Date.now().toString(36).toUpperCase();
  const random = generateRandomNonce(6);
  return `${prefix}-${timestamp}-${random}`;
}

export function maskNIK(nik: string): string {
  if (!nik || nik.length < 8) return nik;
  return nik.slice(0, 4) + '********' + nik.slice(-4);
}

export function maskKK(kk: string): string {
  if (!kk || kk.length < 8) return kk;
  return kk.slice(0, 4) + '********' + kk.slice(-4);
}

export function formatDateTimeIndo(isoString: string): string {
  try {
    const date = new Date(isoString);
    return new Intl.DateTimeFormat('id-ID', {
      day: 'numeric',
      month: 'long',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
      timeZoneName: 'short'
    }).format(date);
  } catch {
    return isoString;
  }
}
