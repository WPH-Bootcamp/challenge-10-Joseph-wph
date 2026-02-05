"use client";

import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { createPost, getMyProfile } from "@/lib/api";
import { getAuthToken } from "@/lib/auth";
import type { User } from "@/types/blog";
import { Button } from "@/ui/button";
import { Input } from "@/ui/input";
import { Label } from "@/ui/label";
import { Alert, AlertDescription } from "@/ui/alert";
import { AlertCircle, Upload } from "lucide-react";
import { RichTextEditor, sanitizeHtml } from "@/components/rich-text-editor";

export default function WritePostPage() {
  const router = useRouter();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [user, setUser] = useState<User | null>(null);
  const [formData, setFormData] = useState({
    title: "",
    content: "",
    tags: "",
  });
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string>("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    const token = getAuthToken();
    if (!token) {
      router.push("/login");
      return;
    }

    getMyProfile(token)
      .then(setUser)
      .catch(() => {
        router.push("/login");
      });
  }, [router]);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        setError("Image size must be less than 5MB");
        return;
      }
      if (!file.type.match(/image\/(jpeg|jpg|png)/)) {
        setError("Only PNG or JPG images are allowed");
        return;
      }
      setImageFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
      setError("");
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    const file = e.dataTransfer.files?.[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        setError("Image size must be less than 5MB");
        return;
      }
      if (!file.type.match(/image\/(jpeg|jpg|png)/)) {
        setError("Only PNG or JPG images are allowed");
        return;
      }
      setImageFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
      setError("");
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    const token = getAuthToken();
    if (!token) {
      router.push("/login");
      return;
    }

    try {
      const data = new FormData();
      data.append("title", formData.title);
      // Sanitize content before submitting
      const sanitizedContent = sanitizeHtml(formData.content);
      data.append("content", sanitizedContent);
      if (formData.tags) {
        data.append("tags", formData.tags);
      }
      if (imageFile) {
        data.append("image", imageFile);
      }

      const post = await createPost(data, token);
      router.push(`/posts/${post.id}`);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to create post");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto max-w-4xl px-4 py-8">
        <form onSubmit={handleSubmit} className="space-y-6">
          {error && (
            <Alert variant="destructive">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          <div className="space-y-2">
            <Label htmlFor="title">Title</Label>
            <Input
              id="title"
              type="text"
              placeholder="Enter your title"
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              required
              disabled={loading}
              className="text-base"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="content">Content</Label>
            <RichTextEditor
              value={formData.content}
              onChange={(content) => setFormData({ ...formData, content })}
              placeholder="Enter your content"
              disabled={loading}
            />
          </div>

          <div className="space-y-2">
            <Label>Cover Image</Label>
            <div
              className="border-2 border-dashed rounded-lg p-8 text-center cursor-pointer hover:border-primary transition-colors"
              onDragOver={handleDragOver}
              onDrop={handleDrop}
              onClick={() => fileInputRef.current?.click()}
            >
              {imagePreview ? (
                <div className="space-y-4">
                  <img
                    src={imagePreview}
                    alt="Preview"
                    className="max-h-48 mx-auto rounded-lg object-cover"
                  />
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={(e) => {
                      e.stopPropagation();
                      setImageFile(null);
                      setImagePreview("");
                    }}
                  >
                    Remove Image
                  </Button>
                </div>
              ) : (
                <div className="space-y-4">
                  <Upload className="h-12 w-12 mx-auto text-muted-foreground" />
                  <div>
                    <p className="text-sm">
                      <span className="text-primary font-medium">Click to upload</span> or drag and drop
                    </p>
                    <p className="text-xs text-muted-foreground mt-1">
                      PNG or JPG (max. 5mb)
                    </p>
                  </div>
                </div>
              )}
              <input
                ref={fileInputRef}
                type="file"
                accept="image/jpeg,image/jpg,image/png"
                onChange={handleImageChange}
                className="hidden"
                disabled={loading}
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="tags">Tags</Label>
            <Input
              id="tags"
              type="text"
              placeholder="Enter your tags"
              value={formData.tags}
              onChange={(e) => setFormData({ ...formData, tags: e.target.value })}
              disabled={loading}
              className="text-base"
            />
          </div>

          <div className="flex justify-center pt-4">
            <Button
              type="submit"
              disabled={loading}
              className="w-full max-w-md bg-blue-600 hover:bg-blue-700 text-white"
              size="lg"
            >
              {loading ? "Publishing..." : "Finish"}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
