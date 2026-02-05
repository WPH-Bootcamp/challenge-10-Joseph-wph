/**
 * Auth Token Management
 * 
 * Helper functions to manage authentication tokens
 */

const TOKEN_KEY = "auth_token";

export function getAuthToken(): string | null {
  if (typeof window === "undefined") return null;
  return localStorage.getItem(TOKEN_KEY);
}

export function setAuthToken(token: string): void {
  if (typeof window === "undefined") return;
  localStorage.setItem(TOKEN_KEY, token);
  // Dispatch custom event to notify components
  window.dispatchEvent(new Event('authChange'));
}

export function removeAuthToken(): void {
  if (typeof window === "undefined") return;
  localStorage.removeItem(TOKEN_KEY);
  // Dispatch custom event to notify components
  window.dispatchEvent(new Event('authChange'));
}

export function isAuthenticated(): boolean {
  return !!getAuthToken();
}
