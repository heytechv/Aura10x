/* eslint-disable react-compiler/react-compiler */
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Mail, Lock, ArrowLeft, Loader2 } from "lucide-react";
import { loginSchema, type LoginFormInputs } from "./loginForm.schema";
import { loginUser } from "@/lib/services/auth.service";

export default function LoginForm() {
  const {
    register,
    handleSubmit,
    setError,
    formState: { errors, isSubmitting },
  } = useForm<LoginFormInputs>({
    resolver: zodResolver(loginSchema),
  });

  const onSubmit = async (data: LoginFormInputs) => {
    try {
      await loginUser(data);
      const params = new URLSearchParams(window.location.search);
      const redirectPath = params.get("redirect") || "/";
      window.location.href = redirectPath;
    } catch (err) {
      setError("root.serverError", {
        type: "custom",
        message: err instanceof Error ? err.message : "Wystąpił nieoczekiwany błąd",
      });
    }
  };

  return (
    <div className="mx-auto" style={{ width: "100%", maxWidth: "400px" }}>
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
          <p className="text-muted-foreground text-sm">Zaloguj się do swojego konta, aby kontynuować</p>
        </div>

        {/* Card containing the form */}
        <div className="bg-card text-card-foreground rounded-xl border shadow-sm p-6 sm:p-8">
          <form className="space-y-5" onSubmit={handleSubmit(onSubmit)}>
            {errors.root?.serverError && (
              <div className="p-3 text-sm text-red-500 bg-red-50 dark:bg-red-900/10 border border-red-200 dark:border-red-800 rounded-md">
                {errors.root.serverError.message}
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
                  type="email"
                  placeholder="Wprowadź swój email"
                  className="pl-9 h-10"
                  disabled={isSubmitting}
                  data-test-id="login-email-input"
                  {...register("email")}
                />
              </div>
              {errors.email && <p className="text-sm text-red-500 font-medium">{errors.email.message}</p>}
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
                  type="password"
                  placeholder="Wprowadź swoje hasło"
                  className="pl-9 h-10"
                  disabled={isSubmitting}
                  data-test-id="login-password-input"
                  {...register("password")}
                />
              </div>
              {errors.password && <p className="text-sm text-red-500 font-medium">{errors.password.message}</p>}
            </div>

            <Button
              type="submit"
              className="w-full h-10 font-medium"
              disabled={isSubmitting}
              data-test-id="login-submit-btn"
            >
              {isSubmitting ? (
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
