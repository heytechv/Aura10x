# REST API Plan

## 1. Resources

- **Perfume**: Represents a single perfume from the public catalog.
  - Corresponds to the `perfumes` table and its related public tables (`brands`, `notes`, etc.).
- **Collection**: Represents the user-specific list of perfumes they own.
  - Corresponds to the `user_collection` table.

## 2. Endpoints

### Resource: Perfume

#### 1. List & Search Perfumes

- **Method**: `GET`
- **URL Path**: `/api/perfumes`
- **Description**: Retrieves a list of all perfumes from the public catalog. Supports searching, filtering, and pagination. This endpoint is public and does not require authentication.
- **Query Parameters**:
  - `q` (string, optional): Search query to filter perfumes by name or brand.
  - `limit` (integer, optional, default: 20): Number of items to return per page.
  - `page` (integer, optional, default: 1): The page number for pagination.
- **Request Payload**: None
- **Response Payload (Success)**:
  ```json
  {
    "data": [
      {
        "id": "a1b2c3d4-e5f6-...",
        "name": "Sauvage",
        "slug": "dior-sauvage",
        "brand": {
          "name": "Dior",
          "slug": "dior"
        },
        "image_path": "/path/to/image.jpg"
      }
    ],
    "pagination": {
      "currentPage": 1,
      "totalPages": 10,
      "totalItems": 200
    }
  }
  ```
- **Success Codes**:
  - `200 OK`: Successfully retrieved the list of perfumes.
- **Error Codes**:
  - `400 Bad Request`: Invalid query parameters (e.g., `limit` is not a number).

---

### Resource: Collection

#### 1. Get User's Collection

- **Method**: `GET`
- **URL Path**: `/api/collection`
- **Description**: Retrieves the list of perfumes in the authenticated user's personal collection. Requires authentication.
- **Query Parameters**: None
- **Request Payload**: None
- **Response Payload (Success)**:
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
- **Success Codes**:
  - `200 OK`: Successfully retrieved the user's collection.
- **Error Codes**:
  - `401 Unauthorized`: User is not authenticated.
  - `500 Internal Server Error`: An unexpected error occurred while fetching the collection.

#### 2. Add Perfume to Collection

- **Method**: `POST`
- **URL Path**: `/api/collection`
- **Description**: Adds a new perfume to the authenticated user's collection. Requires authentication.
- **Query Parameters**: None
- **Request Payload (JSON)**:
  ```json
  {
    "perfume_id": "a1b2c3d4-e5f6-..."
  }
  ```
- **Response Payload (Success)**:
  ```json
  {
    "message": "Perfume added successfully.",
    "data": {
      "user_id": "f1g2h3i4-j5k6-...",
      "perfume_id": "a1b2c3d4-e5f6-...",
      "added_at": "2024-07-28T10:00:00Z"
    }
  }
  ```
- **Success Codes**:
  - `201 Created`: The perfume was successfully added to the collection.
- **Error Codes**:
  - `400 Bad Request`: Invalid request body or missing `perfume_id`.
  - `401 Unauthorized`: User is not authenticated.
  - `404 Not Found`: The specified `perfume_id` does not exist in the public catalog.
  - `409 Conflict`: The user already has this perfume in their collection.

#### 3. Remove Perfume from Collection

- **Method**: `DELETE`
- **URL Path**: `/api/collection/{perfumeId}`
- **Description**: Removes a perfume from the authenticated user's collection. Requires authentication.
- **Query Parameters**: None
- **Request Payload**: None
- **Response Payload (Success)**:
  ```json
  {
    "message": "Perfume removed successfully."
  }
  ```
- **Success Codes**:
  - `200 OK`: The perfume was successfully removed.
- **Error Codes**:
  - `401 Unauthorized`: User is not authenticated.
  - `404 Not Found`: The user does not have a perfume with the specified `perfumeId` in their collection.
  - `500 Internal Server Error`: An unexpected error occurred.

## 3. Authentication and Authorization

- **Mechanism**: Authentication will be handled via Supabase Auth, integrating with Google OAuth 2.0. The Astro application will use the `@supabase/ssr` library to manage sessions on the server.
- **Implementation**:
  1. The client-side application initiates the Google OAuth flow.
  2. Upon successful login, Supabase returns a session which is stored securely in server-side cookies, managed by Astro's cookie utilities and `@supabase/ssr`.
  3. Astro middleware will run on every request to a protected endpoint (e.g., under `/api/collection`). This middleware will use `@supabase/ssr` to validate the session from the cookies.
  4. If the session is valid, the middleware initializes the Supabase client with the user's access token and attaches it to the request context (`context.locals.supabase`).
  5. All subsequent database queries within the API route will automatically and securely apply the Row Level Security (RLS) policies defined in the database schema. The policy `auth.uid() = user_id` ensures that users can only interact with their own data in the `user_collection` table.

## 4. Validation and Business Logic

- **Server-Side Validation**: All incoming data in Astro API routes (for `POST` and `DELETE` requests) will be validated before database interaction. A library like Zod will be used to enforce type safety and presence checks.
- **Validation Rules**:
  - **Add Perfume**: The `perfume_id` in the `POST /api/collection` request must be a valid UUID and must correspond to an existing record in the `perfumes` table.
  - **Remove Perfume**: The `{perfumeId}` parameter in the `DELETE /api/collection/{perfumeId}` request must be a valid UUID.
- **Business Logic Implementation**:
  - **Uniqueness**: The database's composite primary key `(user_id, perfume_id)` on the `user_collection` table prevents duplicate entries. The API route will catch the resulting database error and return a `409 Conflict` status code to the client.
  - **Authorization**: Business logic does not need to perform manual user ID checks (e.g., `WHERE user_id = ...`). This is handled entirely by the database's RLS policies, making the application code cleaner and more secure. The API layer (Astro API routes and middleware) is responsible for ensuring a user is authenticated before attempting any database operation on protected resources.
