# AyeZee New Tab

A modern, customizable new tab dashboard with user authentication and drag-and-drop link management. Built for productivity and personalization.

![AyeZee New Tab](./public/images/screenshot.webp)

## ✨ Features

- 🔐 **User Authentication** - Secure login system with NextAuth.js
- 🎨 **Custom Link Tiles** - Add your favorite sites with custom icons
- 🖱️ **Drag & Drop Reordering** - Organize links exactly how you want
- 📁 **Nested Links** - Create parent links with dropdown child links
- 🔍 **Real-time Search** - Instantly filter your links
- ☁️ **Cloud Icon Storage** - Upload custom icons stored on Cloudinary
- 🌅 **Dynamic Greeting** - Personalized welcome based on time of day
- ⏰ **Live Clock** - Always know the current time
- 💡 **Tips & Tricks** - Helpful shortcuts displayed on the dashboard
- 📱 **Responsive Design** - Works seamlessly across devices

## 🔧 Tech Stack

**Frontend**
- Next.js 15.3 (App Router)
- React 19
- Tailwind CSS v4
- Framer Motion (animations)
- @dnd-kit (drag and drop)
- Zustand (state management)

**Backend & Database**
- PostgreSQL
- Drizzle ORM
- NextAuth.js
- Docker (containerized database)

**Cloud Services**
- Cloudinary (icon storage)

## 🚀 Getting Started

### Prerequisites

- Node.js 20+
- Docker and Docker Compose
- Cloudinary account

### Installation

1. **Clone the repository**
```bash
git clone https://github.com/aaron-soto/ayezee-new-tab.git
cd ayezee-new-tab
```

2. **Install dependencies**
```bash
npm install
```

3. **Set up environment variables**

Create a `.env` file:
```env
DATABASE_URL=postgresql://postgres:postgres@localhost:5432/ayezee_new_tab
NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=your-secret-key-here
CLOUDINARY_CLOUD_NAME=your-cloud-name
CLOUDINARY_API_KEY=your-api-key
CLOUDINARY_API_SECRET=your-api-secret
```

4. **Start the database**
```bash
npm run docker:up
```

5. **Initialize the database**
```bash
npm run db:push
npm run db:seed-user  # Optional: seed with sample data
```

6. **Run the development server**
```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

## 📋 Key Commands

```bash
# Development
npm run dev              # Start dev server
npm run build           # Build for production
npm run start           # Start production server

# Database
npm run db:push         # Push schema changes
npm run db:studio       # Open Drizzle Studio
npm run db:seed-user    # Seed with sample data

# Docker
npm run docker:up       # Start PostgreSQL
npm run docker:down     # Stop PostgreSQL
npm run docker:logs     # View logs
```

## 🎯 Usage

**Adding Links**
1. Click "Add Link" button
2. Enter label and URL
3. Upload a custom icon or use default
4. Save to add to your dashboard

**Organizing Links**
- Drag tiles to reorder them
- Right-click for context menu options
- Add child links to create dropdowns
- Use the search bar to filter links

**Settings**
- Update your profile information
- Upload a profile picture
- Customize your display name

## 📁 Project Structure

```
src/
├── app/
│   ├── api/              # API routes (links, auth, user)
│   ├── login/            # Login page
│   ├── settings/         # User settings
│   └── page.tsx          # Main dashboard
├── components/           # React components
│   ├── tiles/           # Link tile components
│   └── icons/           # Icon components
├── hooks/               # Custom React hooks
└── lib/
    ├── db/              # Database schema & queries
    ├── stores/          # Zustand state stores
    └── types/           # TypeScript types
```

## 📝 License

MIT

## 👤 Author

**Aaron Soto** - [@aaron-soto](https://github.com/aaron-soto)
