import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Mail, Lock, ArrowLeft } from "lucide-react";

export default function LoginForm() {
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
          <form className="space-y-5">
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
                  required
                  className="pl-9 h-10"
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
                  type="password" 
                  required 
                  placeholder="Wprowadź swoje hasło"
                  className="pl-9 h-10"
                />
              </div>
            </div>

            <Button type="submit" className="w-full h-10 font-medium">
              Zaloguj się
            </Button>
          </form>
        </div>
      </div>
    </div>
  );
}
