import { createSupabaseServerInstance } from "../db/supabase";
import { defineMiddleware } from "astro:middleware";

const PROTECTED_ROUTES = ["/collection"];

export const onRequest = defineMiddleware(async ({ locals, cookies, url, request, redirect }, next) => {
  const supabase = createSupabaseServerInstance({
    cookies,
    headers: request.headers,
  });

  const {
    data: { user },
  } = await supabase.auth.getUser();

  locals.supabase = supabase;
  locals.user = user;
  locals.session = null; // getUser does not return session, setting to null to satisfy types

  if (!user && PROTECTED_ROUTES.some((route) => url.pathname.startsWith(route))) {
    return redirect(`/login?redirect=${url.pathname}`);
  }

  return next();
});
