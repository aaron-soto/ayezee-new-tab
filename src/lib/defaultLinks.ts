import { Link } from "./links";

/**
 * Default links that will be seeded for new users on first sign-in
 * Customize this array to set what links new users should start with
 */
export const defaultLinks: Link[] = [
  {
    href: "https://www.google.com",
    label: "Google",
    icon: "/images/logos/google.svg",
  },
  {
    href: "https://github.com",
    label: "GitHub",
    icon: "/images/logos/github.svg",
  },
  {
    href: "https://www.youtube.com",
    label: "YouTube",
    icon: "/images/logos/youtube.svg",
  },
  {
    href: "https://chatgpt.com",
    label: "ChatGPT",
    icon: "/images/logos/chat-gpt.svg",
  },
];
