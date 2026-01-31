import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Mail, Lock, ArrowLeft, Loader2 } from "lucide-react";

export default function LoginForm() {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);

    const formData = new FormData(e.currentTarget);
    const email = formData.get("email") as string;
    const password = formData.get("password") as string;

    // Basic client-side validation
    if (!email || !email.includes("@")) {
      setError("Nieprawidłowy format adresu email.");
      setIsLoading(false);
      return;
    }
    if (!password) {
      setError("Hasło jest wymagane.");
      setIsLoading(false);
      return;
    }

    try {
      const response = await fetch("/api/auth/signin", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Wystąpił błąd podczas logowania");
      }

      // Redirect logic
      const params = new URLSearchParams(window.location.search);
      const redirectPath = params.get("redirect") || "/";
      window.location.href = redirectPath;
      
    } catch (err) {
      setError(err instanceof Error ? err.message : "Wystąpił nieoczekiwany błąd");
      setIsLoading(false);
    }
  };

  return (
    <div 
      className="mx-auto"
      style={{ width: "100%", maxWidth: "400px" }}
    >
      {/* Back Button */}
      <div className="mb-8 flex justify-start">
        <a 
          href="/" 
          className="flex items-center justify-center w-10 h-10 rounded-lg bg-muted/50 hover:bg-muted transition-colors border border-border/40"
          aria-label="Powrót do strony głównej"
        >
          <ArrowLeft className="h-5 w-5 text-muted-foreground" />
        </a>
      </div>

      {/* Header outside the card */}
      <div className="space-y-8">
        <div className="text-center space-y-2">
          <h1 className="text-3xl font-bold tracking-tight">Witaj z powrotem</h1>
          <p className="text-muted-foreground text-sm">
            Zaloguj się do swojego konta, aby kontynuować
          </p>
        </div>

        {/* Card containing the form */}
        <div className="bg-card text-card-foreground rounded-xl border shadow-sm p-6 sm:p-8">
          <form className="space-y-5" onSubmit={handleSubmit}>
            {error && (
              <div className="p-3 text-sm text-red-500 bg-red-50 dark:bg-red-900/10 border border-red-200 dark:border-red-800 rounded-md">
                {error}
              </div>
            )}
            
            <div className="space-y-2">
              <label htmlFor="email" className="text-sm font-medium block">
                Adres email
              </label>
              <div className="relative">
                <div className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground/80 pointer-events-none">
                  <Mail className="h-4 w-4" />
                </div>
                <Input
                  id="email"
                  name="email"
                  type="email"
                  placeholder="Wprowadź swój email"
                  required
                  className="pl-9 h-10"
                  disabled={isLoading}
                  data-test-id="login-email-input"
                />
              </div>
            </div>
            
            <div className="space-y-2">
              <label htmlFor="password" className="text-sm font-medium block">
                Hasło
              </label>
              <div className="relative">
                <div className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground/80 pointer-events-none">
                  <Lock className="h-4 w-4" />
                </div>
                <Input 
                  id="password"
                  name="password"
                  type="password" 
                  required 
                  placeholder="Wprowadź swoje hasło"
                  className="pl-9 h-10"
                  disabled={isLoading}
                  data-test-id="login-password-input"
                />
              </div>
            </div>

            <Button type="submit" className="w-full h-10 font-medium" disabled={isLoading} data-test-id="login-submit-btn">
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Logowanie...
                </>
              ) : (
                "Zaloguj się"
              )}
            </Button>
          </form>
        </div>
      </div>
    </div>
  );
}
