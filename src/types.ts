import type { Tables } from "./db/database.types";

// --- Database Entity Types ---

/**
 * Represents the "perfumes" table from the database.
 */
export type Perfume = Tables<"perfumes">;

/**
 * Represents the "brands" table from the database.
 */
export type Brand = Tables<"brands">;

/**
 * Represents the "user_collection" table from the database.
 */
export type UserCollection = Tables<"user_collection">;

// --- DTOs (Data Transfer Objects) ---

/**
 * DTO for an individual perfume item in a list.
 * Used in the `GET /api/perfumes` endpoint.
 *
 * @see PaginatedPerfumesResponseDto
 */
export type PerfumeListItemDto = Pick<
  Perfume,
  "id" | "name" | "slug" | "image_path"
> & {
  brand: Pick<Brand, "name" | "slug">;
};

/**
 * Represents pagination details for paginated responses.
 */
export type PaginationDetails = {
  currentPage: number;
  totalPages: number;
  totalItems: number;
};

/**
 * DTO for the paginated response of the perfume list.
 * Used in the `GET /api/perfumes` endpoint.
 */
export type PaginatedPerfumesResponseDto = {
  data: PerfumeListItemDto[];
  pagination: PaginationDetails;
};

/**
 * DTO for an individual item in the user's collection.
 * Includes nested perfume and brand details.
 * Used in the `GET /api/collection` endpoint.
 */
export type CollectionItemDto = Pick<UserCollection, "perfume_id" | "added_at"> & {
  perfume: Pick<Perfume, "name" | "slug" | "image_path"> & {
    brand: Pick<Brand, "name">;
  };
};

/**
 * DTO for the response when a perfume is successfully added to the collection.
 * Used in the `POST /api/collection` endpoint.
 */
export type AddPerfumeToCollectionResponseDto = {
  message: string;
  data: UserCollection;
};

// --- Command Models ---

/**
 * Command model for adding a perfume to the user's collection.
 * Represents the request payload for `POST /api/collection`.
 */
export type AddPerfumeToCollectionCommand = Pick<UserCollection, "perfume_id">;
