# Deployment Guide: LegalAnnotator

This guide provides instructions on how to run LegalAnnotator locally, deploy it to a production environment like Vercel or Render, and troubleshoot common deployment issues.

## 1. How to Deploy Locally

To run the application on your own machine for development or local usage:

### Prerequisites
- [Node.js](https://nodejs.org/) (v18 or newer recommended)
- A PostgreSQL database (e.g., local Postgres installation, Docker container, or Supabase).

### Steps
1. **Install Dependencies:**
   ```bash
   npm install
   ```

2. **Configure Environment Variables:**
   Rename `.env.example` to `.env` (or create a new `.env` file in the root directory) and set up the required variables:
   ```env
   DATABASE_URL="postgresql://user:password@localhost:5432/legalannotator?schema=public"
   NEXTAUTH_URL="http://localhost:3000"
   NEXTAUTH_SECRET="your-super-secret-local-key"
   ```

3. **Initialize the Database:**
   Push the Prisma schema to your database and generate the client.
   ```bash
   npx prisma db push
   npx prisma generate
   ```

4. **Seed Initial Data:**
   Create the default admin user and sample articles.
   ```bash
   npm run prisma:seed
   ```

5. **Start the Development Server:**
   ```bash
   npm run dev
   ```
   The app will be available at `http://localhost:3000`.

---

## 2. How to Deploy Publicly

### Option A: Deploying on Vercel (Recommended for Next.js)

Vercel provides seamless deployment for Next.js applications, but requires specific database connection handling due to its serverless architecture.

1. **Push your code to GitHub/GitLab/Bitbucket.**
2. **Import Project to Vercel:**
   - Log in to Vercel and click "Add New" -> "Project" and select your repository.
3. **Configure Environment Variables:**
   Before clicking deploy, add the following variables in the Vercel dashboard:
   - `NEXTAUTH_SECRET`: Generate a secure string (e.g., using `openssl rand -base64 32`).
   - `NEXTAUTH_URL`: Your Vercel domain (e.g., `https://legal-annotator.vercel.app`).
   - `DATABASE_URL`: Your production PostgreSQL connection string. 
     *Critical Serverless Note*: Ensure you use a **connection pooler URI** and append `?pgbouncer=true&connection_limit=1` to prevent exhausting database connections during serverless cold starts.
4. **Set Build Commands:**
   - Build Command: `npx prisma generate && next build`
   - Install Command: `npm install`
5. **Deploy:** Click "Deploy". Vercel will build and host your application.
6. **Migrate Production DB:**
   You will need to manually push your schema and seed the production database from your local machine:
   ```bash
   DATABASE_URL="your-production-db-url" npx prisma db push
   DATABASE_URL="your-production-db-url" npm run prisma:seed
   ```

### Option B: Deploying on Render (Standard Node.js Environment)

Render acts as a traditional server environment rather than serverless, which is easier for robust, long-running database connections but initially takes slightly longer to spin up.

1. **Push your code to GitHub/GitLab/Bitbucket.**
2. **Create a Web Service on Render:**
   - Connect your repository and set the Environment to **Node**.
3. **Configure Build and Run Commands:**
   - Build Command: `npm install && npx prisma generate && next build`
   - Start Command: `npm run start`
4. **Configure Environment Variables:**
   Add `DATABASE_URL`, `NEXTAUTH_URL`, and `NEXTAUTH_SECRET` in the Render dashboard. Note: On Render, you can use the standard direct database connection string (no need for `pgbouncer=true`).
5. **Deploy:** Render will automatically build and start your server. Ensure you have migrated your production DB locally first (Step 6 of Vercel).

---

## 3. How to Debug Errors with Deployment

If your deployment fails or the app crashes in production, check these common issues:

### "Server Error" on Login / NextAuth Issues
- **Symptom:** You click login, the page refreshes immediately, or you see a 500 Server Error.
- **Fix:** Ensure `NEXTAUTH_SECRET` is set in your production environment. Without it, NextAuth cannot encrypt session tokens and will crash. Also, ensure `NEXTAUTH_URL` matches your exact production domain (including `https://`).

### Database Exhaustion / Prisma Timeout Errors
- **Symptom:** `PrismaClientInitializationError: Can't reach database server` or `Timeout fetching a connection from the pool`.
- **Fix (Serverless/Vercel):** You are likely opening too many connections simultaneously. Ensure your `DATABASE_URL` uses the pooler port (often 6543 instead of 5432) and includes the `?pgbouncer=true` flag.
- **Fix (General):** Check if your database provider (e.g., Supabase, Neon, AWS RDS) requires your IP or Vercel's outbound IP addresses to be whitelisted.

### Schema Mismatch in Production
- **Symptom:** The app builds successfully but errors out at runtime, complaining that a table or column doesn't exist yet.
- **Fix:** The production database schema is out of sync with your Prisma schema in the code. Run `DATABASE_URL="<production-url>" npx prisma db push` from your local terminal to update the remote database.

### Build Failures ("next build" fails)
- **Symptom:** Deployment stops during the build phase with TypeScript or ESLint errors shown in the deployment logs.
- **Fix:** Check the Vercel/Render build logs. Ensure you can successfully run `npm run build` locally before pushing to GitHub. Next.js enforces extremely strict type checking during the production build step, meaning any loose types or unused variables will block deployment.
