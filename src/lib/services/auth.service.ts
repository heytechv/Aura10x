import type { LoginFormInputs } from "@/components/auth/loginForm.schema";

export const loginUser = async (credentials: LoginFormInputs): Promise<void> => {
  const response = await fetch("/api/auth/signin", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(credentials),
  });

  if (!response.ok) {
    const data = await response.json();
    throw new Error(data.error || "Wystąpił błąd podczas logowania");
  }

  // Odpowiedź nie zawiera body w przypadku sukcesu, więc nic nie zwracamy
};
