# Claude Instructions for LegalAnnotator

## Project Architecture & Engineering Rules
Этот проект следует парадигме **надёжного ИИ-инжиниринга**. 
Главное правило: **сдвигать ответственность максимально вниз по стеку** (от вероятностного языка к детерминированному жёсткому коду).
- **Хуки (`.hooks/`)**: Гарантируют, что критически важные проверки выполняются каждый раз (мгновенно и не могут быть пропущены).
- **Скрипты (`scripts/`)**: Жёсткая надежная логика на Python/Bash. Вызываются через командную строку.
- **Навыки (`skills/`)**: Стандартизированные последовательности действий для агента. Вызывай их по имени.
- **Промпты (`prompts/`)**: Используются только для уникальных новых фич и креативных задач.

## Project Context
- **Framework**: Next.js 14 (App Router)
- **Styling**: Tailwind CSS
- **Database**: PostgreSQL with Prisma ORM
- **Authentication**: NextAuth.js (Auth.js) with Custom Credentials and JWT
- **Language**: TypeScript (`.ts` / `.tsx`)

## Development Guidelines
- Write all new shared React components in `src/components/`, and route-specific components inside their respective `src/app/` folders.
- Use Next.js 14 `App Router` conventions strictly (`page.tsx`, `layout.tsx`, `route.ts`).
- Server actions (`"use server"`) should be the preferred way to mutate data, unless a standard API route is strictly required for external consumption.
- Keep all client components isolated and marked explicitly with `"use client"`. Keep client logic minimal to reduce bundle sizes.
- Use Tailwind utility classes directly in `className` instead of adding custom CSS rules.
- Имена функций и переменных используй в `camelCase`, а компоненты React — в `PascalCase`.
- В Python коде (скриптах) обязательно используй `type hints`.
- **ЗАПРЕТ**: Никогда не храни секреты или пароли в коде! Используй переменные окружения.
- Maintain type safety across all database queries. Let Prisma generate types instead of declaring redundant interfaces for models.
- Any routes that require authentication should be added to the matcher inside `src/middleware.ts`.

## Essential Commands
Краткий список полезных команд. Многие из них автоматизированы в `Makefile`.
- **Dev Server**: `npm run dev`
- **Build**: `npm run build`
- **Tests**: `make test`
- **Linters**: `make lint`
- **Format**: `make format`
- **Security**: `make security-scan`
- **Sync Schema**: `npx prisma db push`
- **Seed Database**: `npm run prisma:seed`
- **View DB Data**: `npx prisma studio`
