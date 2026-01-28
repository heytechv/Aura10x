# API Endpoint Implementation Plan: List & Search Perfumes

## 1. Przegląd punktu końcowego
Ten punkt końcowy (`GET /api/perfumes`) jest publicznie dostępnym zasobem, który umożliwia pobieranie, wyszukiwanie i paginację danych z katalogu perfum. Został zaprojektowany w celu zapewnienia wydajnego dostępu do danych dla interfejsu użytkownika, np. strony z katalogiem produktów.

## 2. Szczegóły żądania
- **Metoda HTTP**: `GET`
- **Struktura URL**: `/api/perfumes`
- **Parametry zapytania (Query Parameters)**:
  - **Opcjonalne**:
    - `q` (string): Fraza do wyszukiwania w nazwach perfum i marek.
    - `limit` (integer, domyślnie: 20): Liczba wyników do zwrócenia.
    - `page` (integer, domyślnie: 1): Numer strony wyników.
- **Request Body**: Brak.

## 3. Wykorzystywane typy
Implementacja będzie wykorzystywać istniejące, predefiniowane typy DTO z `src/types.ts`:
- **`PaginatedPerfumeListDto`**: Główny typ odpowiedzi, zawierający dane i informacje o paginacji.
  - `data: PerfumeListItemDto[]`
  - `pagination: PaginationDetails`
- **`PerfumeListItemDto`**: Typ dla pojedynczego obiektu na liście.
- **`PaginationDetails`**: Typ dla obiektu paginacji.

## 4. Szczegóły odpowiedzi
- **Odpowiedź sukcesu (`200 OK`)**:
  ```json
  {
    "data": [
      {
        "id": "a1b2c3d4-...",
        "name": "Sauvage",
        "slug": "dior-sauvage",
        "image_path": "/path/to/image.jpg",
        "brand": {
          "name": "Dior",
          "slug": "dior"
        }
      }
    ],
    "pagination": {
      "currentPage": 1,
      "totalPages": 10,
      "totalItems": 200
    }
  }
  ```
- **Odpowiedź błędu (`400 Bad Request`)**:
  ```json
  {
    "error": "Invalid query parameters",
    "details": "Pole 'limit' musi być liczbą całkowitą dodatnią."
  }
  ```

## 5. Przepływ danych
1.  Żądanie `GET` jest kierowane do punktu końcowego Astro API pod adresem `src/pages/api/perfumes.ts`.
2.  Wyeksportowana funkcja `GET` w tym pliku jest wykonywana. Otrzymuje ona obiekt `context`, który zawiera `request` i `locals`.
3.  Parametry zapytania z `context.url.searchParams` są odczytywane i walidowane przy użyciu schemy `zod`. W przypadku błędu walidacji zwracana jest odpowiedź `400`.
4.  Funkcja `GET` wywołuje funkcję serwisową (np. `getPublicPerfumes`) z `src/lib/services/perfume.service.ts`, przekazując zweryfikowane parametry.
5.  Funkcja serwisowa, używając klienta Supabase (`context.locals.supabase`), konstruuje zapytanie:
    - Wybiera dane z tabeli `perfumes` i łączy je z tabelą `brands`.
    - Używa metody `.ilike()` do wyszukiwania tekstowego na podstawie parametru `q`.
    - Używa metody `.range()` do zastosowania paginacji na podstawie `limit` i `page`.
    - Wykonuje drugie, równoległe zapytanie `count` w celu uzyskania całkowitej liczby pasujących rekordów, co jest niezbędne do obliczenia `totalPages`.
6.  Serwis zwraca pobraną listę perfum oraz dane paginacyjne do funkcji `GET`.
7.  Funkcja `GET` formatuje dane zgodnie z DTO `PaginatedPerfumeListDto` i zwraca je jako odpowiedź JSON z kodem statusu `200 OK`, używając `new Response(JSON.stringify(data))`.

## 6. Względy bezpieczeństwa
- **Walidacja danych wejściowych**: Wszystkie parametry zapytania będą rygorystycznie walidowane (typ, zakres), aby zapobiec nieprawidłowym lub złośliwym zapytaniom do bazy danych.
- **Ochrona przed SQL Injection**: Wykorzystanie klienta Supabase JS zapewnia parametryzację zapytań, co jest standardową i skuteczną ochroną przed atakami SQL Injection.
- **Dostęp**: Punkt końcowy jest publiczny i celowo nie wymaga uwierzytelniania. RLS w Supabase dla tabel publicznych (`perfumes`, `brands`) jest skonfigurowany tak, aby zezwalać na operacje `SELECT` dla wszystkich ról.

## 7. Obsługa błędów
- **Błędy walidacji (400)**: Jeśli parametry `limit` lub `page` nie są poprawnymi liczbami lub są poza dozwolonym zakresem, funkcja `GET` zwróci odpowiedź JSON z kodem `400` i szczegółowym opisem błędu.
- **Błędy serwera (500)**: Wszelkie nieoczekiwane błędy (np. niedostępność bazy danych Supabase) zostaną przechwycone w bloku `try...catch`. Błąd zostanie zarejestrowany po stronie serwera, a do klienta zostanie wysłana generyczna odpowiedź z kodem `500 Internal Server Error`, aby uniknąć ujawniania szczegółów implementacji.

## 8. Rozważania dotyczące wydajności
- **Indeksowanie bazy danych**: Należy upewnić się, że kolumny używane w zapytaniach `WHERE` i `JOIN` są odpowiednio zindeksowane. Zgodnie z `.ai/db-plan.md`, istnieją już indeksy `idx_perfumes_brand_id` i `idx_perfumes_slug`. Należy rozważyć dodanie indeksu na kolumnie `perfumes.name` (np. przy użyciu `GIN` lub `GIST` dla wyszukiwania tekstowego), aby przyspieszyć operacje `ilike`.
- **Rozmiar odpowiedzi**: Domyślny `limit` na 20 wyników zapobiega przesyłaniu nadmiernej ilości danych.

## 9. Etapy wdrożenia
1.  **Utworzenie punktu końcowego API**: Utwórz nowy plik `src/pages/api/perfumes.ts`.
2.  **Zdefiniowanie handlera GET**: W nowym pliku wyeksportuj asynchroniczną funkcję `GET({ request, locals, url })` zgodną z sygnaturą Astro API routes.
3.  **Implementacja walidacji**: Zdefiniuj schemę `zod` do walidacji parametrów `q`, `limit` i `page` pobranych z `url.searchParams`. Zastosuj wartości domyślne.
4.  **Utworzenie serwisu**: Utwórz plik `src/lib/services/perfume.service.ts` (jeśli jeszcze nie istnieje).
5.  **Implementacja logiki dostępu do danych**: W pliku serwisu zaimplementuj funkcję `getPublicPerfumes`, która przyjmuje klienta Supabase oraz parametry wyszukiwania i paginacji, a następnie wykonuje zapytania w celu pobrania danych i zliczenia rekordów.
6.  **Integracja handlera z serwisem**: W funkcji `GET` wywołaj nowo utworzoną funkcję serwisową, przekazując `locals.supabase` i zweryfikowane parametry.
7.  **Obsługa błędów**: Owiń logikę w funkcji `GET` w blok `try...catch`, aby obsłużyć błędy z serwisu lub inne nieoczekiwane wyjątki i zwrócić odpowiednie obiekty `Response` z kodami statusu.
8.  **Formatowanie odpowiedzi**: Przekształć dane zwrócone z serwisu do struktury zdefiniowanej w `PaginatedPerfumeListDto` i zwróć je, tworząc nowy obiekt `Response` z ciałem w formacie JSON.
9.  **Testowanie (opcjonalnie)**: Dodaj testy jednostkowe dla logiki w pliku serwisu, aby zweryfikować poprawność budowania zapytań i obliczeń paginacji.
