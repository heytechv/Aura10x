import type { APIRoute } from 'astro';
import { createSupabaseServerInstance } from '../../../db/supabase';
import { z } from 'zod';

const signinSchema = z.object({
  email: z.string().email(),
  password: z.string().min(1),
});

export const POST: APIRoute = async ({ request, cookies }) => {
  try {
    const body = await request.json();
    const result = signinSchema.safeParse(body);

    if (!result.success) {
      return new Response(JSON.stringify({ error: 'Nieprawidłowe dane wejściowe' }), {
        status: 400,
      });
    }

    const { email, password } = result.data;
    const supabase = createSupabaseServerInstance({ cookies, headers: request.headers });

    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      return new Response(JSON.stringify({ error: 'Nieprawidłowe dane logowania. Spróbuj ponownie.' }), {
        status: 401,
      });
    }

    return new Response(JSON.stringify({ user: data.user }), {
      status: 200,
    });
  } catch (e) {
    return new Response(JSON.stringify({ error: 'Wystąpił błąd serwera' }), {
      status: 500,
    });
  }
};
