import Cloudflare from "cloudflare";

export const cloudflare = new Cloudflare({
  apiEmail: process.env.CF_EMAIL,
  apiKey: process.env.CF_API_KEY,
});
