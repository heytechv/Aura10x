# Plan Testów - Projekt AURA (MVP v1)

## 1. Wprowadzenie i cele testowania
Celem niniejszego planu testów jest zapewnienie wysokiej jakości i niezawodności aplikacji AURA w wersji MVP. Głównym zadaniem jest weryfikacja poprawności działania kluczowych funkcjonalności: autentykacji użytkowników oraz zarządzania osobistą kolekcją perfum. Strategia testowania koncentruje się na wczesnym wykrywaniu błędów (Shift-Left) oraz automatyzacji procesów weryfikacji.

## 2. Zakres testów
Testy obejmować będą następujące obszary systemu:
- **Warstwa Frontend:** Komponenty React (interaktywność), strony Astro (SSR), integracja UI (Shadcn/Tailwind).
- **Warstwa Backend/API:** Endpointy API (`/api/auth`, `/api/collection`, `/api/perfumes`), logika biznesowa w serwisach.
- **Baza Danych:** Poprawność schematu danych, integralność relacji, mechanizmy bezpieczeństwa RLS (Row Level Security).
- **Integracja:** Komunikacja między Astro, React a usługami Supabase.

Z zakresu testów wyłączone są:
- Testy wydajnościowe infrastruktury Supabase (poleganie na SLA dostawcy).
- Testy penetracyjne (zostaną zlecone w późniejszej fazie).

## 3. Typy testów do przeprowadzenia

### 3.1. Analiza Statyczna (Static Analysis)
- **Cel:** Weryfikacja standardów kodowania i poprawności typów.
- **Narzędzia:** ESLint (v9), Prettier, TypeScript Compiler (tsc).
- **Zakres:** Cały kod źródłowy (`src/`).

### 3.2. Testy Jednostkowe (Unit Tests)
- **Cel:** Izolowana weryfikacja logiki biznesowej i komponentów.
- **Narzędzia:** 
  - **Vitest:** Główny runner testów (szybki, natywna integracja z Vite).
  - **React Testing Library:** Testowanie komponentów React.
  - **Happy-DOM:** Szybka symulacja środowiska DOM.
- **Zakres:**
  - Serwisy (`src/lib/services/*`) - testowanie logiki operacji na danych (mockowanie Supabase).
  - Funkcje pomocnicze (`src/lib/utils.ts`).
  - Hooki React (`useCollection`, `usePublicPerfumes`).
  - Komponenty UI (izolowane).

### 3.3. Testy Integracyjne (Integration Tests)
- **Cel:** Weryfikacja współpracy modułów i komunikacji z zewnętrznymi serwisami (mockowanymi lub lokalnymi).
- **Narzędzia:** Vitest.
- **Zakres:**
  - Endpointy API Astro - bezpośrednie wywoływanie handlerów `GET`/`POST` z mockowanymi obiektami `Request`.
  - Middleware autentykacji - weryfikacja logiki sesji i przekierowań.
  - Interakcje złożonych komponentów (np. formularze z walidacją).

### 3.4. Testy End-to-End (E2E Tests)
- **Cel:** Symulacja zachowania użytkownika w rzeczywistym środowisku przeglądarki.
- **Narzędzia:** Playwright (wsparcie dla wielu przeglądarek, nagrywanie testów, snapshoty).
- **Zakres:** Krytyczne ścieżki użytkownika (User Journeys) na działającej aplikacji podłączonej do instancji Supabase.

## 4. Scenariusze testowe dla kluczowych funkcjonalności

### 4.1. Autentykacja i Sesja
| ID | Scenariusz | Oczekiwany rezultat | Priorytet |
|----|------------|---------------------|-----------|
| AUTH-01 | Logowanie poprawnymi danymi | Przekierowanie do panelu, ustawienie ciasteczka sesyjnego | Wysoki |
| AUTH-02 | Logowanie błędnymi danymi | Wyświetlenie komunikatu błędu, brak przekierowania | Wysoki |
| AUTH-03 | Wylogowanie | Usunięcie sesji/ciasteczka, przekierowanie do strony logowania | Wysoki |
| AUTH-04 | Dostęp do chronionej trasy bez sesji | Przekierowanie do `/login` przez middleware | Wysoki |

### 4.2. Zarządzanie Kolekcją (Moja Półka)
| ID | Scenariusz | Oczekiwany rezultat | Priorytet |
|----|------------|---------------------|-----------|
| COL-01 | Wyświetlenie listy kolekcji (pusta) | Komunikat "Brak perfum w kolekcji" (Empty State) | Średni |
| COL-02 | Wyświetlenie listy kolekcji (z danymi) | Poprawne renderowanie kart perfum z danymi z API | Wysoki |
| COL-03 | Dodanie perfum do kolekcji | Modal zamyka się, lista odświeża się, nowe perfumy widoczne | Wysoki |
| COL-04 | Próba dodania duplikatu | Zablokowanie akcji lub obsługa błędu (idempotentność) | Średni |
| COL-05 | Usunięcie perfum z kolekcji | Element znika z listy, aktualizacja stanu UI | Wysoki |
| COL-06 | Przekroczenie limitu (Tier Logic) | Próba dodania >10 perfum zwraca błąd i wyświetla komunikat (Toast) | Średni |
| COL-07 | Odblokowanie odznaki (Bundle Logic) | Dodanie 3 perfum tej samej marki wyświetla Toast o odznace | Niski |

### 4.3. Katalog Perfum
| ID | Scenariusz | Oczekiwany rezultat | Priorytet |
|----|------------|---------------------|-----------|
| CAT-01 | Pobieranie listy perfum (paginacja) | Zwrócenie poprawnej liczby rekordów na stronę | Średni |
| CAT-02 | Filtrowanie/Wyszukiwanie | Lista zawęża się do wyników pasujących do zapytania | Średni |

## 5. Środowisko testowe
- **Lokalne (Development):** 
  - **Unit/Integration:** Mockowanie klienta Supabase lub in-memory database.
  - **E2E:** Uruchomienie `supabase start` (lokalny stack Supabase) dla pełnej izolacji i powtarzalności danych (seed.sql).
- **CI/CD (GitHub Actions):** 
  - Automatyczne uruchamianie testów przy każdym Pull Request.
  - Wykorzystanie Supabase CLI w CI do postawienia tymczasowej bazy dla testów E2E.

## 6. Narzędzia do testowania
Poniższe pakiety należy zainstalować jako `devDependencies`:

- **Runner & Asercje:** `vitest`
- **Środowisko DOM:** `happy-dom` (szybsze niż jsdom)
- **Testowanie React:** `@testing-library/react`, `@testing-library/dom`, `@testing-library/user-event`
- **Testowanie E2E:** `@playwright/test`
- **Mockowanie:** `vi.mock` (wbudowane w Vitest)

## 7. Harmonogram testów
1. **Instalacja i Konfiguracja:** Skonfigurowanie Vitest i Playwright.
2. **Unit Testing (TDD):** Pokrycie serwisów (`src/lib/services`) i utility functions.
3. **Component Testing:** Testy kluczowych komponentów (Auth, CollectionGrid).
4. **E2E Testing:** Implementacja ścieżki logowania i dodawania do kolekcji.

## 8. Kryteria akceptacji testów
- 100% testów w potoku CI musi zakończyć się sukcesem (PASS).
- Pokrycie kodu (Code Coverage):
  - Logika biznesowa (serwisy): >80%
  - Komponenty UI: >60%
- Brak błędów krytycznych (Blocker/Critical) w raporcie testów E2E.

## 9. Role i odpowiedzialności
- **Developerzy:** Pisanie testów jednostkowych i integracyjnych dla tworzonych funkcjonalności.
- **QA / Lead Developer:** Konfiguracja środowiska testowego, tworzenie scenariuszy E2E.

## 10. Procedury raportowania błędów
Wszelkie błędy wykryte podczas testów powinny być zgłaszane jako Issues w repozytorium GitHub z etykietą `bug`. Zgłoszenie powinno zawierać:
1. Kroki do reprodukcji.
2. Oczekiwany vs. rzeczywisty rezultat.
3. Zrzuty ekranu / logi błędów.
4. Środowisko występowania.

