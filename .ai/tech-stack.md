# Dokumentacja Techniczna (Tech Stack) - Projekt AURA (MVP v1)

Niniejszy dokument opisuje stos technologiczny wykorzystany w procesie tworzenia MVP v1 aplikacji AURA. Wybór technologii podyktowany był koniecznością zapewnienia stabilności i szybkości wdrożenia (Time-to-Market) dla kluczowej funkcji - **Moja Kolekcja**.

## 1. Framework & Frontend
* **Astro 5**: Framework webowy skoncentrowany na dostarczaniu szybkiej, zoptymalizowanej strony z wykorzystaniem renderowania po stronie serwera (SSR) i statycznego generowania stron (SSG). Zarządza routingiem, a dzięki architekturze wyspowej pozwala na dołączanie interaktywnych komponentów tylko tam, gdzie jest to potrzebne.
* **React 19**: Biblioteka UI używana do tworzenia interaktywnych komponentów (wysp) w ramach architektury Astro.
* **Tailwind CSS 4**: Silnik stylizacji typu utility-first do szybkiego budowania interfejsu.
* **TypeScript 5**: Zapewnia silne typowanie, co minimalizuje błędy i ułatwia utrzymanie kodu.
* **Shadcn/ui**: Zbiór reużywalnych komponentów UI zbudowanych na bazie Tailwind CSS i Radix UI.

## 2. Backend & Baza Danych (BaaS)
* **Supabase**: Platforma Backend-as-a-Service, która dostarcza:
    * **PostgreSQL**: Główna relacyjna baza danych przechowująca dane o perfumach oraz kolekcje użytkowników.
    * **Auth**: Obsługa logowania Supabase Auth poprzez istniejące już konta w Supabase, zintegrowana z mechanizmem RLS (Row Level Security).
    * **Storage**: Magazyn obiektowy (Object Storage) do hostowania zdjęć flakonów perfum.
* **Authentication**: Uwierzytelnianie jest obsługiwane przez bibliotekę `@supabase/ssr`, która integruje Supabase Auth z logowaniem w środowisku renderowania po stronie serwera (SSR) Astro. Zarządza sesjami i cookies w oprogramowaniu pośredniczącym (middleware) i punktach końcowych API.

## 3. Testowanie (Quality Assurance)
* **Vitest**: Główny runner testów jednostkowych i integracyjnych, wybrany ze względu na szybkość i natywną integrację z Vite.
* **React Testing Library**: Zestaw narzędzi do testowania komponentów React, skupiający się na testowaniu zachowania aplikacji z perspektywy użytkownika.
* **Happy-DOM**: Lekka i szybka implementacja DOM używana do symulacji środowiska przeglądarki w testach jednostkowych.
* **Playwright**: Narzędzie do automatyzacji testów End-to-End (E2E), umożliwiające testowanie krytycznych ścieżek użytkownika w rzeczywistych przeglądarkach.

## 4. Deployments & Releases
* **Cloudflare Pages**: Wybrana platforma hostingowa dla wersji produkcyjnej.
    * **Zalety**: Globalna sieć CDN, wsparcie dla Astro SSR (poprzez adapter `@astrojs/cloudflare`), hojny darmowy plan i łatwa skalowalność.
    * **Model operacyjny**: Server-Side Rendering (SSR) uruchamiany na krawędzi sieci (Edge), co zapewnia minimalne opóźnienia dla użytkowników na całym świecie.
* **Github Actions**: Narzędzie CI/CD odpowiedzialne za automatyczne budowanie i wdrażanie aplikacji na Cloudflare Pages po każdym merge'u do głównego brancha.
