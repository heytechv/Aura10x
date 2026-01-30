# Schemat Bazy Danych - AURA (MVP v1)

Ten dokument opisuje uproszczony schemat bazy danych PostgreSQL (Supabase) dla MVP v1 aplikacji AURA, skupiając się wyłącznie na funkcjonalności "Moja Kolekcja".

## 1. Katalog Główny (Dane Publiczne)

Dane w tej sekcji są wstępnie zasilane (seed) i publicznie dostępne do odczytu.

### `brands` (Marki)
Znormalizowane informacje o markach perfum.
| Kolumna | Typ Danych | Ograniczenia | Opis |
| :--- | :--- | :--- | :--- |
| `id` | `uuid` | `PK`, `DEFAULT gen_random_uuid()` | Unikalny identyfikator. |
| `name` | `text` | `UNIQUE`, `NOT NULL` | Nazwa marki. |
| `slug` | `text` | `UNIQUE`, `NOT NULL` | Nazwa przyjazna dla URL. |
| `website` | `text` | | Oficjalna strona internetowa. |
| `country` | `text` | | Kraj pochodzenia. |
| `created_at` | `timestamptz` | `DEFAULT now()` | |

### `perfumers` (Perfumiarze)
Twórcy zapachów.
| Kolumna | Typ Danych | Ograniczenia | Opis |
| :--- | :--- | :--- | :--- |
| `id` | `uuid` | `PK`, `DEFAULT gen_random_uuid()`| Unikalny identyfikator. |
| `full_name`| `text` | `NOT NULL` | Imię i nazwisko perfumiarza. |

### `perfumes` (Perfumy)
Tabela "Golden Record" zawierająca zweryfikowane dane techniczne o perfumach.
| Kolumna | Typ Danych | Ograniczenia | Opis |
| :--- | :--- | :--- | :--- |
| `id` | `uuid` | `PK`, `DEFAULT gen_random_uuid()` | Unikalny identyfikator. |
| `brand_id` | `uuid` | `FK -> brands(id)` | Referencja do marki. |
| `name` | `text` | `NOT NULL` | Nazwa perfum. |
| `slug` | `text` | `UNIQUE`, `NOT NULL` | Nazwa przyjazna dla URL. |
| `concentration`| `text` | | Stężenie (np. 'EDP', 'EDT'). |
| `gender_official`| `text` | `CHECK (in ('Male', 'Female', 'Unisex'))`| Deklarowana płeć przez markę. |
| `release_year`| `integer` | | Rok wydania. |
| `image_path` | `text` | | Ścieżka do obrazka w Supabase Storage. |
| `description`| `text` | | Krótki opis zapachu. |
| `created_at` | `timestamptz` | `DEFAULT now()` | |

## 2. Struktura Zapachowa (Dane Publiczne)

### `notes` (Nuty Zapachowe)
Atomowe składniki zapachowe.
| Kolumna | Typ Danych | Ograniczenia | Opis |
| :--- | :--- | :--- | :--- |
| `id` | `uuid` | `PK`, `DEFAULT gen_random_uuid()` | Unikalny identyfikator. |
| `name` | `text` | `UNIQUE`, `NOT NULL` | Nazwa nuty (np. "Bergamotka"). |
| `family` | `text` | | Rodzina zapachowa (np. "Cytrusy"). |
| `image_path` | `text` | | Obrazek do wizualizacji (Supabase Storage). |

### `accords` (Akordy)
Wysokopoziomowe deskryptory "klimatu" zapachu.
| Kolumna | Typ Danych | Ograniczenia | Opis |
| :--- | :--- | :--- | :--- |
| `id` | `uuid` | `PK`, `DEFAULT gen_random_uuid()` | Unikalny identyfikator. |
| `name` | `text` | `UNIQUE`, `NOT NULL` | Nazwa akordu (np. "Drzewny"). |

### `perfume_perfumers` (Twórcy Perfum - Tabela Łącząca)
Tabela łącząca perfumy z ich twórcami (relacja wiele-do-wielu).
| Kolumna | Typ Danych | Ograniczenia |
| :--- | :--- | :--- |
| `perfume_id` | `uuid` | `FK -> perfumes(id) ON DELETE CASCADE` |
| `perfumer_id`| `uuid` | `FK -> perfumers(id) ON DELETE CASCADE` |
**PK**: `(perfume_id, perfumer_id)`

### `perfume_notes` (Nuty Perfum)
Struktura piramidy zapachowej, łącząca perfumy z nutami.
| Kolumna | Typ Danych | Ograniczenia | Opis |
| :--- | :--- | :--- | :--- |
| `perfume_id` | `uuid` | `FK -> perfumes(id) ON DELETE CASCADE` | |
| `note_id` | `uuid` | `FK -> notes(id) ON DELETE CASCADE` | |
| `pyramid_level`| `text` | `CHECK (in ('top', 'middle', 'base', 'linear'))`| Pozycja w piramidzie (głowa, serce, baza). |
| `prominence` | `integer` | `DEFAULT 1` | Postrzegana moc nuty (1-5). |
**PK**: `(perfume_id, note_id)`

### `perfume_accords` (Akordy Perfum)
Dominujące akordy w danych perfumach.
| Kolumna | Typ Danych | Ograniczenia | Opis |
| :--- | :--- | :--- | :--- |
| `perfume_id` | `uuid` | `FK -> perfumes(id) ON DELETE CASCADE` | |
| `accord_id` | `uuid` | `FK -> accords(id) ON DELETE CASCADE` | |
| `potency_value`| `integer` | `NOT NULL` | Siła/procentowy udział (0-100). |
**PK**: `(perfume_id, accord_id)`

## 3. Przestrzeń Użytkownika (Dane Prywatne)

### `auth.users` (Tabela Zarządzana przez Supabase)
**Ważna uwaga:** Ta tabela nie jest tworzona ani modyfikowana przez migracje. Jest to integralna część usługi Supabase Auth, która automatycznie zarządza użytkownikami. Nasze tabele (takie jak `user_collection`) odnoszą się do niej poprzez klucz obcy.
| Kluczowe Kolumny | Typ Danych | Opis |
| :--- | :--- | :--- |
| `id` | `uuid` | Unikalny identyfikator użytkownika, generowany przez Supabase Auth. |
| `email` | `text` | Adres email użytkownika. |
| `raw_user_meta_data` | `jsonb` | Metadane użytkownika, np. login. |

### `user_collection` (Kolekcja Użytkownika)
Prosta tabela łącząca, reprezentująca osobistą kolekcję perfum użytkownika.
| Kolumna | Typ Danych | Ograniczenia |
| :--- | :--- | :--- |
| `user_id` | `uuid` | `FK -> auth.users(id) ON DELETE CASCADE` |
| `perfume_id` | `uuid` | `FK -> perfumes(id) ON DELETE CASCADE` |
| `added_at` | `timestamptz` | `DEFAULT now()` |
**PK**: `(user_id, perfume_id)`

## 4. Indeksy i Wydajność

```sql
-- Indeksy dla Katalogu Głównego (szybsze wyszukiwanie)
CREATE INDEX idx_perfumes_brand_id ON perfumes(brand_id);
CREATE INDEX idx_perfumes_slug ON perfumes(slug);

-- Indeksy dla relacji (szybsze łączenie tabel)
CREATE INDEX idx_perfume_perfumers_perfume ON perfume_perfumers(perfume_id);
CREATE INDEX idx_perfume_notes_perfume ON perfume_notes(perfume_id);
CREATE INDEX idx_perfume_accords_perfume ON perfume_accords(perfume_id);

-- Indeks dla kolekcji użytkownika (szybsze filtrowanie dla zalogowanego użytkownika)
CREATE INDEX idx_user_collection_user ON user_collection(user_id);
```

## 5. Polityki RLS (Row Level Security)

### Publiczny Dostęp do Odczytu (Katalog)
*   **Tabele**: `brands`, `perfumers`, `perfumes`, `notes`, `accords`, `perfume_perfumers`, `perfume_notes`, `perfume_accords`
*   **Polityka**: `Zezwól na odczyt dla wszystkich użytkowników`
*   **Definicja**: `true` (dla operacji SELECT)
*   **Operacje zapisu**: W MVP v1 dane są zarządzane wyłącznie przez seeding (brak możliwości zapisu z poziomu aplikacji).

### Prywatny Dostęp Użytkownika
*   **Tabela**: `user_collection`
*   **Polityka**: `Użytkownicy mogą zarządzać tylko własną kolekcją`
*   **Definicja (dla wszystkich operacji)**: `auth.uid() = user_id`
