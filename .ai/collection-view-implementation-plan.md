# Plan implementacji widoku Moja Kolekcja

## 1. Przegląd
Widok "Moja Kolekcja" jest dedykowaną, chronioną sekcją aplikacji, dostępną tylko dla zalogowanych użytkowników. Jego głównym celem jest umożliwienie użytkownikom przeglądania, dodawania i usuwania perfum z ich osobistej kolekcji. Interfejs widoku będzie utrzymany w specjalnym, ciemnym motywie "Midnight Mode", aby stworzyć immersyjne i osobiste doświadczenie. Widok obsługuje stany ładowania (za pomocą szkieletów interfejsu), stan pusty (z wezwaniem do działania) oraz stan z danymi, wyświetlając perfumy w formie siatki.

## 2. Routing widoku
Widok będzie dostępny pod ścieżką `/collection`. Dostęp do tej ścieżki powinien być chroniony i wymagać aktywnej sesji użytkownika. Niezalogowani użytkownicy próbujący uzyskać dostęp do tego adresu URL powinni zostać przekierowani na stronę logowania.

## 3. Struktura komponentów
Hierarchia komponentów zostanie zorganizowana w celu oddzielenia odpowiedzialności, od strony renderowanej na serwerze (Astro) po interaktywne wyspy (React).

```
/src/pages/collection.astro  (Strona Astro, ustawia layout i motyw)
└── /src/components/collection/CollectionContainer.tsx (Główny komponent React, zarządza stanem)
    ├── /src/components/collection/CollectionGrid.tsx (Wyświetla siatkę lub szkielety)
    │   ├── /src/components/shared/PerfumeCard.tsx (Karta dla pojedynczego zapachu)
    │   └── /src/components/shared/SkeletonCard.tsx (Szkielet karty na czas ładowania)
    ├── /src/components/collection/EmptyState.tsx (Komponent dla pustej kolekcji)
    ├── /src/components/ui/button.tsx (Przycisk Shadcn do otwierania modala)
    └── /src/components/collection/AddPerfumeModal.tsx (Modal do wyszukiwania i dodawania perfum)
        ├── /src/components/ui/dialog.tsx (Komponent bazowy modala z Shadcn)
        ├── /src/components/ui/input.tsx (Pole wyszukiwania)
        └── /src/components/shared/PerfumeCard.tsx (Karty perfum w wariancie do dodania)
```

## 4. Szczegóły komponentów

### `CollectionContainer.tsx`
- **Opis**: Główny, interaktywny komponent widoku. Odpowiedzialny za pobieranie kolekcji użytkownika, zarządzanie stanem (ładowanie, błąd, sukces) oraz kontrolowanie widoczności modala dodawania perfum.
- **Główne elementy**: Wyświetla warunkowo `CollectionGrid` lub `EmptyState`. Zawiera przycisk "Dodaj nowe perfumy" i renderuje `AddPerfumeModal`.
- **Obsługiwane interakcje**:
  - Inicjuje pobieranie kolekcji przy montowaniu.
  - Otwiera modal dodawania perfum.
  - Obsługuje logikę usuwania perfum z kolekcji (delegowaną z `PerfumeCard`).
  - Aktualizuje listę perfum po pomyślnym dodaniu nowego elementu przez modal.
- **Typy**: `CollectionItemViewModel[]`, `Status ('loading' | 'success' | 'error')`.
- **Propsy**: Brak.

### `CollectionGrid.tsx`
- **Opis**: Komponent prezentacyjny, który renderuje siatkę kart perfum lub siatkę komponentów `SkeletonCard` w zależności od statusu ładowania.
- **Główne elementy**: Kontener `div` ze stylami siatki (grid), który mapuje tablicę perfum do komponentów `PerfumeCard` lub renderuje stałą liczbę `SkeletonCard`.
- **Obsługiwane interakcje**: Deleguje zdarzenie usunięcia perfum w górę do `CollectionContainer`.
- **Typy**: `CollectionItemViewModel`.
- **Propsy**:
  - `items: CollectionItemViewModel[]`
  - `status: 'loading' | 'success'`
  - `onRemove: (perfumeId: string) => void`

### `PerfumeCard.tsx`
- **Opis**: Wszechstronny komponent do wyświetlania informacji o perfumach. Posiada dwa warianty: `'collection'` (z przyciskiem usuwania) i `'add'` (z przyciskiem dodawania).
- **Główne elementy**: Obraz, nazwa perfum, nazwa marki, przycisk akcji (`Button` z ikoną).
- **Obsługiwane interakcje**: Kliknięcie przycisku "Usuń" lub "Dodaj".
- **Typy**: `CollectionItemViewModel` lub `PerfumeListItemViewModel`.
- **Propsy**:
  - `perfume: CollectionItemViewModel | PerfumeListItemViewModel`
  - `variant: 'collection' | 'add'`
  - `onRemove?: (perfumeId: string) => void`
  - `onAdd?: (perfume: PerfumeListItemViewModel) => void`
  - `isProcessing?: boolean` (do wyświetlania wskaźnika ładowania na przycisku)
  - `isDisabled?: boolean` (do wyłączania przycisku, np. gdy perfumy są już w kolekcji)

### `AddPerfumeModal.tsx`
- **Opis**: Modal, który pozwala użytkownikom przeglądać, wyszukiwać i dodawać perfumy z globalnej bazy danych do swojej kolekcji. Zarządza własnym stanem wyszukiwania i paginacji.
- **Główne elementy**: `Dialog` (Shadcn), `Input` do wyszukiwania, przewijana lista `PerfumeCard` w wariancie `'add'` oraz przycisk "Załaduj więcej".
- **Obsługiwane interakcje**:
  - Wpisywanie tekstu w polu wyszukiwania (z debouncingiem).
  - Kliknięcie przycisku "Załaduj więcej" w celu doładowania kolejnej strony wyników.
  - Kliknięcie przycisku "Dodaj" na karcie perfum.
  - Zamknięcie modala klawiszem `Escape` lub kliknięciem na zewnątrz.
- **Typy**: `PerfumeListItemViewModel`, `PaginationDetails`.
- **Propsy**:
  - `isOpen: boolean`
  - `onClose: () => void`
  - `onPerfumeAdded: (newCollectionItem: CollectionItemDto) => void`
  - `existingCollectionIds: Set<string>` (do oznaczania, które perfumy są już w kolekcji)

## 5. Typy
Do implementacji widoku, oprócz istniejących DTO (`CollectionItemDto`, `PerfumeListItemDto`), zostaną wprowadzone dedykowane ViewModels. Ich celem jest rozszerzenie obiektów danych pochodzących z API o dodatkowe właściwości, które służą wyłącznie do zarządzania stanem interfejsu użytkownika (UI) i nie są przesyłane do serwera.

- **`CollectionItemViewModel`**
  ```typescript
  import type { CollectionItemDto } from '@/types';

  export type CollectionItemViewModel = CollectionItemDto & {
    isBeingRemoved?: boolean;
  };
  ```
  **Wyjaśnienie właściwości:**
  - `isBeingRemoved` (opcjonalny, `boolean`): Flaga stanu UI. Jest ustawiana na `true` w momencie kliknięcia przycisku "Usuń" na karcie. Umożliwia to natychmiastowe wyświetlenie wskaźnika ładowania (spinnera) na konkretnej karcie, dając użytkownikowi informację zwrotną, że jego akcja jest przetwarzana. Po zakończeniu operacji API, flaga wraca na `false`.

- **`PerfumeListItemViewModel`**
  ```typescript
  import type { PerfumeListItemDto } from '@/types';

  export type PerfumeListItemViewModel = PerfumeListItemDto & {
    isBeingAdded?: boolean;
    isInCollection?: boolean;
  };
  ```
  **Wyjaśnienie właściwości:**
  - `isBeingAdded` (opcjonalny, `boolean`): Flaga stanu UI, analogiczna do `isBeingRemoved`. Ustawiana na `true` po kliknięciu "Dodaj" w modalu, aby pokazać stan ładowania na przycisku i poinformować użytkownika o trwającej operacji.
  - `isInCollection` (opcjonalny, `boolean`): Flaga obliczana **wyłącznie po stronie klienta** (nie pochodzi z API). Przed wyświetleniem listy perfum w modalu, aplikacja sprawdza, które z nich należą już do kolekcji użytkownika. Jeśli tak, ta flaga jest ustawiana na `true`. Służy do proaktywnego wyłączenia przycisku "Dodaj", co zapobiega wysyłaniu zbędnych żądań do API i obsłudze błędów o duplikatach po stronie serwera.

## 6. Zarządzanie stanem
Zarządzanie stanem zostanie zrealizowane głównie za pomocą wbudowanych hooków React (`useState`, `useEffect`, `useCallback`). W celu poprawy czytelności i reużywalności kodu, logika zostanie wydzielona do dedykowanych, niestandardowych hooków.

- **`useCollection`**: Hook odpowiedzialny za logikę związaną z kolekcją użytkownika. Będzie zarządzał stanem ładowania, listą perfum (`CollectionItemViewModel[]`) oraz enkapsulował wywołania API do pobierania, dodawania i usuwania przedmiotów z kolekcji. Będzie używany wewnątrz `CollectionContainer`.

- **`usePublicPerfumes`**: Hook do zarządzania stanem wewnątrz `AddPerfumeModal`. Będzie obsługiwał stan wyszukiwania, paginację, listę dostępnych perfum (`PerfumeListItemViewModel[]`) oraz logikę pobierania danych z endpointu `/api/perfumes`.

## 7. Integracja API

- **Pobieranie kolekcji użytkownika**:
  - **Akcja**: Montowanie komponentu `CollectionContainer`.
  - **Endpoint**: `GET /api/collection`
  - **Odpowiedź (sukces)**: `{ data: CollectionItemDto[] }`
  - **Obsługa**: Dane zostaną zmapowane na `CollectionItemViewModel[]` i zapisane w stanie.

- **Wyszukiwanie i listowanie wszystkich perfum (w modalu)**:
  - **Akcja**: Zmiana wartości w polu wyszukiwania lub kliknięcie "Załaduj więcej".
  - **Endpoint**: `GET /api/perfumes?q={query}&page={page}&limit={limit}`
  - **Odpowiedź (sukces)**: `PaginatedPerfumesResponseDto`
  - **Obsługa**: Dane zostaną zmapowane na `PerfumeListItemViewModel[]`, oznaczając, które z nich są już w kolekcji użytkownika.

- **Dodawanie perfum do kolekcji**:
  - **Akcja**: Kliknięcie przycisku "Dodaj" na `PerfumeCard` w modalu.
  - **Endpoint**: `POST /api/collection`
  - **Ciało żądania**: `{ "perfume_id": string }`
  - **Odpowiedź (sukces)**: `AddPerfumeToCollectionResponseDto`
  - **Obsługa**: Po sukcesie modal zostanie zamknięty, a nowo dodany element zostanie dodany do stanu kolekcji w `CollectionContainer`, wywołując ponowne renderowanie siatki.

- **Usuwanie perfum z kolekcji**:
  - **Akcja**: Kliknięcie przycisku "Usuń" na `PerfumeCard` w siatce.
  - **Endpoint**: `DELETE /api/collection/{perfumeId}`
  - **Odpowiedź (sukces)**: `{ "message": string }`
  - **Obsługa**: Po sukcesie element zostanie usunięty ze stanu kolekcji w `CollectionContainer`.

## 8. Interakcje użytkownika
- **Przeglądanie kolekcji**: Użytkownik przewija siatkę swoich perfum. Interfejs jest w pełni responsywny w ramach widoku desktopowego.
- **Inicjowanie dodawania**: Użytkownik klika przycisk "Dodaj nowe perfumy", co otwiera `AddPerfumeModal`. Fokus automatycznie przenosi się na pole wyszukiwania.
- **Wyszukiwanie perfum**: Użytkownik wpisuje frazę w polu wyszukiwania w modalu. Lista jest filtrowana dynamicznie po krótkiej chwili bezczynności (debouncing).
- **Dodawanie perfum**: Użytkownik klika przycisk "Dodaj" na wybranej karcie w modalu. Przycisk natychmiastowo zmienia swój stan na nieaktywny i wyświetla ikonę ładowania (spinner), informując o przetwarzaniu akcji. Po pomyślnym dodaniu modal zamyka się, a w siatce kolekcji pojawia się nowa karta (z animacją).
- **Usuwanie perfum**: Użytkownik klika ikonę usuwania na karcie w swojej kolekcji. Ikona zostaje zastąpiona przez spinner, a przycisk staje się nieaktywny. Po pomyślnym usunięciu karta znika z siatki (z animacją).

## 9. Warunki i walidacja
- **Dostęp do widoku**: Logika na poziomie strony (`/src/pages/collection.astro`) lub middleware weryfikuje, czy użytkownik jest zalogowany. Jeśli nie, następuje przekierowanie. (Implementacja logowania jest pominięta zgodnie z wytycznymi).
- **Dodawanie duplikatów**: Przycisk "Dodaj" w modalu będzie nieaktywny (`disabled`), jeśli perfumy znajdują się już w kolekcji użytkownika. Stan ten jest weryfikowany na podstawie `existingCollectionIds` przekazanych do modala. Dodatkowo, API zwraca błąd `409 Conflict`, który będzie obsłużony na froncie.
- **Puste wyszukiwanie**: Jeśli wyszukiwanie w modalu nie zwróci wyników, zostanie wyświetlony odpowiedni komunikat.

## 10. Obsługa błędów
- **Błąd pobierania kolekcji**: Jeśli `GET /api/collection` zakończy się niepowodzeniem, `CollectionContainer` wyświetli komunikat o błędzie z możliwością ponowienia próby.
- **Błąd wyszukiwania perfum**: Jeśli `GET /api/perfumes` w modalu zwróci błąd, zostanie wyświetlony komunikat błędu wewnątrz modala.
- **Błąd dodawania perfum**:
  - `409 Conflict` (Duplikat): Zostanie wyświetlony modal informacyjny z komunikatem "Te perfumy są już w Twojej kolekcji".
  - `404 Not Found` (Perfumy nie istnieją): Wyświetlenie komunikatu o błędzie.
  - Inne błędy serwera (`5xx`): Wyświetlenie ogólnego komunikatu o błędzie.
- **Błąd usuwania perfum**: W przypadku błędu, zostanie wyświetlony tymczasowy komunikat (np. toast/sonner) informujący o niepowodzeniu operacji, a karta perfum pozostanie w siatce.

## 12. Kroki implementacji
1.  **Struktura plików**: Stworzenie nowych plików i folderów: `/src/pages/collection.astro`, `/src/components/collection/`, `/src/components/shared/`, `/src/components/hooks/`.
2.  **Typy i Hooki**: Zdefiniowanie typów `ViewModel` (`CollectionItemViewModel`, `PerfumeListItemViewModel`). Implementacja niestandardowych hooków `useCollection` i `usePublicPerfumes`.
3.  **Komponenty UI (`shared`)**: Implementacja komponentów `PerfumeCard` (z wariantami) oraz `SkeletonCard` przy użyciu komponentów Shadcn/ui.
4.  **Komponenty widoku (`collection`)**: Implementacja komponentów `EmptyState`, `CollectionGrid` oraz `AddPerfumeModal`, wykorzystując stworzone wcześniej komponenty UI i hooki.
5.  **Główny kontener**: Implementacja `CollectionContainer.tsx`, integracja hooka `useCollection`, zarządzanie stanami widoku i obsługa modala.
6.  **Strona Astro**: Stworzenie strony `/src/pages/collection.astro`, ustawienie layoutu z motywem "Midnight Mode" i osadzenie w niej komponentu `CollectionContainer` jako interaktywnej wyspy (`client:load`).
7.  **Stylowanie**: Dopracowanie stylów Tailwind CSS dla wszystkich komponentów, w tym siatki i ciemnego motywu, oraz dodanie płynnych przejść (transitions) dla operacji dodawania/usuwania.
8.  **Testowanie i poprawki**: Ręczne przetestowanie wszystkich interakcji użytkownika, obsługi stanów oraz scenariuszy błędów.
