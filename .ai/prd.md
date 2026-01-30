# Dokument wymagań produktu (PRD) - AURA (MVP v1)

Niniejszy dokument opisuje zakres funkcjonalny dla wersji **MVP v1**, która skupia się na jednej, kluczowej funkcji: **Moja Kolekcja**.

## 1. Przegląd produktu

AURA w wersji MVP v1 to aplikacja webowa typu desktop, która pomaga użytkownikom zarządzać ich cyfrową kolekcją perfum. Głównym celem jest umożliwienie posiadaczom perfum stworzenia i przeglądania swojej osobistej "półki" z zapachami.

W tej wersji aplikacja nie zawiera mechanizmów rekomendacyjnych ani profili kontekstowych. Użytkownik może jedynie dodawać perfumy z istniejącej bazy danych do swojej kolekcji i przeglądać je w dedykowanym interfejsie.

Aby zapisać kolekcję, użytkownik musi się zalogować. W trybie gościa dane nie są trwale zapisywane.

**Stylistyka UI:**
*   **Tryb Jasny (Light Mode):** Domyślny dla aplikacji.
*   **Tryb Ciemny (Midnight Mode):** Dedykowany wyłącznie dla sekcji **"Moja Kolekcja"**, aby stworzyć wrażenie "zanurzenia" w intymnym, osobistym świecie zapachów.

**Nawigacja:**
Wersja v1 posiada uproszczoną nawigację:
1.  Logo i nazwa (po lewej).
2.  Menu (po prawej) - link do "Moja Kolekcja".
3.  Profil (maksymalnie po prawej) - logowanie/ustawienia.

## 2. Problem użytkownika

1.  **Zarządzanie kolekcją:** Użytkownicy posiadający wiele perfum mają trudność z ich katalogowaniem i pamiętaniem, co posiadają.
2.  **Paraliż decyzyjny (nadmiar wyboru):** Posiadacze kolekcji perfum często używają tych samych zapachów nawykowo, zapominając o innych, które posiadają. Cyfrowa półka ma pomóc w ponownym odkrywaniu własnej kolekcji.

## 3. Wymagania funkcjonalne (Zakres v1)

### 3.1. Architektura
*   Platforma: Web Desktop.
*   Autoryzacja: Supabase Auth logowanie poprzez istniejące konta.
*   Przechowywanie danych: **Cloud Only** (Supabase).
*   Dane: Aplikacja będzie zasilana predefiniowaną bazą perfum (Seed Data).

### 3.2. Strona Moja Kolekcja (Dark Mode)
*   **Tryb UI**: Midnight UI.
*   **Widok Podstawowy**: Siatka (Grid) z flakonami perfum należących do użytkownika.
*   **Funkcjonalność**:
    *   Użytkownik (po zalogowaniu) może dodawać perfumy do swojej kolekcji.
    *   Dodawanie odbywa się poprzez wyszukanie i wybranie zapachu z ogólnej bazy danych.
    *   Użytkownik może usuwać perfumy ze swojej kolekcji.
    *   W tej wersji nie ma profili kontekstowych (np. "Randka", "Biuro") ani procentowego dopasowania. Istnieje tylko jedna, globalna kolekcja użytkownika.

## 4. Historyjki Użytkownika (v1 MVP)

| ID | Tytuł | Opis | Kryteria Akceptacji |
| :--- | :--- | :--- | :--- |
| **US-001** | **Logowanie i Zapis Kolekcji** | Jako użytkownik chcę mieć możliwość przeglądania aplikacji jako gość, ale muszę się zalogować, aby stworzyć i zapisać moją kolekcję perfum. | 1. Niezalogowany użytkownik widzi komunikat o konieczności logowania przy próbie dodania perfum.<br>2. Logowanie odbywa się przez Supabase Auth logowanie poprzez istniejące konta.<br>3. Zapisana kolekcja jest powiązana z kontem użytkownika. |
| **US-002** | **Zarządzanie Kolekcją** | Jako zalogowany użytkownik chcę móc dodawać i usuwać perfumy z mojej osobistej kolekcji. | 1. Istnieje przycisk "Dodaj do kolekcji" na widoku ogólnej bazy perfum.<br>2. Na stronie "Moja Kolekcja" widoczne są tylko perfumy dodane przez użytkownika.<br>3. Użytkownik może usunąć dowolny zapach ze swojej kolekcji. |
| **US-003** | **Przeglądanie Kolekcji** | Jako użytkownik chcę w estetyczny sposób przeglądać swoją kolekcję w dedykowanym, ciemnym interfejsie. | 1. Sekcja "Moja Kolekcja" używa "Midnight Mode".<br>2. Perfumy są wyświetlane w formie siatki. |

## 5. Wymagania niefunkcjonalne

### 5.1. Wymagania prawne i ograniczenia:
*   Dane osobowe użytkowników przechowywane zgodnie z RODO.
*   Prawo do wglądu i usunięcia danych na wniosek użytkownika.

## 6. Granice v1 (Wyłączone z zakresu)
*   **Moduł Profilera (AI Wizard)**: Cały proces zadawania pytań przez AI w celu stworzenia profilu zapachowego.
*   **Wizytówka (Bento Grid)**: Wizualne podsumowanie profilu użytkownika.
*   **Profile Kontekstowe**: Możliwość tworzenia sub-kolekcji (np. na różne okazje).
*   **Rekomendacje i Dopasowanie %**: System nie będzie sugerował perfum ani obliczał procentowego dopasowania.
*   **Moduł Scent Lab (Edukacja)**.
*   **Automatyczne scrapowanie danych** (używamy Seed Data).
*   **Responsywność RWD** (tylko Desktop).

## 7. Metryki sukcesu

Sukces wersji MVP v1 będzie mierzony za pomocą następujących kluczowych wskaźników (KPI):

### 7.1. Zaangażowanie użytkowników (User Engagement)
*   **Wskaźnik adopcji funkcji**: Procent zarejestrowanych użytkowników, którzy dodali co najmniej 1 perfum do swojej kolekcji.
*   **Średnia wielkość kolekcji**: Średnia liczba perfum w kolekcji na aktywnego użytkownika.
*   **Aktywność**: Liczba interakcji (dodawanie/usuwanie) w przeliczeniu na sesję.

### 7.2. Retencja użytkowników (User Retention)
*   **Wskaźnik powrotów**: Procent użytkowników, którzy wracają do aplikacji w ciągu 7 i 30 dni od pierwszej wizyty.

### 7.3. Wydajność techniczna (Technical Performance)
*   **Szybkość ładowania**: Czas ładowania strony "Moja Kolekcja" dla użytkownika z >50 perfumami.
