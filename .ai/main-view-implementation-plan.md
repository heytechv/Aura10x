
# Plan implementacji widoku: Strona Główna

## 1. Przegląd
Widok Strony Głównej (`/`) jest publicznym punktem wejścia do aplikacji AURA. Jego głównym celem jest przedstawienie kluczowej wartości produktu nowym użytkownikom oraz zachęcenie ich do podjęcia działania — założenia konta lub przejścia do swojej kolekcji, jeśli są już zalogowani. Interfejs będzie utrzymany w jasnej tonacji (Light Mode), zgodnie z założeniami PRD, i skupi się na prostocie oraz czytelności przekazu.

## 2. Routing widoku
Widok będzie dostępny pod główną ścieżką aplikacji:
- **Ścieżka**: `/`

Plik odpowiedzialny za ten widok to `src/pages/index.astro`.

## 3. Struktura komponentów
Struktura będzie oparta na komponentach Astro, aby zapewnić maksymalną wydajność dla tej w dużej mierze statycznej strony.

```
/src/layouts/Layout.astro
└── /src/pages/index.astro (Strona Główna)
    ├── /src/components/Navigation.astro
    └── /src/components/HeroSection.astro
```

- **`Layout.astro`**: Główny szablon strony, zawierający podstawową strukturę HTML, nagłówek (`<head>`) i globalne style.
- **`index.astro`**: Główny plik strony, który pobiera sesję użytkownika z `Astro.locals` i renderuje komponenty podrzędne.
- **`Navigation.astro`**: Komponent paska nawigacyjnego, wyświetlający logo, link do kolekcji oraz dynamiczny obszar użytkownika (przycisk logowania lub informacje o profilu).
- **`HeroSection.astro`**: Główna sekcja treści, zawierająca nagłówek, krótki opis aplikacji i główne wezwanie do działania (CTA).

## 4. Szczegóły komponentów

### `Navigation.astro`
- **Opis komponentu**: Wyświetla główną nawigację aplikacji. Jego zawartość częściowo zależy od stanu zalogowania użytkownika.
- **Główne elementy**:
  - Logo aplikacji (link do `/`).
  - Link nawigacyjny "Moja Kolekcja" (link do `/collection`).
  - Kontener warunkowy, który renderuje:
    - Przycisk "Zaloguj się" (komponent `<Button>`) dla gości.
    - Ikonę profilu z menu rozwijanym dla zalogowanych użytkowników (implementacja w przyszłości, na razie może to być prosty tekst).
- **Obsługiwane interakcje**:
  - Kliknięcie w logo przenosi na stronę główną.
  - Kliknięcie w "Moja Kolekcja" przenosi do widoku kolekcji.
  - Kliknięcie w "Zaloguj się" przekierowuje do procesu autoryzacji.
- **Obsługiwana walidacja**: Brak.
- **Typy**: `Astro.locals.session` (`Session | null` z `@supabase/supabase-js`).
- **Propsy**: Brak (dane o sesji pobierane bezpośrednio z `Astro.locals`).

### `HeroSection.astro`
- **Opis komponentu**: Centralny element strony głównej, mający za zadanie przyciągnąć uwagę użytkownika i wyjaśnić cel aplikacji.
- **Główne elementy**:
  - Nagłówek `<h1>` z głównym hasłem marketingowym.
  - Paragraf `<p>` z krótkim opisem korzyści płynących z używania AURA.
  - Przycisk wezwania do działania (CTA), np. `components/ui/button`.
- **Obsługiwane interakcje**:
  - Kliknięcie przycisku CTA.
- **Obsługiwana walidacja**: Brak.
- **Typy**: Brak.
- **Propsy**:
  - `isLoggedIn: boolean`: Determinuje tekst i docelowy link przycisku CTA.

## 5. Typy
Dla tego widoku nie są wymagane żadne nowe, niestandardowe typy. Będziemy korzystać z typów dostarczanych przez Supabase, które są już dostępne globalnie w aplikacji dzięki `src/env.d.ts`:
- **`Session`**: Obiekt sesji z `@supabase/supabase-js`, dostępny poprzez `Astro.locals.session`.
- **`User`**: Obiekt użytkownika z `@supabase/supabase-js`, dostępny jako `Astro.locals.user`.

## 6. Zarządzanie stanem
Zarządzanie stanem odbywa się wyłącznie po stronie serwera w ramach cyklu żądania i odpowiedzi (SSR).
- Middleware (`src/middleware/index.ts`) jest odpowiedzialne za weryfikację sesji użytkownika przy każdym żądaniu.
- Stan sesji (`session`, `user`) jest wstrzykiwany do `Astro.locals`.
- Komponent `src/pages/index.astro` odczytuje ten stan i przekazuje go jako propsy do komponentów podrzędnych (`HeroSection.astro`) lub komponenty same go odczytują.
- Nie ma potrzeby stosowania hooków ani zarządzania stanem po stronie klienta (np. w React), ponieważ widok jest statyczny.

## 7. Integracja API
Widok nie wykonuje żadnych bezpośrednich zapytań do API w celu pobrania danych. Integracja z backendem (Supabase) jest abstrakcyjna i sprowadza się do odczytania danych o sesji użytkownika, które zostały już przygotowane przez middleware.

Przycisk logowania będzie linkiem do strony logowania.
- **Działanie**: Przekierowuje użytkownika do strony logowania.

## 8. Interakcje użytkownika
- **Użytkownik niezalogowany (Gość)**:
  - Widzi przycisk "Zaloguj się" w nawigacji.
  - Przycisk CTA w sekcji Hero ma tekst np. "Stwórz swoją kolekcję" i prowadzi do strony logowania (`/login`).
- **Użytkownik zalogowany**:
  - Zamiast przycisku logowania widzi ikonę swojego profilu w nawigacji.
  - Przycisk CTA w sekcji Hero ma tekst np. "Przejdź do kolekcji" i prowadzi bezpośrednio do widoku `/collection`.

## 9. Warunki i walidacja
Jedynym warunkiem weryfikowanym w logice widoku jest stan zalogowania użytkownika.
- **Warunek**: `Astro.locals.session !== null`
- **Komponenty, których dotyczy**: `Navigation.astro`, `HeroSection.astro`.
- **Wpływ na interfejs**:
  - Zmienia treść i linki przycisków.
  - Warunkowo renderuje elementy interfejsu w nawigacji (przycisk logowania vs. menu użytkownika).

## 10. Obsługa błędów
Widok jest statyczny, więc ryzyko wystąpienia błędów jest minimalne.
- **Scenariusz**: Błąd po stronie middleware podczas pobierania sesji.
- **Obsługa**: Middleware powinno być zaprojektowane tak, aby w przypadku błędu `Astro.locals.session` miało wartość `null`. Dzięki temu strona główna bezpiecznie wyrenderuje się w wariancie dla gościa, nie przerywając działania aplikacji. Użytkownik nie zobaczy komunikatu o błędzie, a jedynie publiczną wersję strony.

## 11. Kroki implementacji
1. **Utworzenie komponentu `HeroSection.astro`**:
   - Stworzyć plik `/src/components/HeroSection.astro`.
   - Dodać strukturę HTML: nagłówek `<h1>`, paragraf `<p>` oraz komponent przycisku `<Button>` z `shadcn/ui`.
   - Dodać logikę w `---` frontmatter do przyjmowania propsa `isLoggedIn: boolean`.
   - Dynamicznie ustawić tekst i atrybut `href` przycisku na podstawie wartości `isLoggedIn`.
2. **Modyfikacja komponentu `Navigation.astro`**:
   - Jeśli komponent nie istnieje, stworzyć go w `/src/components/Navigation.astro`.
   - Dodać logikę odczytującą `Astro.locals.session` do sprawdzenia stanu zalogowania.
   - Zaimplementować warunkowe renderowanie: pokazywać przycisk "Zaloguj się" (z linkiem do `/login`) lub menu użytkownika.
3. **Aktualizacja strony `index.astro`**:
   - W pliku `/src/pages/index.astro` zaimportować i wykorzystać komponenty `Navigation.astro` i `HeroSection.astro` wewnątrz `Layout.astro`.
   - Pobrać stan zalogowania z `Astro.locals.session` i przekazać go jako prop do `HeroSection.astro`.
4. **Stworzenie strony logowania (jeśli nie istnieje)**:
   - Utworzyć plik strony, który będzie obsługiwał logowanie przez Supabase.
5. **Stylowanie**:
   - Użyć klas Tailwind CSS do ostylowania wszystkich nowych komponentów zgodnie z ogólnym designem aplikacji (Light Mode).
6. **Weryfikacja i testy**:
   - Sprawdzić, czy strona renderuje się poprawnie dla użytkownika zalogowanego i niezalogowanego.
   - Zweryfikować, czy wszystkie linki i przyciski CTA działają zgodnie z oczekiwaniami.
   - Upewnić się, że strona spełnia podstawowe wymogi dostępności (poprawna hierarchia nagłówków, semantyczny HTML).
