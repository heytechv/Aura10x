import { z } from "zod";

export const loginSchema = z.object({
  email: z.string().email("Nieprawidłowy format adresu email."),
  password: z.string().min(1, "Hasło jest wymagane."),
});

export type LoginFormInputs = z.infer<typeof loginSchema>;
