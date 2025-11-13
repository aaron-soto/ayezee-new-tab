# 🌐 AyeZee New Tab# 🛍 AyeZee New Tab

A modern, customizable new tab dashboard with user authentication, drag-and-drop link management, and cloud-based icon storage. Built for productivity and personalization.A minimalist custom new tab page built with **Next.js 15.3** and **Tailwind CSS v4**. This is my personal dashboard for quick access to frequently used tools, platforms, and resources.

![AyeZee New Tab](./public/images/screenshot.webp)

## ✨ Features---

- 🔐 **User Authentication** - Secure login system with NextAuth.js## 🔧 Tech Stack

- 🎨 **Customizable Dashboard** - Personalized link tiles with custom icons

- 🖱️ **Drag & Drop** - Reorder your links with smooth animations- **Next.js 15.3**

- 📁 **Nested Links** - Organize related links with parent-child relationships- **Tailwind CSS v4**

- ☁️ **Cloud Storage** - Icons stored on Cloudinary for reliability- Custom SVG icons stored in `/public/images/logos`

- 🌅 **Dynamic Greeting** - Time-based personalized welcome messages- Centralized links stored in [`src/lib/links.ts`](./src/lib/links.ts)

- ⏰ **Live Clock** - Real-time display in the corner

- 🎭 **Animated Background** - Beautiful gradient animations---

- 📱 **Responsive Design** - Works seamlessly across devices

## 📂 Project Structure

## 🔧 Tech Stack

````txt

### Frontend.

- **Next.js 15.3** - React framework with App Router├── public/

- **React 19** - Latest React features│   └── images/

- **Tailwind CSS v4** - Utility-first styling│       └── logos/        # SVG icons used in the dashboard

- **Framer Motion** - Smooth animations├── src/

- **@dnd-kit** - Drag and drop functionality│   ├── lib/

│   │   └── links.ts      # Array of dashboard links

### Backend & Database│   └── app/              # App directory for routing (Next.js 15)

- **PostgreSQL** - Primary database├── tailwind.config.ts

- **Drizzle ORM** - Type-safe database queries└── README.md

- **NextAuth.js** - Authentication system```

- **Docker** - Containerized PostgreSQL setup

---

### Cloud Services

- **Cloudinary** - Image/icon storage and optimization## ✨ Features

- **Cloudflare** - CDN and additional services

- Lightweight and fast

## 📋 Prerequisites- Dark mode styling

- Personalized greeting with time-based message

- Node.js 20+ - Easy to update – just add to `links.ts`

- Docker and Docker Compose (for local database)

- Cloudinary account (for icon storage)---



## 🚀 Getting Started## 🚀 Getting Started



### 1. Clone the Repository```bash

npm run install

```bashnpm run dev

git clone https://github.com/aaron-soto/ayezee-new-tab.git```

cd ayezee-new-tab

```Open [http://localhost:3000](http://localhost:3000) to view it in your browser.



### 2. Install Dependencies---



```bash## 🔗 Add Your Own Links

npm install

```Modify [`src/lib/links.ts`](./src/lib/links.ts):



### 3. Environment Setup```ts

export const links = [

Create a `.env` file in the root directory:  {

    name: "Cloudflare",

```env    href: "https://cloudflare.com",

# Database    icon: "/images/logos/cloudflare.svg",

DATABASE_URL=postgresql://postgres:postgres@localhost:5432/ayezee_new_tab  },

  ...

# NextAuth];

NEXTAUTH_URL=http://localhost:3000```

NEXTAUTH_SECRET=your-secret-key-here

Place matching icons in `/public/images/logos`.

# Cloudinary

CLOUDINARY_CLOUD_NAME=your-cloud-name---

CLOUDINARY_API_KEY=your-api-key

CLOUDINARY_API_SECRET=your-api-secret## 💠 Plans

````

- Add section grouping (e.g. Dev, Social, Tools)

### 4. Start PostgreSQL Database- Favicon preview

- Search box

````bash- Keyboard shortcuts

npm run docker:up

```---



This starts a PostgreSQL container using Docker Compose.## 🧠 Why?



### 5. Initialize DatabaseJust a fun productivity boost — faster access, less distractions, and I get to control the experience.



```bash---

# Push schema to database

npm run db:push## 🗪 License



# (Optional) Seed with sample dataMIT

npm run db:seed-user
````

### 6. Run Development Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

## 📂 Project Structure

```
ayezee-new-tab/
├── src/
│   ├── app/                      # Next.js app directory
│   │   ├── api/                  # API routes
│   │   │   ├── auth/            # NextAuth endpoints
│   │   │   ├── links/           # Link CRUD operations
│   │   │   └── user/            # User profile management
│   │   ├── login/               # Login page
│   │   ├── settings/            # User settings
│   │   └── page.tsx             # Main dashboard
│   ├── components/              # React components
│   │   ├── tiles/              # Link tile components
│   │   └── icons/              # Icon components
│   ├── hooks/                   # Custom React hooks
│   ├── lib/                     # Utilities and core logic
│   │   ├── db/                 # Database schema and connection
│   │   ├── stores/             # Zustand state management
│   │   └── types/              # TypeScript types
│   └── public/                  # Static assets
├── docker-compose.yml           # PostgreSQL container config
├── drizzle.config.ts           # Drizzle ORM configuration
└── package.json
```

## 🎯 Usage

### Adding Links

1. Click the **Add Link** button
2. Enter the label and URL
3. Upload a custom icon or use a default one
4. Optionally create nested child links
5. Links are automatically saved to your account

### Organizing Links

- **Drag & Drop** - Click and drag tiles to reorder
- **Context Menu** - Right-click tiles for additional options
- **Child Links** - Create dropdown menus by adding child links

### Customizing Your Profile

Navigate to Settings to update your profile information and preferences.

## 🗄️ Database Scripts

```bash
# Push schema changes to database
npm run db:push

# Open Drizzle Studio (visual database editor)
npm run db:studio

# Generate migrations
npm run db:generate

# Run migrations
npm run db:migrate

# Seed database with sample data
npm run db:seed-user
```

## 🐳 Docker Commands

```bash
# Start PostgreSQL container
npm run docker:up

# Stop PostgreSQL container
npm run docker:down

# View PostgreSQL logs
npm run docker:logs
```

## 🛠️ Development

### Building for Production

```bash
npm run build
npm run start
```

### Linting

```bash
npm run lint
```

## 🏗️ Architecture

### Authentication Flow

- NextAuth.js handles user sessions
- Credentials provider with bcrypt password hashing
- Drizzle adapter for database integration

### Data Management

- Links are user-specific and stored in PostgreSQL
- Drizzle ORM provides type-safe queries
- Real-time updates through React state management

### Icon Storage

- Icons uploaded to Cloudinary
- Automatic optimization and CDN delivery
- Public IDs stored in database for reference

## 🔜 Roadmap

- [ ] Search functionality for links
- [ ] Keyboard shortcuts
- [ ] Themes and color customization
- [ ] Import/export link collections
- [ ] Browser extension
- [ ] Mobile app

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## 📝 License

This project is licensed under the MIT License.

## 👤 Author

**Aaron Soto**

- GitHub: [@aaron-soto](https://github.com/aaron-soto)

---

Built with ❤️ using Next.js and modern web technologies.
