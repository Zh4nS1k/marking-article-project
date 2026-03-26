# LegalAnnotator

LegalAnnotator is a Next.js 14 application designed for reviewing, status-tracking, and annotating legal documents with ease and security.

## Features
- **Next.js 14 App Router**: Modern and fast architecture.
- **Tailwind CSS**: Responsive, beautiful UI.
- **Prisma & PostgreSQL**: Robust relational data modeling.
- **NextAuth.js**: Custom credentials provider with JWT sessions and role-based access.
- **Protected Routes**: Secure `/admin` and `/dashboard` paths.

## Local Setup

1. **Install Dependencies**
   ```bash
   npm install
   ```

2. **Database Configuration**
   Configure `.env` directly and update `DATABASE_URL` with your PostgreSQL connection string.

3. **Run Migrations & Seed Data**
   ```bash
   npx prisma db push
   npm run prisma:seed
   ```
   *Note: Seed data inserts a default Admin user (`admin@legalannotator.com` / `password123`) and a few sample articles.*

4. **Start Development Server**
   ```bash
   npm run dev
   ```

Open [http://localhost:3000](http://localhost:3000) to view the application in your browser.
