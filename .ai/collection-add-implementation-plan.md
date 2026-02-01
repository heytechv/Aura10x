
# API Endpoint Implementation Plan: Add Perfume to Collection

## 1. Przegląd punktu końcowego
Ten punkt końcowy umożliwia uwierzytelnionemu użytkownikowi dodanie nowych perfum do swojej osobistej kolekcji. Operacja wymaga podania identyfikatora `perfume_id` istniejącego w publicznym katalogu. Po pomyślnym dodaniu, punkt końcowy zwraca potwierdzenie oraz nowo utworzony rekord kolekcji.

## 2. Szczegóły żądania
- **Metoda HTTP**: `POST`
- **Struktura URL**: `/api/collection`
- **Parametry**:
  - **Wymagane**: Brak parametrów URL.
  - **Opcjonalne**: Brak.
- **Request Body**:
  ```json
  {
    "perfume_id": "a1b2c3d4-e5f6-..."
  }
  ```
  - `perfume_id` (string, UUID): Identyfikator perfum do dodania. Musi istnieć w tabeli `perfumes`.

## 3. Wykorzystywane typy
- **Command Model**: `AddPerfumeToCollectionCommand` z `src/types.ts`
  ```typescript
  export type AddPerfumeToCollectionCommand = Pick<UserCollection, "perfume_id">;
  ```
- **Response DTO**: `AddPerfumeToCollectionResponseDto` z `src/types.ts`
  ```typescript
  export type AddPerfumeToCollectionResponseDto = {
    message: string;
    data: UserCollection;
    badgeUnlocked?: string;
  };
  ```

## 4. Szczegóły odpowiedzi
- **Odpowiedź sukcesu (201 Created)**:
  ```json
  {
    "message": "Perfume added successfully.",
    "data": {
      "user_id": "f1g2h3i4-j5k6-...",
      "perfume_id": "a1b2c3d4-e5f6-...",
      "added_at": "2024-07-28T10:00:00Z"
    },
    "badgeUnlocked": "Brand Ambassador Dior"
  }
  ```
- **Odpowiedzi błędów**:
  - `400 Bad Request`: Nieprawidłowe lub brakujące `perfume_id`.
  - `401 Unauthorized`: Użytkownik nie jest uwierzytelniony.
  - `403 Forbidden`: Limit darmowego konta osiągnięty.
  - `404 Not Found`: `perfume_id` nie istnieje w tabeli `perfumes`.
  - `409 Conflict`: Użytkownik już posiada te perfumy w kolekcji.
  - `500 Internal Server Error`: Wewnętrzny błąd serwera.

## 5. Przepływ danych
1. Klient wysyła żądanie `POST` na `/api/collection` z `perfume_id` w ciele żądania.
2. Oprogramowanie pośredniczące Astro (`middleware/index.ts`) weryfikuje sesję użytkownika i udostępnia `supabase` oraz `user` w `context.locals`.
3. Handler API w `src/pages/api/collection.ts` odbiera żądanie.
4. Handler sprawdza, czy `context.locals.user` istnieje. Jeśli nie, zwraca `401 Unauthorized`.
5. Ciało żądania jest walidowane za pomocą schemy Zod, aby upewnić się, że `perfume_id` jest poprawnym UUID. W przypadku błędu zwraca `400 Bad Request`.
6. Handler wywołuje metodę serwisową (np. `CollectionService.addPerfumeToCollection`) przekazując `user.id` i `perfume_id`.
7. Metoda serwisowa wykonuje następujące operacje w ramach transakcji:
   a. Sprawdza, czy perfumy o podanym `perfume_id` istnieją w tabeli `perfumes`. Jeśli nie, zgłasza błąd `NotFound`.
   b. Sprawdza, czy kombinacja `user_id` i `perfume_id` już istnieje w tabeli `user_collection`. Jeśli tak, zgłasza błąd `Conflict`.
   c. **Sprawdza limit konta**: Weryfikuje, czy użytkownik nie przekroczył limitu 10 perfum (darmowy tier). Jeśli tak, zgłasza błąd `403`.
   d. Wstawia nowy wiersz do tabeli `user_collection`.
   e. **Sprawdza logikę zestawów (Bundle)**: Weryfikuje, czy użytkownik skompletował 3 zapachy tej samej marki. Jeśli tak, zwraca informację o odblokowanej odznace.
8. Handler API przechwytuje ewentualne błędy z serwisu i mapuje je na odpowiednie kody statusu HTTP (`403`, `404`, `409`).
9. W przypadku sukcesu, handler formatuje odpowiedź DTO i zwraca ją z kodem `201 Created`.

## 6. Względy bezpieczeństwa
- **Uwierzytelnianie**: Dostęp do punktu końcowego jest chroniony. Oprogramowanie pośredniczące Astro musi zweryfikować ważną sesję użytkownika przed przetworzeniem żądania.
- **Autoryzacja**: Polityka RLS (Row Level Security) w Supabase dla tabeli `user_collection` (`auth.uid() = user_id`) zapewnia, że użytkownik może modyfikować tylko swoją własną kolekcję.
- **Walidacja danych wejściowych**: Użycie Zod do walidacji `perfume_id` jako UUID chroni przed atakami typu injection i nieprawidłowymi danymi.
- **Ograniczenie dostępu**: Punkt końcowy powinien być dostępny tylko dla uwierzytelnionych ról (`authenticated`).

## 7. Obsługa błędów
Punkt końcowy będzie implementował scentralizowaną obsługę błędów, mapując błędy serwisowe na odpowiedzi HTTP:
- **Brak sesji użytkownika**: Zwraca `401 Unauthorized`.
- **Błąd walidacji Zod**: Zwraca `400 Bad Request` z komunikatem o błędzie.
- **Perfumy nie znalezione**: Zwraca `404 Not Found`.
- **Perfumy już w kolekcji**: Zwraca `409 Conflict`.
- **Inne błędy Supabase/bazy danych**: Loguje błąd po stronie serwera i zwraca generyczny `500 Internal Server Error`.

## 8. Rozważania dotyczące wydajności
- Operacje na bazie danych są proste (dwa zapytania `SELECT` i jedno `INSERT`). Istniejące indeksy na `user_collection(user_id)` i kluczu głównym `perfumes(id)` są wystarczające dla zachowania wysokiej wydajności.
- Nie przewiduje się wąskich gardeł wydajnościowych przy oczekiwanym obciążeniu.

## 9. Etapy wdrożenia
1.  **Utworzenie schemy walidacji**: Zdefiniowanie schemy Zod w `src/pages/api/collection.ts` do walidacji przychodzącego `perfume_id`.
2.  **Aktualizacja handlera API**: Zmodyfikowanie istniejącego lub utworzenie nowego handlera `POST` w pliku `src/pages/api/collection.ts`.
3.  **Implementacja logiki uwierzytelniania**: W handlerze API, dodanie sprawdzenia `context.locals.user` w celu zapewnienia, że tylko zalogowani użytkownicy mogą kontynuować.
4.  **Implementacja logiki serwisowej**: W `src/lib/services/collection.service.ts` utworzenie nowej metody `addPerfumeToCollection`.
    - Metoda powinna przyjmować `userId` i `perfumeId` jako argumenty.
    - Implementacja sprawdzenia istnienia perfum w tabeli `perfumes`.
    - Implementacja sprawdzenia duplikatów w `user_collection`.
    - Dodanie rekordu do `user_collection` przy użyciu klienta Supabase.
5.  **Integracja serwisu z API**: Wywołanie metody serwisowej z handlera API i przekazanie wymaganych parametrów.
6.  **Implementacja obsługi błędów**: Dodanie bloku `try...catch` w handlerze API do obsługi błędów zgłaszanych przez serwis i mapowanie ich na odpowiednie odpowiedzi HTTP.
7.  **Formatowanie odpowiedzi**: Zapewnienie, że pomyślna odpowiedź jest zgodna ze strukturą `AddPerfumeToCollectionResponseDto` i ma kod statusu `201`.
8.  **Testowanie manualne**: Przetestowanie punktu końcowego przy użyciu narzędzia API (np. Postman, cURL) w celu weryfikacji wszystkich scenariuszy (sukces, błędy 400, 401, 404, 409).
