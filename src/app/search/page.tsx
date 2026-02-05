"use client";

import { Suspense, useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import { searchPosts } from "@/lib/api";
import type { Post } from "@/types/blog";
import { PostCard } from "@/components/post-card";
import { LoadingSpinner } from "@/components/loading-spinner";
import { Input } from "@/ui/input";
import { Button } from "@/ui/button";
import { Search } from "lucide-react";

function SearchContent() {
  const searchParams = useSearchParams();
  const [query, setQuery] = useState(searchParams.get("q") || "");
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(false);
  const [searched, setSearched] = useState(false);

  useEffect(() => {
    const q = searchParams.get("q");
    if (q) {
      setQuery(q);
      performSearch(q);
    }
  }, [searchParams]);

  const performSearch = async (searchQuery: string) => {
    if (!searchQuery.trim()) return;

    setLoading(true);
    setSearched(true);
    try {
      const results = await searchPosts(searchQuery);
      setPosts(results);
    } catch (err) {
      console.error("Search failed:", err);
      setPosts([]);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    performSearch(query);
  };

  return (
    <div className="min-h-screen">
      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-4xl font-bold mb-4">Search Posts</h1>
          <form onSubmit={handleSubmit} className="flex gap-2">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-muted-foreground" />
              <Input
                type="search"
                placeholder="Search for posts..."
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                className="pl-10 text-lg h-12"
              />
            </div>
            <Button type="submit" size="lg" disabled={loading}>
              Search
            </Button>
          </form>
        </div>

        {loading ? (
          <LoadingSpinner />
        ) : searched ? (
          <>
            <div className="mb-6">
              <p className="text-muted-foreground">
                {posts.length === 0
                  ? "No posts found"
                  : `Found ${posts.length} post${posts.length === 1 ? "" : "s"}`}
              </p>
            </div>

            {posts.length > 0 && (
              <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                {posts.map((post) => (
                  <PostCard key={post.id} post={post} />
                ))}
              </div>
            )}
          </>
        ) : (
          <div className="text-center py-12">
            <p className="text-muted-foreground">
              Enter a search query to find posts
            </p>
          </div>
        )}
      </div>
    </div>
  );
}

export default function SearchPage() {
  return (
    <Suspense fallback={<LoadingSpinner />}>
      <SearchContent />
    </Suspense>
  );
}
