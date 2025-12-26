# Playlist Archives

A modern web application for archiving and browsing playlists from Spotify and Apple Music. The app scrapes playlist metadata (title, curator, cover image) using Open Graph tags and stores them in a MongoDB database.

## Features

- 🎵 **Playlist Scraping**: Automatically extracts metadata from Spotify and Apple Music playlist URLs
- 🖼️ **Cover Art Display**: Shows playlist cover images with 3D parallax effects
- 🎨 **Gradient Fallbacks**: Generates beautiful gradients when cover images aren't available
- 📱 **Responsive Design**: Modern, dark-mode enabled UI with smooth animations
- 💾 **MongoDB Storage**: Persistent storage of playlist metadata using Prisma ORM

## Tech Stack

- **Framework**: [Next.js](https://nextjs.org) 16 (App Router)
- **Database**: MongoDB with [Prisma](https://www.prisma.io) ORM
- **Styling**: Tailwind CSS with custom animations
- **UI Components**: Radix UI primitives
- **Animations**: Framer Motion, Pixi.js

## Getting Started

### Prerequisites

- Node.js 18+ 
- MongoDB database (local or cloud instance)
- npm, yarn, pnpm, or bun

### Installation

1. **Clone the repository**

```bash
git clone <repository-url>
cd playlist-archives
```

2. **Install dependencies**

```bash
npm install
# or
yarn install
# or
pnpm install
```

3. **Set up environment variables**

Create a `.env` file in the root directory:

```env
DATABASE_URL="mongodb://localhost:27017/playlist-archives"
# or for MongoDB Atlas:
# DATABASE_URL="mongodb+srv://username:password@cluster.mongodb.net/playlist-archives"
```

4. **Set up the database**

```bash
# Generate Prisma client
npm run prisma:generate

# Push schema to database
npm run prisma:db:push
```

5. **Run the development server**

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

6. **Open your browser**

Navigate to [http://localhost:3000](http://localhost:3000) to see the app.

## Usage

### Adding a Playlist

1. Submit a Spotify or Apple Music playlist URL through the UI
2. The app will automatically scrape metadata (title, curator, cover image)
3. The playlist will be saved to the database and displayed in the archive

### API Endpoints

- `GET /api/playlists` - Fetch all archived playlists
- `POST /api/playlists/scrape` - Scrape metadata from a playlist URL

## Development

### Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run start` - Start production server
- `npm run lint` - Run ESLint
- `npm run type-check` - Run TypeScript type checking
- `npm run prisma:generate` - Generate Prisma client
- `npm run prisma:db:push` - Push schema changes to database
- `npm run test:playlist` - Test playlist scraping functionality

## Project Structure

```
playlist-archives/
├── app/                    # Next.js app directory
│   ├── api/               # API routes
│   └── page.tsx           # Main page
├── components/            # React components
│   ├── ui/               # Reusable UI components
│   └── ...
├── lib/                   # Utility functions and services
│   └── services/         # Playlist scraping service
├── prisma/               # Prisma schema
└── public/               # Static assets
```

## Learn More

- [Next.js Documentation](https://nextjs.org/docs)
- [Prisma Documentation](https://www.prisma.io/docs)
- [MongoDB Documentation](https://docs.mongodb.com)
- [Vercel Deployment](https://vercel.com/docs)

## License

MIT
