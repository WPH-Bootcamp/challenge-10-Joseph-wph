/**
<<<<<<< HEAD
 * API Utility
 * 
 * Helper functions untuk fetch data dari backend API
 * Kamu bisa modify atau extend sesuai kebutuhan
 */

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL;

/**
 * Generic fetch function dengan error handling
 */
async function fetchAPI<T>(endpoint: string): Promise<T> {
  try {
    const response = await fetch(`${API_BASE_URL}${endpoint}`);
    
    if (!response.ok) {
      throw new Error(`API Error: ${response.status} ${response.statusText}`);
    }
    
    const data = await response.json();
    return data;
  } catch (error) {
    console.error('API Fetch Error:', error);
    throw error;
  }
}

// TODO: Implement API functions sesuai dengan endpoint yang tersedia
// Contoh:
// export async function getBlogPosts() {
//   return fetchAPI<BlogPost[]>('/posts');
// }
//
// export async function getBlogPost(id: string) {
//   return fetchAPI<BlogPost>(`/posts/${id}`);
// }

export { fetchAPI, API_BASE_URL };
=======
 * API Utility - Ultra Flexible Version
 * Tries multiple endpoint variations to find the correct one
 */

import type {
  Post,
  User,
  Comment,
  Like,
  AuthResponse,
  RegisterData,
  LoginData,
  CreateCommentData,
} from "@/types/blog";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL;

if (!API_BASE_URL) {
  console.error("⚠️ NEXT_PUBLIC_API_URL is not defined in .env.local");
  throw new Error("NEXT_PUBLIC_API_URL is not defined");
}

console.log("🌐 API Base URL:", API_BASE_URL);

interface FetchOptions extends RequestInit {
  token?: string;
}

interface ApiResponse<T> {
  data?: T;
  posts?: T;
  message?: string;
  total?: number;
  page?: number;
  lastPage?: number;
  totalPages?: number;
}

async function fetchAPI<T>(
  endpoint: string,
  options: FetchOptions = {},
): Promise<T> {
  const { token, ...fetchOptions } = options;

  const headers: Record<string, string> = {
    "Content-Type": "application/json",
    ...(fetchOptions.headers as Record<string, string>),
  };

  if (token) {
    headers["Authorization"] = `Bearer ${token}`;
  }

  const url = `${API_BASE_URL}${endpoint}`;
  console.log(`📡 ${fetchOptions.method || "GET"} ${url}`);

  const response = await fetch(url, {
    ...fetchOptions,
    headers,
  });

  console.log(`📥 Response: ${response.status} ${response.statusText}`);

  if (!response.ok) {
    if (response.status === 401 && typeof window !== "undefined") {
      localStorage.removeItem("authToken");
      window.location.href = "/login";
    }

    const errorData = await response.json().catch(() => ({
      message: response.statusText,
    }));

    throw new Error(errorData.message || `HTTP ${response.status}`);
  }

  const data = await response.json();
  console.log(`✅ Data:`, data);
  return data;
}

// === Auth API ===

export async function register(data: RegisterData): Promise<AuthResponse> {
  return fetchAPI<AuthResponse>("/auth/register", {
    method: "POST",
    body: JSON.stringify(data),
  });
}

export async function login(data: LoginData): Promise<AuthResponse> {
  return fetchAPI<AuthResponse>("/auth/login", {
    method: "POST",
    body: JSON.stringify(data),
  });
}

// === Users API ===

export async function getMyProfile(token: string): Promise<User> {
  return fetchAPI<User>("/users/me", { token });
}

export async function getUserByUsername(username: string): Promise<User> {
  return fetchAPI<User>(`/users/by-username/${username}`);
}

export async function getUserById(id: string): Promise<User> {
  return fetchAPI<User>(`/users/${id}`);
}

// === Posts API ===

/**
 * Get posts with multiple endpoint fallbacks
 */
export async function getRecommendedPosts(
  page: number = 1,
  limit: number = 10,
): Promise<{ data: Post[]; total: number; page: number; lastPage: number }> {
  try {
    const response = await fetchAPI<{
      data: Post[];
      total: number;
      page: number;
      lastPage: number;
    }>(`/posts/recommended?page=${page}&limit=${limit}`);

    console.log(`✅ Recommended posts fetched: ${response.data.length} items`);

    return {
      data: response.data || [],
      total: response.total || 0,
      page: response.page || page,
      lastPage: response.lastPage || 1,
    };
  } catch (err) {
    console.error("❌ Failed to fetch recommended posts:", err);
    return {
      data: [],
      total: 0,
      page: 1,
      lastPage: 1,
    };
  }
}

/**
 * Get most liked posts with fallbacks
 */
export async function getMostLikedPosts(): Promise<Post[]> {
  try {
   
    const response = await fetchAPI<{
      data: Post[];
      total: number;
      page: number;
      lastPage: number;
    }>(`/posts/recommended?limit=50&page=1`);

    // Urutkan berdasarkan likesCount descending
    const sorted = (response.data || []).sort(
      (a, b) => b.likesCount - a.likesCount,
    );

    console.log(`✅ Most liked posts fetched: ${sorted.length} items`);

    return sorted.slice(0, 10);
  } catch (err) {
    console.error("❌ Failed to fetch most liked posts:", err);
    return [];
  }
}

export async function searchPosts(query: string): Promise<Post[]> {
  if (!query.trim()) return [];

  try {
    const response = await fetchAPI<ApiResponse<Post[]>>(
      `/posts/search?q=${encodeURIComponent(query)}`,
    );
    return response.data || response.posts || [];
  } catch {
    return [];
  }
}

export async function getPostById(id: string): Promise<Post> {
  return fetchAPI<Post>(`/posts/${id}`);
}

export async function getPostsByUsername(username: string): Promise<Post[]> {
  try {
    const response = await fetchAPI<ApiResponse<Post[]>>(
      `/posts/by-username/${username}`,
    );
    return response.data || response.posts || [];
  } catch {
    return [];
  }
}

export async function getPostsByUserId(userId: string): Promise<Post[]> {
  try {
    const response = await fetchAPI<ApiResponse<Post[]>>(
      `/posts/by-user/${userId}`,
    );
    return response.data || response.posts || [];
  } catch {
    return [];
  }
}

export async function createPost(data: FormData, token: string): Promise<Post> {
  const headers: Record<string, string> = {
    Authorization: `Bearer ${token}`,
  };

  const url = `${API_BASE_URL}/posts`;
  console.log(`📡 POST ${url}`);

  const response = await fetch(url, {
    method: "POST",
    headers,
    body: data,
  });

  if (!response.ok) {
    if (response.status === 401 && typeof window !== "undefined") {
      localStorage.removeItem("authToken");
      window.location.href = "/login";
    }

    const error = await response.json().catch(() => ({
      message: response.statusText,
    }));
    throw new Error(error.message || `HTTP ${response.status}`);
  }

  return response.json();
}

export async function updatePost(
  id: string,
  data: {
    title?: string;
    content?: string;
    excerpt?: string;
    published?: boolean;
  },
  token: string,
): Promise<Post> {
  return fetchAPI<Post>(`/posts/${id}`, {
    method: "PATCH",
    body: JSON.stringify(data),
    token,
  });
}

export async function deletePost(id: string, token: string): Promise<void> {
  await fetchAPI<void>(`/posts/${id}`, {
    method: "DELETE",
    token,
  });
}

export async function likePost(id: string, token: string): Promise<void> {
  await fetchAPI<void>(`/posts/${id}/like`, {
    method: "POST",
    token,
  });
}

export async function getPostLikes(id: string): Promise<Like[]> {
  try {
    const response = await fetchAPI<ApiResponse<Like[]>>(`/posts/${id}/likes`);
    return response.data || [];
  } catch {
    return [];
  }
}

// === Comments API ===

export async function getPostComments(postId: string): Promise<Comment[]> {
  try {
    const response = await fetchAPI<ApiResponse<Comment[]> | Comment[]>(
      `/posts/${postId}/comments`,
    );

    if (Array.isArray(response)) {
      return response;
    }
    return (response as ApiResponse<Comment[]>).data || [];
  } catch {
    return [];
  }
}

export async function createComment(
  postId: string,
  data: CreateCommentData,
  token: string,
): Promise<Comment> {
  return fetchAPI<Comment>(`/comments/${postId}`, {
    method: "POST",
    body: JSON.stringify(data),
    token,
  });
}

export async function deleteComment(
  commentId: string,
  token: string,
): Promise<void> {
  await fetchAPI<void>(`/comments/${commentId}`, {
    method: "DELETE",
    token,
  });
}

export async function updateProfile(
  data: FormData,
  token: string,
): Promise<User> {
  const headers: Record<string, string> = {
    Authorization: `Bearer ${token}`,
  };

  const response = await fetch(`${API_BASE_URL}/users/profile`, {
    method: "PATCH",
    headers,
    body: data,
  });

  if (!response.ok) {
    if (response.status === 401 && typeof window !== "undefined") {
      localStorage.removeItem("authToken");
      window.location.href = "/login";
    }

    const error = await response
      .json()
      .catch(() => ({ message: response.statusText }));
    throw new Error(error.message || `HTTP ${response.status}`);
  }

  return response.json();
}

export async function updatePassword(
  data: {
    currentPassword: string;
    newPassword: string;
    confirmPassword: string;
  },
  token: string,
): Promise<{ message: string }> {
  return fetchAPI<{ message: string }>("/users/password", {
    method: "PATCH",
    body: JSON.stringify(data),
    token,
  });
}

export async function getHealth(): Promise<{ status: string }> {
  return fetchAPI<{ status: string }>("/health");
}



// === My Posts API ===
export async function getMyPosts(token: string, page: number = 1, limit: number = 10): Promise<{ data: Post[]; total: number; page: number; lastPage: number }> {
  try {
    const response = await fetchAPI<{
      data: Post[];
      total: number;
      page: number;
      lastPage: number;
    }>(`/posts/my-posts?page=${page}&limit=${limit}`, { token });

    return {
      data: response.data || [],
      total: response.total || 0,
      page: response.page || page,
      lastPage: response.lastPage || 1,
    };
  } catch {
    return {
      data: [],
      total: 0,
      page: 1,
      lastPage: 1,
    };
  }
}

export { fetchAPI, API_BASE_URL };

>>>>>>> 03cad95 (“challenge-10-joseph-wph-done”)
