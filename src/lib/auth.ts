// src/lib/auth.ts
// This is a temporary solution for development and testing.
// In a production environment, you should use a proper authentication system.

export const MOCK_USER_ID = "d1a04b0e-dfaa-4ea5-8bf6-221e60b6ea48";

/**
 * In a real application, you would have a function that gets the
 * current user's session from Supabase or another auth provider.
 * For now, we'll just return a mock session.
 */
export const getMockSession = () => {
  return {
    user: {
      id: MOCK_USER_ID,
    },
  };
};
