/**
 * Blog Types
 * 
 * TODO: Define types sesuai dengan response dari API
 * Contoh structure (sesuaikan dengan API response yang sebenarnya):
 */

// export interface BlogPost {
//   id: string;
//   title: string;
//   content: string;
//   author: string;
//   createdAt: string;
//   image?: string;
//   category?: string;
//   // ... tambahkan fields lainnya sesuai API
// }

// export interface BlogPostListResponse {
//   posts: BlogPost[];
//   total: number;
//   page: number;
//   // ... tambahkan fields lainnya
// }
<<<<<<< HEAD
=======

// User Types
export interface User {
  id: string;
  username: string;
  name: string;
  email?: string;
  headline?: string;
  avatar?: string;
  avatarUrl?: string;
  createdAt: string;
  updatedAt: string;
}

export interface UserProfile extends User {
  postsCount?: number;
  followersCount?: number;
  followingCount?: number;
}

// Auth Types
export interface RegisterData {
  name: string;
  username?: string;
  email: string;
  password: string;
}

export interface LoginData {
  email: string;
  password: string;
}

export interface AuthResponse {
  user: User;
  token: string;
}

// Post Types
export interface Post {
  id: string;
  title: string;
  content: string;
  excerpt?: string;
  slug?: string;
  imageUrl?: string;
  imagePublicId?: string;
  authorId: string;
  author: User;
  likesCount: number;
  commentsCount: number;
  isLiked?: boolean;
  tags?: string[];
  createdAt: string;
  updatedAt: string;
}

export interface CreatePostData {
  title: string;
  content: string;
  excerpt?: string;
  imageUrl?: string;
  tags?: string[];
}

export interface UpdatePostData {
  title?: string;
  content?: string;
  excerpt?: string;
  imageUrl?: string;
  tags?: string[];
}

// Comment Types
export interface Comment {
  id: string;
  content: string;
  postId: string;
  authorId: string;
  author: User;
  createdAt: string;
  updatedAt: string;
}

export interface CreateCommentData {
  content: string;
}

// Like Types
export interface Like {
  id: string;
  postId: string;
  userId: string;
  user: User;
  createdAt: string;
}

// API Response Types
export interface PaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  pageSize: number;
  totalPages: number;
}

export interface ApiResponse<T> {
  data: T;
  message?: string;
}

export interface ApiError {
  message: string;
  statusCode: number;
  errors?: Record<string, string[]>;
}

>>>>>>> 03cad95 (“challenge-10-joseph-wph-done”)
