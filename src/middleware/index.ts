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
