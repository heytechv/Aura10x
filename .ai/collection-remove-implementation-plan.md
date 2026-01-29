<analysis>
### 1. Podsumowanie kluczowych punktów specyfikacji API
- **Cel**: Usunięcie perfum z kolekcji uwierzytelnionego użytkownika.
- **Metoda**: `DELETE`
- **Ścieżka**: `/api/collection/{perfumeId}`
- **Uwierzytelnianie**: Wymagane. Sesja użytkownika musi być aktywna.
- **Parametry**: `perfumeId` (UUID) jako parametr ścieżki.
- **Ciało żądania**: Brak.
- **Odpowiedź sukcesu (200 OK)**: `{ "message": "Perfume removed successfully." }`
- **Główne kody błędów**: `401 Unauthorized`, `404 Not Found`, `500 Internal Server Error`.

### 2. Wymagane i opcjonalne parametry
- **Wymagane**: `perfumeId` - identyfikator perfum do usunięcia, przekazywany w ścieżce URL. Musi być w formacie UUID.
- **Opcjonalne**: Brak.

### 3. Niezbędne typy DTO i Command Modele
Na podstawie `src/types.ts` i specyfikacji, implementacja tego punktu końcowego nie wymaga tworzenia żadnych nowych typów DTO ani Command Models. Będziemy operować na identyfikatorach (`perfumeId`, `userId`).

### 4. Wyodrębnienie logiki do serwisu
Logika biznesowa związana z usunięciem perfum z kolekcji zostanie umieszczona w istniejącym serwisie `src/lib/services/collection.service.ts`. Zostanie dodana nowa, asynchroniczna metoda, np. `removePerfumeFromCollection(userId: string, perfumeId: string)`. Metoda ta będzie odpowiedzialna za wykonanie operacji `DELETE` w bazie danych Supabase i obsługę potencjalnych błędów bazodanowych (np. naruszenie klucza obcego lub brak rekordu).

### 5. Walidacja danych wejściowych
- **Uwierzytelnianie**: Astro middleware (`src/middleware/index.ts`) jest odpowiedzialne za weryfikację sesji użytkownika. W samym punkcie końcowym sprawdzimy, czy `context.locals.user` istnieje. Jeśli nie, zwrócimy `401 Unauthorized`.
- **Walidacja `perfumeId`**: Parametr `perfumeId` ze ścieżki URL zostanie zwalidowany przy użyciu biblioteki `zod`. Stworzymy schemat `z.string().uuid()` do weryfikacji, czy jest to poprawny identyfikator UUID. W przypadku błędu walidacji, API zwróci kod `400 Bad Request`.

### 6. Rejestrowanie błędów
W przypadku wystąpienia nieoczekiwanego błędu (np. problem z połączeniem z bazą danych), błąd zostanie przechwycony w bloku `try...catch`. Zostanie zalogowany po stronie serwera przy użyciu `console.error`, a do klienta zostanie wysłana generyczna odpowiedź z kodem `500 Internal Server Error`. Wdrożenie dedykowanej tabeli do logowania błędów nie jest częścią tego zadania.

### 7. Potencjalne zagrożenia bezpieczeństwa
- **Nieautoryzowane usunięcie**: Główne ryzyko polega na tym, że jeden użytkownik mógłby usunąć perfumy z kolekcji innego użytkownika.
- **Mitygacja**:
    1.  **RLS (Row Level Security)**: Polityka bezpieczeństwa w Supabase na tabeli `user_collection` (`auth.uid() = user_id`) zapewnia, że operacje `DELETE` mogą być wykonywane tylko na wierszach należących do aktualnie zalogowanego użytkownika.
    2.  **Logika Serwisu**: Metoda w `collection.service.ts` będzie jawnie używać `userId` pobranego z sesji (`context.locals.user.id`) w klauzuli `WHERE` zapytania `DELETE`. To stanowi dodatkową warstwę zabezpieczeń na poziomie aplikacji.

### 8. Potencjalne scenariusze błędów i kody stanu
- `401 Unauthorized`: Użytkownik próbuje uzyskać dostęp do punktu końcowego bez aktywnej sesji (brak `context.locals.user`).
- `400 Bad Request`: Parametr `perfumeId` w URL nie jest prawidłowym UUID.
- `404 Not Found`: Użytkownik jest uwierzytelniony, ale próbuje usunąć perfumy, których nie ma w swojej kolekcji. Operacja `DELETE` w Supabase nie znajdzie pasującego rekordu (`count` zwrócony przez zapytanie będzie równy `0`).
- `500 Internal Server Error`: Wystąpił nieoczekiwany błąd po stronie serwera, np. awaria usługi Supabase.
</analysis>

# API Endpoint Implementation Plan: Remove Perfume from Collection

## 1. Przegląd punktu końcowego
Ten punkt końcowy umożliwia uwierzytelnionym użytkownikom usunięcie określonych perfum ze swojej osobistej kolekcji. Operacja jest idempotentna i zabezpieczona, aby uniemożliwić użytkownikom modyfikowanie kolekcji innych osób.

## 2. Szczegóły żądania
- **Metoda HTTP**: `DELETE`
- **Struktura URL**: `/api/collection/[perfumeId].ts`
- **Parametry**:
  - **Wymagane**:
    - `perfumeId` (w ścieżce URL): Identyfikator UUID perfum, które mają zostać usunięte z kolekcji.
  - **Opcjonalne**: Brak.
- **Request Body**: Brak.

## 3. Wykorzystywane typy
Implementacja nie wymaga tworzenia nowych typów DTO (Data Transfer Object) ani Command Models. Będziemy korzystać z istniejących typów podstawowych (`string` dla UUID).

## 4. Szczegóły odpowiedzi
- **Odpowiedź sukcesu (200 OK)**:
  ```json
  {
    "message": "Perfume removed successfully."
  }
  ```
- **Odpowiedzi błędów**:
  - `400 Bad Request`: Gdy `perfumeId` nie jest prawidłowym UUID.
  - `401 Unauthorized`: Gdy użytkownik nie jest zalogowany.
  - `404 Not Found`: Gdy perfumy o podanym `perfumeId` nie istnieją w kolekcji użytkownika.
  - `500 Internal Server Error`: W przypadku nieoczekiwanych błędów serwera.

## 5. Przepływ danych
1.  Klient wysyła żądanie `DELETE` na adres `/api/collection/{perfumeId}`.
2.  Middleware Astro weryfikuje token sesji i umieszcza dane użytkownika (`user`) oraz instancję klienta Supabase (`supabase`) w `context.locals`.
3.  Plik dynamicznego routingu Astro `src/pages/api/collection/[perfumeId].ts` obsługuje żądanie.
4.  Handler `DELETE` jest wywoływany:
    a. Sprawdza, czy `context.locals.user` istnieje. Jeśli nie, zwraca `401`.
    b. Waliduje format `perfumeId` z `context.params` przy użyciu Zod. Jeśli jest nieprawidłowy, zwraca `400`.
    c. Wywołuje metodę `collectionService.removePerfumeFromCollection` z `userId` i `perfumeId`.
5.  Metoda w serwisie `collection.service.ts` wykonuje zapytanie `DELETE` do tabeli `user_collection` w Supabase, używając klauzuli `WHERE` z `user_id` i `perfume_id`.
6.  Serwis analizuje wynik operacji `DELETE`. Jeśli liczba usuniętych wierszy wynosi `0`, zwraca błąd informujący o braku zasobu.
7.  Handler API na podstawie wyniku z serwisu zwraca odpowiednią odpowiedź HTTP (`200` lub `404`).
8.  W przypadku błędów na dowolnym etapie (np. błąd bazy danych), jest on przechwytywany i zwracany jest status `500`.

## 6. Względy bezpieczeństwa
- **Uwierzytelnianie**: Dostęp jest ograniczony wyłącznie do uwierzytelnionych użytkowników. Middleware Astro i sprawdzanie `context.locals.user` zapewniają weryfikację sesji.
- **Autoryzacja**: Polityka Row Level Security (RLS) w Supabase na tabeli `user_collection` jest skonfigurowana tak, aby zezwalać na operacje `DELETE` tylko wtedy, gdy `auth.uid() = user_id`. Dodatkowo, logika w serwisie aplikacyjnym jawnie filtruje po `userId`, co stanowi drugą warstwę zabezpieczeń.
- **Walidacja danych wejściowych**: Parametr `perfumeId` jest walidowany jako UUID, co zapobiega błędom zapytań i potencjalnym atakom (np. SQL Injection, chociaż klient Supabase jest sparametryzowany).

## 7. Rozważania dotyczące wydajności
- Zapytanie `DELETE` jest bardzo wydajne, ponieważ operuje na kluczu głównym (`user_id`, `perfume_id`) tabeli `user_collection`.
- Na kolumnie `user_id` w tabeli `user_collection` istnieje indeks (`idx_user_collection_user`), co dodatkowo przyspiesza wyszukiwanie wierszy do usunięcia.
- Obciążenie tego punktu końcowego jest minimalne i nie przewiduje się problemów z wydajnością.

## 8. Etapy wdrożenia
1.  **Utworzenie pliku API**: Stworzyć nowy plik `src/pages/api/collection/[perfumeId].ts` do obsługi dynamicznego routingu.
2.  **Implementacja handlera `DELETE`**: W nowo utworzonym pliku zaimplementować `export const DELETE: APIRoute = async (context) => { ... }`.
3.  **Dodanie logiki uwierzytelniania**: W handlerze `DELETE` dodać sprawdzenie, czy `context.locals.user` jest zdefiniowany. Jeśli nie, zwrócić odpowiedź `401`.
4.  **Walidacja `perfumeId`**: Zaimplementować walidację `perfumeId` pobranego z `context.params` za pomocą biblioteki Zod, aby upewnić się, że jest to poprawny UUID. W przypadku niepowodzenia zwrócić `400`.
5.  **Rozszerzenie serwisu kolekcji**: W pliku `src/lib/services/collection.service.ts` dodać nową metodę `removePerfumeFromCollection(userId: string, perfumeId: string)`.
6.  **Implementacja logiki usuwania**: Wewnątrz nowej metody serwisu, użyć klienta Supabase (`this.supabase`) do wykonania operacji `delete()` na tabeli `user_collection`, filtrując po `user_id` i `perfume_id`.
7.  **Obsługa przypadku "Not Found"**: W serwisie, po wykonaniu zapytania, sprawdzić, czy `count` usuniętych rekordów jest równy `0`. Jeśli tak, rzucić specyficzny błąd (np. `NotFoundError`), który zostanie obsłużony w handlerze API i przetłumaczony na status `404`.
8.  **Integracja handlera z serwisem**: W handlerze `DELETE` wywołać nową metodę serwisu w bloku `try...catch` i zwrócić odpowiednią odpowiedź (`200`, `404` lub `500`) w zależności od wyniku.
