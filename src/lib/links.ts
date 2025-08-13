// lib/links.ts

import type { NavItem } from "./nav-types";

export const nav: NavItem[] = [
  {
    type: "folder",
    label: "Dev Envs",
    icon: "/images/logos/code.svg",
    items: [
      {
        type: "link",
        href: "https://dash.cloudflare.com/7e0f91b72f7943b141eab75f059184fa/home/developer-platform",
        label: "Cloudflare",
        icon: "/images/logos/cloudflare.svg",
      },
    ],
  },
  {
    type: "panel",
    title: "Daily",
    initiallyCollapsed: false,
    children: [
      {
        type: "link",
        href: "https://dash.cloudflare.com/7e0f91b72f7943b141eab75f059184fa/home/developer-platform",
        label: "Cloudflare",
        icon: "/images/logos/cloudflare.svg",
      },
      {
        type: "link",
        href: "https://dashboard.stripe.com/dashboard",
        label: "Stripe",
        icon: "/images/logos/stripe.svg",
      },
      {
        type: "link",
        href: "https://chatgpt.com/?model=gpt-4o",
        label: "ChatGPT",
        icon: "/images/logos/chat-gpt.svg",
      },
      {
        type: "folder",
        label: "Google",
        icon: "/images/logos/google-drive.svg",
        items: [
          {
            type: "link",
            href: "https://mail.google.com/mail/u/0/?tab=rm&ogbl#inbox",
            label: "Gmail",
            icon: "/images/logos/gmail.svg",
          },
          {
            type: "link",
            href: "https://drive.google.com/drive/u/0/my-drive",
            label: "Drive",
            icon: "/images/logos/google-drive.svg",
          },
          {
            type: "link",
            href: "https://www.youtube.com/",
            label: "YouTube",
            icon: "/images/logos/youtube.svg",
          },
        ],
      },
    ],
  },
  {
    type: "panel",
    title: "Dev",
    initiallyCollapsed: false,
    children: [
      {
        type: "link",
        href: "https://vercel.com/ayezeeweb",
        label: "Vercel",
        icon: "/images/logos/vercel.svg",
      },
      {
        type: "link",
        href: "https://github.com/aaron-soto",
        label: "GitHub",
        icon: "/images/logos/github.svg",
      },
      {
        type: "link",
        href: "http://localhost:3000",
        label: "NextJS Local",
        icon: "/images/logos/nextjs.svg",
      },
      {
        type: "link",
        href: "http://localhost:4321",
        label: "Astro Local",
        icon: "/images/logos/astro.svg",
      },
      {
        type: "link",
        href: "https://www.svgrepo.com/",
        label: "SVG Repo",
        icon: "/images/logos/svg.svg",
      },
    ],
  },
  {
    type: "panel",
    title: "Social",
    initiallyCollapsed: true,
    children: [
      {
        type: "link",
        href: "https://www.facebook.com/profile.php?id=100089266597260",
        label: "Facebook",
        icon: "/images/logos/facebook.svg",
      },
      {
        type: "link",
        href: "https://www.instagram.com/ayezeewebdesigns/",
        label: "Instagram",
        icon: "/images/logos/instagram.svg",
      },
      {
        type: "link",
        href: "https://www.linkedin.com/in/aaron-soto1/",
        label: "LinkedIn",
        icon: "/images/logos/linkedin.svg",
      },
      {
        type: "link",
        href: "https://www.pinterest.com/aaronmsoto/_saved/",
        label: "Pinterest",
        icon: "/images/logos/pinterest.svg",
      },
    ],
  },
  {
    type: "panel",
    title: "Other",
    initiallyCollapsed: true,
    children: [
      {
        type: "link",
        href: "https://www.notion.so/AyeZee-Web-Designs-1fcb27f0589b80a8aaa7c509cff5848a",
        label: "Notion",
        icon: "/images/logos/notion.svg",
      },
      {
        type: "link",
        href: "https://genqrcode.com/",
        label: "QR Code Gen",
        icon: "/images/logos/qr.svg",
      },
    ],
  },
];
