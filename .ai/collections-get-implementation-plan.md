# API Endpoint Implementation Plan: Get User's Collection

## 1. Przegląd punktu końcowego
Celem tego punktu końcowego jest pobranie listy perfum znajdujących się w osobistej kolekcji uwierzytelnionego użytkownika. Zwraca on szczegółowe informacje o każdym elemencie kolekcji, w tym dane o perfumach i marce.

## 2. Szczegóły żądania
- **Metoda HTTP**: `GET`
- **Struktura URL**: `/api/collection`
- **Parametry**:
  - **Wymagane**: Brak
  - **Opcjonalne**: Brak
- **Request Body**: Brak

## 3. Wykorzystywane typy
- **DTO**: `CollectionItemDto` z `src/types.ts` zostanie użyty do strukturyzacji danych w odpowiedzi.
  ```typescript
  export type CollectionItemDto = Pick<UserCollection, "perfume_id" | "added_at"> & {
    perfume: Pick<Perfume, "name" | "slug" | "image_path"> & {
      brand: Pick<Brand, "name">;
    };
  };
  ```

## 4. Szczegóły odpowiedzi
- **Sukces (200 OK)**: Zwraca obiekt JSON z kluczem `data`, który zawiera tablicę obiektów `CollectionItemDto`.
  ```json
  {
    "data": [
      {
        "perfume_id": "a1b2c3d4-e5f6-...",
        "added_at": "2024-07-28T10:00:00Z",
        "perfume": {
          "name": "Sauvage",
          "slug": "dior-sauvage",
          "brand": {
            "name": "Dior"
          },
          "image_path": "/path/to/image.jpg"
        }
      }
    ]
  }
  ```
- **Błędy**:
  - **401 Unauthorized**: Gdy użytkownik nie jest uwierzytelniony.
  - **500 Internal Server Error**: W przypadku nieoczekiwanego błędu serwera.

## 5. Przepływ danych
1.  Klient wysyła żądanie `GET` na adres `/api/collection`, dołączając cookie sesji.
2.  Middleware Astro (`src/middleware/index.ts`) weryfikuje sesję użytkownika przy użyciu `@supabase/ssr` i uzupełnia `context.locals.supabase` oraz `context.locals.user`.
3.  Handler API w `src/pages/api/collection.ts` zostaje wywołany.
4.  Handler sprawdza, czy `context.locals.user` istnieje. Jeśli nie, natychmiast zwraca odpowiedź `401`.
5.  Handler wywołuje metodę `getCollectionByUserId` z nowego serwisu `CollectionService`, przekazując `context.locals.user.id` oraz klienta `supabase`.
6.  `CollectionService` wykonuje zapytanie do Supabase, które:
    - Odpytuje tabelę `user_collection`.
    - Filtruje wyniki po `user_id`.
    - Łączy (`JOIN`) z tabelą `perfumes` na podstawie `perfume_id`.
    - Łączy (`JOIN`) z tabelą `brands` na podstawie `brand_id` z tabeli `perfumes`.
    - Selektywnie wybiera tylko wymagane kolumny, aby zbudować strukturę zgodną z `CollectionItemDto`.
7.  Serwis zwraca sformatowane dane do handlera.
8.  Handler opakowuje dane w obiekt `{ data: [...] }` i wysyła odpowiedź JSON z kodem statusu `200 OK`.

## 6. Względy bezpieczeństwa
- **Uwierzytelnianie**: Endpoint musi być chroniony. Logika biznesowa rozpocznie się dopiero po potwierdzeniu istnienia `context.locals.user`.
- **Autoryzacja**: Zapytanie do bazy danych będzie filtrowane przez `user_id` zalogowanego użytkownika. Dodatkowo, polityka RLS (Row Level Security) włączona na tabeli `user_collection` w Supabase zapewnia, że użytkownicy mogą odpytywać wyłącznie o swoje własne dane (`auth.uid() = user_id`).

## 7. Obsługa błędów
- **Brak uwierzytelnienia**: Jeśli `context.locals.user` jest `null`, handler zwróci:
  ```json
  { "error": "Unauthorized" } // Status: 401
  ```
- **Błąd serwera**: Wszelkie błędy zgłoszone przez `CollectionService` (np. błędy zapytań do bazy danych) zostaną przechwycone w bloku `try...catch` w handlerze API. Błąd zostanie zalogowany na konsoli serwera, a do klienta zostanie wysłana generyczna odpowiedź:
  ```json
  { "error": "Internal Server Error" } // Status: 500
  ```

## 8. Rozważania dotyczące wydajności
- **Indeksy bazy danych**: Wydajność zapytania jest kluczowa. Plan bazy danych przewiduje indeks na kolumnie `user_collection(user_id)`, co znacząco przyspieszy filtrowanie kolekcji dla konkretnego użytkownika.
- **Selekcja kolumn**: Zapytanie do bazy danych powinno precyzyjnie wybierać tylko te kolumny, które są niezbędne do zbudowania `CollectionItemDto`, aby minimalizować transfer danych między bazą a serwerem.

## 9. Etapy wdrożenia
1.  **Utworzenie pliku serwisu**: Stwórz nowy plik `src/lib/services/collection.service.ts`.
2.  **Implementacja logiki serwisu**: W `collection.service.ts` zaimplementuj asynchroniczną funkcję `getCollectionByUserId(userId: string, supabase: SupabaseClient)`. Funkcja ta będzie zawierała logikę zapytania do bazy danych Supabase z odpowiednimi JOIN-ami i selekcją pól.
3.  **Utworzenie pliku endpointu**: Stwórz plik `src/pages/api/collection.ts`.
4.  **Implementacja handlera GET**: W `collection.ts` wyeksportuj handler `GET`, który przyjmuje `context` API Astro.
5.  **Dodanie sprawdzania autentykacji**: Na początku handlera `GET` dodaj warunek sprawdzający `context.locals.user`. Jeśli jest `null`, zwróć odpowiedź `401`.
6.  **Wywołanie serwisu**: W bloku `try` wywołaj metodę `getCollectionByUserId` z serwisu, przekazując ID użytkownika i klienta Supabase.
7.  **Obsługa błędów**: Dodaj blok `catch` do obsługi potencjalnych błędów z serwisu. Zaloguj błąd i zwróć odpowiedź `500`.
8.  **Zwrócenie pomyślnej odpowiedzi**: Jeśli operacja się powiedzie, zwróć dane z serwisu w formacie JSON z kodem statusu `200 OK`.
9.  **Ustawienie prerender=false**: Upewnij się, że w pliku `collection.ts` znajduje się eksport `export const prerender = false;`, aby wymusić dynamiczne renderowanie po stronie serwera.
