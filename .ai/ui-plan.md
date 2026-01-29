# Architektura UI dla AURA (MVP v1)

## 1. Przegląd struktury UI

Architektura interfejsu użytkownika aplikacji AURA w wersji MVP v1 opiera się na wyraźnym podziale na dwie główne strefy: publiczną i prywatną. Strefa publiczna, reprezentowana przez **Stronę Główną**, ma charakter informacyjny i wykorzystuje jasny motyw graficzny. Strefa prywatna, czyli strona **Moja Kolekcja**, jest dostępna wyłącznie dla zalogowanych użytkowników, wykorzystuje dedykowany ciemny motyw ("Midnight Mode") i stanowi centrum interakcji z aplikacją.

Kluczowa funkcjonalność – dodawanie perfum do kolekcji – została scentralizowana w dedykowanym **modalu**, aby uprościć interfejs i zapewnić spójne doświadczenie. Nawigacja jest minimalistyczna, dynamicznie dostosowując się do statusu zalogowania użytkownika. Architektura kładzie nacisk na obsługę stanów (ładowanie, błędy, puste widoki) w celu zapewnienia płynnego i zrozumiałego doświadczenia użytkownika (UX), z uwzględnieniem standardów dostępności (a11y) i bezpieczeństwa.

## 2. Lista widoków

### Widok 1: Strona Główna
- **Nazwa widoku**: Strona Główna
- **Ścieżka widoku**: `/`
- **Główny cel**: Przedstawienie wartości aplikacji AURA nowym użytkownikom i zachęcenie ich do założenia konta lub przejścia do swojej kolekcji.
- **Kluczowe informacje do wyświetlenia**:
    - Krótki opis przeznaczenia aplikacji.
    - Wezwanie do działania (CTA) prowadzące do strony "Moja Kolekcja".
- **Kluczowe komponenty widoku**:
    - `Nawigacja`: Główny pasek nawigacyjny.
    - Treść informacyjna.
- **UX, dostępność i względy bezpieczeństwa**:
    - **UX**: Jasny, przejrzysty interfejs (Light Mode) skupiony na jednym celu.
    - **Dostępność**: Poprawna struktura nagłówków i semantyka HTML.
    - **Bezpieczeństwo**: Widok publiczny, nie wymaga specjalnych zabezpieczeń.

### Widok 2: Moja Kolekcja
- **Nazwa widoku**: Moja Kolekcja
- **Ścieżka widoku**: `/collection`
- **Główny cel**: Umożliwienie zalogowanemu użytkownikowi przeglądania, dodawania i usuwania perfum ze swojej osobistej kolekcji.
- **Kluczowe informacje do wyświetlenia**:
    - Siatka perfum należących do użytkownika.
    - Komunikat dla pustego stanu, jeśli kolekcja jest pusta.
    - Przycisk inicjujący dodawanie nowych perfum.
- **Kluczowe komponenty widoku**:
    - `Nawigacja` (w ciemnym motywie).
    - `SiatkaKolekcji`: Kontener wyświetlający karty perfum.
    - `KartaPerfum`: Reprezentacja pojedynczego zapachu w kolekcji z opcją usunięcia.
    - `ModalDodajPerfumy` (uruchamiany przez przycisk).
    - `SzkieletKarty`: Komponent "skeleton" wyświetlany podczas ładowania danych.
    - `KomunikatStanuPustego`: Informacja z wezwaniem do działania.
- **UX, dostępność i względy bezpieczeństwa**:
    - **UX**:
        - Dedykowany ciemny motyw ("Midnight Mode") dla całej strony, łącznie z nawigacją, w celu stworzenia immersyjnego doświadczenia.
        - Płynne animacje przy dodawaniu/usuwaniu elementów z siatki.
        - Obsługa stanu ładowania za pomocą komponentów "skeleton".
        - Przyjazny komunikat dla pustej kolekcji zachęcający do interakcji.
    - **Dostępność**:
        - Zapewnienie odpowiedniego kontrastu w ciemnym motywie.
        - Zarządzanie fokusem klawiatury, zwłaszcza przy interakcji z kartami perfum i przyciskiem usuwania.
    - **Bezpieczeństwo**:
        - Ścieżka chroniona – dostępna tylko dla zalogowanych użytkowników.
        - Niezalogowany użytkownik jest automatycznie przekierowywany na stronę logowania, a po pomyślnym logowaniu wraca do `/collection`.

### Widok 3 (Komponent): Modal Dodawania Perfum
- **Nazwa widoku**: Modal Dodaj Perfumy
- **Ścieżka widoku**: (Brak - komponent wewnątrz `/collection`)
- **Główny cel**: Umożliwienie użytkownikowi przeszukiwania ogólnej bazy perfum i dodawania wybranych pozycji do swojej kolekcji.
- **Kluczowe informacje do wyświetlenia**:
    - Pole wyszukiwania.
    - Lista wszystkich perfum z paginacją typu "Załaduj więcej".
    - Wyniki wyszukiwania.
- **Kluczowe komponenty widoku**:
    - `PoleWyszukiwania`.
    - `ListaPerfum` (wykorzystująca `KartaPerfum` w wariancie "do dodania").
    - Przycisk "Załaduj więcej".
    - Wskaźniki stanu ładowania i braku wyników.
    - `ModalInformacyjny` do obsługi błędów (np. próba dodania duplikatu, błąd serwera).
- **UX, dostępność i względy bezpieczeństwa**:
    - **UX**:
        - Scentralizowany i jedyny sposób dodawania perfum.
        - Paginacja "Załaduj więcej" zapobiega ładowaniu całej bazy na raz.
        - Jasna informacja zwrotna o pomyślnym dodaniu (zamknięcie modala i animacja w siatce) oraz o błędach (dedykowany modal).
    - **Dostępność**:
        - Prawidłowe zarządzanie fokusem – po otwarciu modala fokus trafia do pola wyszukiwania.
        - Możliwość zamknięcia modala klawiszem `Escape`.
        - Etykiety ARIA dla interaktywnych elementów.
    - **Bezpieczeństwo**: Interakcje (dodawanie) są walidowane po stronie serwera (zgodnie z planem API).

## 3. Mapa podróży użytkownika

Główny przepływ dla nowego, niezalogowanego użytkownika:

1.  **Krok 1: Odkrycie**: Użytkownik ląduje na **Stronie Głównej (`/`)**, gdzie zapoznaje się z celem aplikacji.
2.  **Krok 2: Zainteresowanie**: Użytkownik klika link "Moja Kolekcja" w nawigacji.
3.  **Krok 3: Logowanie**: Aplikacja wykrywa brak sesji i przekierowuje użytkownika do procesu logowania przez Google.
4.  **Krok 4: Powrót**: Po pomyślnym zalogowaniu, użytkownik jest automatycznie przekierowywany z powrotem na stronę **Moja Kolekcja (`/collection`)**.
5.  **Krok 5: Pierwsze wrażenie**: Użytkownik widzi stronę "Moja Kolekcja" w ciemnym motywie, z komunikatem informującym, że jego kolekcja jest pusta, oraz z wyraźnym przyciskiem "Dodaj perfum".
6.  **Krok 6: Inicjacja dodawania**: Użytkownik klika przycisk "Dodaj perfum", co otwiera **Modal Dodawania Perfum**.
7.  **Krok 7: Wyszukiwanie i wybór**: W modalu użytkownik wpisuje nazwę perfum w polu wyszukiwania, przegląda wyniki i klika przycisk "Dodaj" przy wybranej pozycji.
8.  **Krok 8: Potwierdzenie**: Modal zamyka się, a na stronie "Moja Kolekcja" pojawia się nowo dodany przedmiot z subtelną animacją.
9.  **Krok 9: Zarządzanie kolekcją**: Użytkownik może teraz najechać na dodany element, aby wyświetlić i użyć opcji "Usuń".

## 4. Układ i struktura nawigacji

Nawigacja jest zaimplementowana jako pojedynczy, stały komponent nagłówka, który zmienia swój wygląd i zawartość w zależności od kontekstu.

- **Struktura**:
    - **Po lewej**: Logo i nazwa aplikacji (link do `/`).
    - **Po prawej**: Link "Moja Kolekcja" (link do `/collection`).
    - **Skrajnie po prawej (zależne od stanu autoryzacji)**:
        - **Użytkownik niezalogowany**: Przycisk "Zaloguj się".
        - **Użytkownik zalogowany**: Awatar z konta Google, który po kliknięciu rozwija menu z opcją "Wyloguj".
- **Zachowanie**:
    - **Zmiana motywu**: Tło nawigacji jest jasne na stronie głównej (`/`) i ciemne na stronie kolekcji (`/collection`), dopasowując się do motywu widoku.
    - **Wskaźnik aktywnej strony**: Link prowadzący do aktualnie wyświetlanej strony (`/collection`) jest wizualnie wyróżniony (np. innym tłem), aby imitować wciśnięty przycisk.

## 5. Kluczowe komponenty

Poniżej znajduje się lista kluczowych, reużywalnych komponentów, które tworzą fundament interfejsu użytkownika:

- **`Nawigacja`**: Wspomniany wcześniej, adaptacyjny nagłówek aplikacji.
- **`KartaPerfum`**: Uniwersalny komponent do wyświetlania pojedynczych perfum. Posiada warianty:
    - **Wariant "kolekcja"**: Z przyciskiem usuwania widocznym po najechaniu myszą/skupieniu.
    - **Wariant "dodaj"**: Zawsze widoczny przycisk "Dodaj".
- **`ModalDodajPerfumy`**: Komponent zawierający całą logikę wyszukiwania, listowania i paginacji perfum do dodania.
- **`ModalInformacyjny`**: Generyczny modal używany do komunikowania błędów (np. dodanie duplikatu, błąd serwera) lub innych ważnych informacji.
- **`SzkieletKarty`**: Komponent typu "skeleton" o kształcie `KartyPerfum`, używany do sygnalizowania stanu ładowania danych w siatkach.
- **`KomunikatStanuPustego`**: Komponent wyświetlany, gdy lista danych jest pusta (np. brak perfum w kolekcji), zawierający tekst i opcjonalne wezwanie do działania.
