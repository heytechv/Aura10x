# Supabase Astro SSR Initialization

This document provides a reproducible guide to create the necessary file structure for integrating Supabase with your Astro project, with a focus on Server-Side Rendering (SSR) and authentication.

## Prerequisites

- Your project should use Astro 5, TypeScript 5, React 19, and Tailwind 4.
- Install the `@supabase/supabase-js` and `@supabase/ssr` packages.
- Ensure that `/supabase/config.toml` exists.
- Ensure that a file `/src/db/database.types.ts` exists and contains the correct type definitions for your database.

IMPORTANT: Check prerequisites before performing actions below. If they're not met, stop and ask a user for the fix.

## File Structure and Setup

### 1. Supabase Client Initialization (`/src/db/supabase.ts`)

Create a file to manage client creation for both browser and server contexts.

```ts
// src/db/supabase.ts
import { createBrowserClient, createServerClient, type CookieOptions } from '@supabase/ssr';
import type { AstroCookies } from 'astro';

const supabaseUrl = import.meta.env.SUPABASE_URL;
const supabaseAnonKey = import.meta.env.SUPABASE_KEY;

export const createSupabaseBrowserClient = () => {
  return createBrowserClient(supabaseUrl, supabaseAnonKey);
};

export const createSupabaseServerClient = (cookies: AstroCookies) => {
  return createServerClient(supabaseUrl, supabaseAnonKey, {
    cookies: {
      get(key: string) {
        return cookies.get(key)?.value;
      },
      set(key: string, value: string, options: CookieOptions) {
        cookies.set(key, value, options);
      },
      remove(key: string, options: CookieOptions) {
        cookies.delete(key, options);
      },
    },
  });
};
```

### 2. Middleware Setup (`/src/middleware/index.ts`)

The middleware is crucial for handling user sessions on the server. It creates a server-side Supabase client for each request and makes it available in the Astro context.

```ts
// src/middleware/index.ts
import { defineMiddleware } from 'astro:middleware';
import { createSupabaseServerClient } from '../db/supabase';

export const onRequest = defineMiddleware(async (context, next) => {
  const supabase = createSupabaseServerClient(context.cookies);

  const {
    data: { session },
  } = await supabase.auth.getSession();

  context.locals.supabase = supabase;
  context.locals.session = session;
  context.locals.user = session?.user ?? null;

  return next();
});
```

### 3. TypeScript Environment Definitions (`src/env.d.ts`)

Update the global types to include the Supabase client, session, and user on the `App.Locals` object.

```ts
// src/env.d.ts
/// <reference types="astro/client" />

import type { SupabaseClient, Session, User } from '@supabase/supabase-js';
import type { Database } from './db/database.types.ts';

declare global {
  namespace App {
    interface Locals {
      supabase: SupabaseClient<Database>;
      session: Session | null;
      user: User | null;
    }
  }
}

interface ImportMetaEnv {
  readonly SUPABASE_URL: string;
  readonly SUPABASE_KEY: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
```

This setup enables full SSR capabilities with Supabase, allowing you to handle authentication (including providers like Google) and manage user sessions securely on the server.