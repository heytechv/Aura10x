# Specyfikacja Techniczna Modułu Autentykacji - AURA (MVP v1)

Niniejszy dokument opisuje architekturę i implementację modułu autentykacji w aplikacji AURA. Zgodnie z nowymi wytycznymi, system będzie obsługiwał **wyłącznie logowanie za pomocą adresu e-mail i hasła** dla użytkowników uprzednio utworzonych w panelu Supabase. Rejestracja publiczna oraz logowanie przez dostawców OAuth są wyłączone z zakresu MVP.

## 1. Architektura Interfejsu Użytkownika

### 1.1. Opis Zmian w Warstwie Frontend

#### Strony (Astro)

W celu obsługi procesu logowania, zostanie utworzona następująca strona:

- **`/login`**: Strona zawierająca formularz logowania.

#### Komponenty (React)

Do obsługi interaktywnego formularza logowania zostanie stworzony komponent React:

- **`LoginForm.tsx`**: Komponent renderujący formularz z polami na adres e-mail i hasło oraz przyciskiem "Zaloguj się". Będzie on osadzony na stronie `/login`. Komponent będzie odpowiedzialny za walidację po stronie klienta i komunikację z endpointem API.

#### Nawigacja (`src/components/Navigation.astro`)

- **Tryb `non-auth`**: W nawigacji będzie widoczny przycisk "Zaloguj się", kierujący użytkownika do strony `/login`.
- **Tryb `auth`**:
    - Wyświetlanie nazwy użytkownika (np. "Witaj, {email}").
    - Przycisk "Wyloguj się", który będzie wywoływał endpoint `/api/auth/signout`.

### 1.2. Odpowiedzialność Komponentów

- **Strona Astro (`/login.astro`)**: Odpowiedzialna za routing, renderowanie statycznej zawartości (np. nagłówka) oraz osadzenie interaktywnego komponentu `LoginForm.tsx`.
- **Komponent React (`LoginForm.tsx`)**: Odpowiedzialny za zarządzanie stanem formularza, walidację danych wejściowych po stronie klienta (przy użyciu `zod` i `react-hook-form`), obsługę interakcji użytkownika oraz wysyłanie żądania do API.

### 1.3. Walidacja i Komunikaty Błędów

Walidacja formularza logowania będzie realizowana dwuetapowo:

1.  **Po stronie klienta (React)**: Walidacja formatu adresu e-mail i obecności hasła w celu zapewnienia natychmiastowego feedbacku.
2.  **Po stronie serwera (API Endpoint)**: Ostateczna weryfikacja danych.

Przykładowe komunikaty błędów:
- "Nieprawidłowy format adresu email."
- "Hasło jest wymagane."
- "Nieprawidłowe dane logowania. Spróbuj ponownie."

### 1.4. Scenariusze Użytkownika

- **Logowanie**: Użytkownik wchodzi na stronę `/login`, wprowadza swój e-mail i hasło, a następnie klika "Zaloguj się". Po pomyślnej weryfikacji zostaje przekierowany na stronę główną. W przypadku błędu, na stronie logowania wyświetlany jest odpowiedni komunikat.
- **Wylogowanie**: Użytkownik klika przycisk "Wyloguj się", jego sesja jest kończona, a interfejs wraca do stanu `non-auth`.

## 2. Logika Backendowa

### 2.1. Struktura Endpointów API

Zostaną utworzone następujące endpointy API w `src/pages/api/auth/`:

- **`signin.ts` (POST)**: Obsługuje logowanie użytkownika. Endpoint przyjmuje e-mail i hasło, waliduje je, a następnie wywołuje odpowiednią funkcję Supabase Auth.
- **`signout.ts` (POST)**: Obsługuje wylogowanie użytkownika, kończąc jego sesję.

### 2.2. Walidacja Danych Wejściowych

Dane przychodzące do endpointu `signin.ts` (`email`, `password`) będą walidowane po stronie serwera przy użyciu biblioteki `zod`, aby upewnić się, że są w poprawnym formacie przed przekazaniem ich do Supabase.

### 2.3. Obsługa Wyjątków

Endpointy będą obsługiwać błędy, takie jak nieprawidłowe dane uwierzytelniające (401 Unauthorized), błędy walidacji (400 Bad Request) oraz błędy serwera (500 Internal Server Error), zwracając odpowiednie kody statusu i komunikaty.

### 2.4. Renderowanie Stron Server-Side

Middleware (`src/middleware/index.ts`) pozostaje kluczowym elementem. Będzie on sprawdzał sesję użytkownika na chronionych stronach (np. `/collection`) i w przypadku jej braku, przekierowywał na stronę logowania (`/login`).

## 3. System Autentykacji (Supabase)

### 3.1. Integracja z Supabase Auth

Logika autentykacji będzie oparta o Supabase Auth z wykorzystaniem następujących funkcji:

- **`supabase.auth.signInWithPassword()`**: Gówna funkcja do logowania użytkownika za pomocą e-maila i hasła.
- **`supabase.auth.signOut()`**: Funkcja do wylogowywania użytkownika.

### 3.2. Wykorzystanie `@supabase/ssr`

Biblioteka `@supabase/ssr` będzie nadal używana do bezpiecznego zarządzania sesją i cookies w środowisku SSR, zgodnie z najlepszymi praktykami dla Astro.

### 3.3. Konfiguracja Middleware

Rola middleware pozostaje niezmieniona: będzie tworzyć klienta Supabase dla każdego żądania i udostępniać informacje o sesji w `context.locals`, zapewniając spójność i bezpieczeństwo w całej aplikacji.
