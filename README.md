# LegalAnnotator

LegalAnnotator is a Next.js 14 application designed for reviewing, status-tracking, and annotating legal documents with ease and security.

## Project Architecture (Reliable AI Engineering)
Этот проект следует парадигме **надёжного ИИ-инжиниринга** (сдвиг ответственности максимально вниз по стеку от вероятностного языка агента к детерминированному коду):
- **`.hooks/`**: Исполняемые скрипты для Git-событий (pre-commit, post-merge, pre-push).
- **`scripts/`**: Детерминированная логика (Python, Bash) для форматирования, безопасности и валидации.
- **`skills/`**: Модульные навыки (наборы действий) для автоматизации рабочих процессов ИИ (напр., `create_pr`).
- **`prompts/`**: Заготовки и шаблоны промптов для уникальных задач.
- **`tests/`**: Модульные тесты для скриптов инфраструктуры.

Все компоненты связаны между собой и автоматизированы через `Makefile`.

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
