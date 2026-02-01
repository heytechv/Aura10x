# AURA (MVP v1)

A digital perfume collection manager designed to help users curate and browse their personal fragrance shelf.

## Overview

AURA is a web desktop application that addresses the "paradox of choice" faced by perfume enthusiasts. By providing a dedicated, aesthetic interface ("Midnight Mode") for your collection, it helps you rediscover and appreciate the fragrances you own.

**Key Features:**
- **My Collection**: Build your digital perfume shelf by adding fragrances from our global database.
- **Midnight Mode**: A dedicated dark mode interface for browsing your collection.
- **Cloud Sync**: Your collection is securely stored and accessible from any desktop browser via Supabase Auth.
- **Search & Discover**: Find perfumes to add to your collection easily.

## Tech Stack

- **Framework**: [Astro](https://astro.build/) v5
- **Frontend**: [React](https://react.dev/) v19, [Tailwind CSS](https://tailwindcss.com/) v4
- **Backend/DB**: [Supabase](https://supabase.com/) (PostgreSQL, Auth)
- **Testing**: Vitest, Playwright

## Getting Started

### Prerequisites

- Node.js v22.14.0 (see `.nvmrc`)
- npm

### Installation

1.  Clone the repository:
    ```bash
    git clone https://github.com/heytechv/Aura10x.git
    cd Aura10x
    ```

2.  Install dependencies:
    ```bash
    npm install
    ```

3.  Environment Setup:
    Copy `.env.example` to `.env` and fill in your Supabase credentials.
    ```bash
    cp .env.example .env
    ```

    Required variables:
    - `SUPABASE_URL`
    - `SUPABASE_KEY`

4.  Run the development server:
    ```bash
    npm run dev
    ```

## Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run test` - Run unit tests (Vitest)
- `npm run test:e2e` - Run E2E tests (Playwright)
- `npm run lint` - Run linting

## Project Structure

- `src/pages` - Application routes
- `src/components` - Astro and React components
- `src/lib/services` - Business logic and Supabase integrations
- `src/db` - Database types and clients
- `.ai/prd.md` - Product Requirements Document

## Documentation

For detailed requirements and specifications, please refer to the [PRD](.ai/prd.md).
