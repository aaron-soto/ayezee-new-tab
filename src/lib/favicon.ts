/**
 * Utility functions for fetching favicons
 */

/**
 * Extracts the domain from a URL
 * @param url - The full URL
 * @returns The domain name (e.g., "google.com")
 */
export function extractDomain(url: string): string | null {
  try {
    // If URL doesn't have a protocol, add it
    const urlWithProtocol = url.startsWith("http") ? url : `https://${url}`;
    const urlObj = new URL(urlWithProtocol);
    return urlObj.hostname.replace(/^www\./, "");
  } catch {
    return null;
  }
}

/**
 * Fetches the favicon URL from the Vemetric API
 * @param url - The website URL or domain
 * @returns The favicon URL from the API
 */
export function getFaviconUrl(url: string): string | null {
  const domain = extractDomain(url);
  if (!domain) return null;

  return `https://favicon.vemetric.com/${domain}`;
}

/**
 * Fetches the favicon as a Blob from the Vemetric API
 * @param url - The website URL or domain
 * @returns The favicon as a Blob, or null if failed
 */
export async function fetchFaviconAsBlob(url: string): Promise<Blob | null> {
  const faviconUrl = getFaviconUrl(url);
  if (!faviconUrl) return null;

  try {
    const response = await fetch(faviconUrl);
    if (!response.ok) return null;

    return await response.blob();
  } catch (error) {
    console.error("Failed to fetch favicon:", error);
    return null;
  }
}
