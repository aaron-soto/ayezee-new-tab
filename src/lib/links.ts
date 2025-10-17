export enum IconType {
  Icon,
  List,
}

export interface Link {
  href?: string;
  label: string;
  icon: string;
  type?: IconType;
  children?: Link[];
}

export const links: Link[] = [
  {
    href: "https://dash.cloudflare.com/7e0f91b72f7943b141eab75f059184fa/home/developer-platform",
    label: "Cloudflare",
    icon: "/images/logos/cloudflare.svg",
  },

  {
    href: "https://chatgpt.com/?model=gpt-4o",
    label: "ChatGPT",
    icon: "/images/logos/chat-gpt.svg",
  },
  {
    href: "https://vercel.com/ayezeeweb",
    label: "Vercel",
    icon: "/images/logos/vercel.svg",
  },

  {
    href: "https://www.youtube.com/",
    label: "YouTube",
    icon: "/images/logos/youtube.svg",
  },
  {
    href: "https://www.facebook.com/profile.php?id=100089266597260",
    label: "Facebook",
    icon: "/images/logos/facebook.svg",
  },
  {
    href: "https://www.instagram.com/ayezeewebdesigns/",
    label: "Instagram",
    icon: "/images/logos/instagram.svg",
  },
  {
    href: "https://www.svgrepo.com/",
    label: "SVG Repo",
    icon: "/images/logos/svg.svg",
  },
  {
    href: "https://www.linkedin.com/in/aaron-soto1/",
    label: "LinkedIn",
    icon: "/images/logos/linkedin.svg",
  },
  {
    href: "https://github.com/aaron-soto",
    label: "GitHub",
    icon: "/images/logos/github.svg",
    type: IconType.List,
    children: [
      {
        href: "https://github.com/aaron-soto/ayezee-new-tab",
        label: "New Tab App",
        icon: "/images/logos/github.svg",
      },
      {
        href: "https://github.com/aaron-soto/copper-country-music-fest",
        label: "Copper Country Music Fest",
        icon: "/images/logos/github.svg",
      },
      {
        href: "https://github.com/aaron-soto/ayezee-frontend",
        label: "AyeZee Frontend",
        icon: "/images/logos/github.svg",
      },
      {
        href: "https://github.com/aaron-soto/security-astro",
        label: "C3 Security & Logistics",
        icon: "/images/logos/github.svg",
      },
      {
        href: "https://github.com/aaron-soto/gerrish-jewelers",
        label: "Gerrish Jewelers",
        icon: "/images/logos/github.svg",
      },
      {
        href: "https://github.com/aaron-soto/william-douglas",
        label: "William Douglas",
        icon: "/images/logos/github.svg",
      },
      {
        href: "https://github.com/aaron-soto/valley-humane-society",
        label: "Valley Humane Society",
        icon: "/images/logos/github.svg",
      },
    ],
  },

  {
    href: "https://www.notion.so/ayezee/AyeZee-Web-Designs-238b27f0589b8033b513fe7643da7e77",
    label: "Notion",
    icon: "/images/logos/notion.svg",
  },
  {
    href: "https://www.pinterest.com/aaronmsoto/_saved/",
    label: "Pinterest",
    icon: "/images/logos/pinterest.svg",
  },
  {
    href: "https://genqrcode.com/",
    label: "QR Code",
    icon: "/images/logos/qr.svg",
  },
  {
    label: "Dev Envs",
    icon: "/images/logos/code.svg",
    type: IconType.List,
    children: [
      {
        href: "http://localhost:3000",
        label: "NextJS (Local)",
        icon: "/images/logos/nextjs.svg",
      },
      {
        href: "http://localhost:4321",
        label: "Astro (Local)",
        icon: "/images/logos/astro.svg",
      },
      {
        href: "https://local.drizzle.studio/",
        label: "Drizzle Studio",
        icon: "/images/logos/drizzle.svg",
      },
    ],
  },
  {
    label: "Google",
    icon: "/images/logos/google.svg",
    type: IconType.List,
    children: [
      {
        href: "https://mail.google.com/mail/u/0/?tab=rm&ogbl#inbox",
        label: "Gmail",
        icon: "/images/logos/gmail.svg",
      },
      {
        href: "https://drive.google.com/drive/u/0/my-drive",
        label: "Google Drive",
        icon: "/images/logos/google-drive.svg",
      },
      {
        href: "https://meet.google.com/landing",
        label: "Google Meet",
        icon: "/images/logos/google-meet.svg",
      },
    ],
  },
  {
    label: "NeonDB",
    href: "https://console.neon.tech/app/projects",
    icon: "/images/logos/neon.svg",
    type: IconType.List,
    children: [
      {
        href: "https://console.neon.tech/app/projects/sparkling-lab-05595948/branches/br-fancy-haze-aebw8l46/tables?database=neondb",
        icon: "/images/logos/neon.svg",
        label: "AyeZee API",
      },
      {
        href: "https://console.neon.tech/app/projects/long-sun-21452980",
        icon: "/images/logos/neon.svg",
        label: "Roping Finder (prod)",
      },
    ],
  },
  {
    label: "Emails",
    type: IconType.List,
    icon: "/images/logos/outlook.svg",
    children: [
      {
        href: "https://outlook.office.com/mail/?sourceId=aaron%40ayezeewebdesigns.com&email=aaron%40ayezeewebdesigns.com",
        label: "aaron@ayezeewebdesigns.com",
        icon: "/images/logos/outlook.svg",
      },
      {
        href: "https://outlook.office.com/mail/?sourceId=info%40ayezeewebdesigns.com&email=info%40ayezeewebdesigns.com",
        label: "info@ayezeewebdesigns.com",
        icon: "/images/logos/outlook.svg",
      },
    ],
  },
  {
    href: "https://dashboard.stripe.com/dashboard",
    label: "Stripe",
    type: IconType.List,
    icon: "/images/logos/stripe.svg",
    children: [
      {
        href: "https://dashboard.stripe.com/b/acct_1Mefw9EgoMTyCvdO",
        label: "AyeZee Web Designs",
        icon: "/images/logos/stripe.svg",
      },
      {
        href: "https://dashboard.stripe.com/b/acct_1RgqDuANnarndnSU",
        label: "C3 Security & Logistics",
        icon: "/images/logos/stripe.svg",
      },
      {
        href: "https://dashboard.stripe.com/b/acct_1PwOyo05fdCYBUXU",
        label: "Purpose After Sports",
        icon: "/images/logos/stripe.svg",
      },
      {
        href: "https://dashboard.stripe.com/b/acct_1RFNHYIOEtOeXCq3",
        label: "Roping Finder",
        icon: "/images/logos/stripe.svg",
      },
    ],
  },
  {
    href: "https://resend.com/emails",
    label: "Resend",
    icon: "/images/logos/resend.svg",
  },
  {
    href: "https://ayezeewebdesigns.com",
    label: "AyeZee Web Designs",
    icon: "/images/logos/ayezee.svg",
  },
  {
    href: "https://www.va.gov",
    label: "VA",
    icon: "/images/logos/VA.svg",
  },
  {
    href: "https://app.relayfi.com/business/ayezee-web-designs/home",
    label: "Relay",
    icon: "/images/logos/relay.svg",
  },
];
