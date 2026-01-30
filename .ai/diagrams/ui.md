<architecture_analysis>
1.  **Lista komponentów:**
    *   **Strony Astro:** `index.astro` (Strona Główna), `collection.astro` (Moja Kolekcja - chroniona), `login.astro` (Strona Logowania).
    *   **Layout Astro:** `Layout.astro` (główny szablon).
    *   **Komponenty Astro (współdzielone):** `Navigation.astro`.
    *   **Komponenty React (interaktywne):** `LoginForm.tsx`.
    *   **Logika serwerowa (wpływająca na UI):** `middleware/index.ts`, `api/auth/signin.ts`, `api/auth/signout.ts`.

2.  **Główne strony i ich komponenty:**
    *   **`index.astro`:** Używa `Layout.astro` i `Navigation.astro`. Wyświetla publiczną zawartość.
    *   **`collection.astro`:** Używa `Layout.astro` i `Navigation.astro`. Dostęp do niej jest chroniony przez `middleware`.
    *   **`login.astro`:** Używa `Layout.astro` i `Navigation.astro`. Osadza w sobie interaktywny komponent `LoginForm.tsx`.

3.  **Przepływ danych:**
    *   Głównym "danym" wpływającym na UI jest stan sesji (`Astro.locals.session`), ustalany przez `middleware`.
    *   Stan sesji jest odczytywany przez strony Astro (`index.astro`, `collection.astro`, `login.astro`).
    *   Strony przekazują informację o stanie zalogowania (lub komponenty same ją odczytują) do `Navigation.astro`, który warunkowo renderuje przycisk "Zaloguj się" lub "Wyloguj się".
    *   Komponent `LoginForm.tsx` zbiera dane od użytkownika (e-mail, hasło) i wysyła je do endpointu `api/auth/signin.ts` w celu weryfikacji.

4.  **Opis funkcjonalności komponentów:**
    *   **`middleware/index.ts`:** Działa na serwerze przed renderowaniem strony. Sprawdza ciasteczka, weryfikuje sesję i udostępnia `Astro.locals.session`. Przekierowuje niezalogowanych użytkowników próbujących dostać się do `/collection`.
    *   **`Layout.astro`:** Definiuje wspólną strukturę HTML dla wszystkich stron.
    *   **`Navigation.astro`:** Komponent współdzielony, wyświetlany na każdej stronie. Jego wygląd i akcje zależą od stanu zalogowania użytkownika.
    *   **`login.astro`:** Strona-kontener dla formularza logowania. Renderuje statyczną otoczkę i osadza komponent React.
    *   **`LoginForm.tsx`:** Interaktywny formularz. Zarządza swoim stanem (wprowadzane dane), wykonuje walidację po stronie klienta i komunikuje się z API w celu zalogowania użytkownika.
</architecture_analysis>

<mermaid_diagram>
```mermaid
flowchart TD
    subgraph "Logika Serwerowa"
        MW["middleware/index.ts"]
        API_IN["api/auth/signin.ts"]
        API_OUT["api/auth/signout.ts"]
    end

    subgraph "Architektura Stron i Komponentów"
        
        subgraph "Strony (Astro)"
            P_LOGIN["/login.astro"]
            P_INDEX["/index.astro"]
            P_COLL["/collection.astro"]
        end

        subgraph "Layout (Astro)"
            L_MAIN["Layout.astro"]
        end

        subgraph "Komponenty Współdzielone (Astro)"
            C_NAV["Navigation.astro"]
        end

        subgraph "Komponenty Interaktywne (React)"
            C_FORM["(LoginForm.tsx)"]
        end

    end
    
    %% Definicja stylów
    classDef astroComponent fill:#f0f8ff,stroke:#6495ed,stroke-width:2px
    classDef reactComponent fill:#fff0f5,stroke:#ff69b4,stroke-width:2px
    classDef serverLogic fill:#f5f5f5,stroke:#a9a9a9,stroke-width:2px
    
    class P_LOGIN,P_INDEX,P_COLL,L_MAIN,C_NAV astroComponent
    class C_FORM reactComponent
    class MW,API_IN,API_OUT serverLogic

    %% Powiązania
    USER_REQ("Żądanie użytkownika") --> MW
    
    MW -- "Sprawdza sesję" --> P_INDEX
    MW -- "Sprawdza sesję" --> P_COLL
    MW -- "Sprawdza sesję" --> P_LOGIN
    
    P_INDEX --> L_MAIN
    P_COLL --> L_MAIN
    P_LOGIN --> L_MAIN
    
    L_MAIN --> C_NAV
    
    P_LOGIN -- "Osadza komponent" --> C_FORM
    
    C_FORM -- "Wysyła dane (e-mail, hasło)" --> API_IN
    
    C_NAV -- "Stan zalogowania" --> MW
    C_NAV -- "Link do wylogowania" --> API_OUT
```
</mermaid_diagram>
