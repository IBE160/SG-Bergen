// digital-guess-who/lib/hooks/use-auth.ts
// A placeholder hook for authentication.
// In a real application, this would fetch the authenticated user's data.

interface User {
  id: string;
  email: string;
  // Add other user properties as needed
}

export function useAuth() {
  // For now, return a static mock user for development purposes.
  // In a real application, you would use a proper authentication context
  // or a hook that interacts with your auth provider (e.g., Supabase auth).
  const user: User | null = {
    id: "mock-user-id-123", // Replace with a real user ID when integrated with auth
    email: "mock-user@example.com",
  };

  return { user };
}