const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

export interface BlogAuthor {
  id: number;
  name: string;
}

export interface BlogPost {
  id: number;
  title: string;
  slug: string;
  content: string; // HTML from RichTextEditor
  featured_image: string | null;
  image_url: string | null;
  status: 'published' | 'draft';
  meta_title: string | null;
  meta_description: string | null;
  meta_keywords: string | null;
  author?: BlogAuthor;
  created_at: string;
  updated_at: string;
}

export interface BlogListResponse {
  blogs: BlogPost[];
  meta: {
    current_page: number;
    last_page: number;
    per_page: number;
    total: number;
  };
}

export const blogService = {
  async getBlogs(page = 1, perPage = 10): Promise<BlogListResponse> {
    const response = await fetch(`${API_BASE_URL}/public/blogs?page=${page}&per_page=${perPage}`, {
      headers: {
        'Accept': 'application/json'
      }
    });

    if (!response.ok) {
      throw new Error('Failed to fetch blogs');
    }

    return await response.json();
  },

  async getBlogBySlug(slug: string): Promise<BlogPost> {
    const response = await fetch(`${API_BASE_URL}/public/blogs/${slug}`, {
      headers: {
        'Accept': 'application/json'
      }
    });

    if (!response.ok) {
      if (response.status === 404) {
        throw new Error('Blog post not found');
      }
      throw new Error('Failed to fetch blog details');
    }

    const { blog } = await response.json();
    return blog;
  }
};
