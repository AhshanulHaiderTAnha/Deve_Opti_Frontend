import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import Navbar from '../home/components/Navbar';
import Footer from '../home/components/Footer';
import { blogService, BlogPost } from '../../services/blogService';

export default function BlogDetailsPage() {
  const { slug } = useParams<{ slug: string }>();
  const [blog, setBlog] = useState<BlogPost | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (slug) {
      fetchBlogDetails(slug);
    }
  }, [slug]);

  const fetchBlogDetails = async (blogSlug: string) => {
    setLoading(true);
    try {
      const data = await blogService.getBlogBySlug(blogSlug);
      setBlog(data);
      updateSEOMeta(data);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const updateSEOMeta = (post: BlogPost) => {
    // Update Document Title
    document.title = post.meta_title || post.title;

    // Update Meta Description
    let metaDescription = document.querySelector('meta[name="description"]');
    if (!metaDescription) {
      metaDescription = document.createElement('meta');
      metaDescription.setAttribute('name', 'description');
      document.head.appendChild(metaDescription);
    }
    metaDescription.setAttribute('content', post.meta_description || '');

    // Update Meta Keywords
    let metaKeywords = document.querySelector('meta[name="keywords"]');
    if (!metaKeywords) {
      metaKeywords = document.createElement('meta');
      metaKeywords.setAttribute('name', 'keywords');
      document.head.appendChild(metaKeywords);
    }
    metaKeywords.setAttribute('content', post.meta_keywords || '');
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-white">
        <Navbar />
        <div className="max-w-4xl mx-auto px-4 py-40 animate-pulse space-y-8 mt-16">
          <div className="h-10 bg-gray-200 rounded w-3/4 mx-auto"></div>
          <div className="h-64 bg-gray-200 rounded-[3rem]"></div>
          <div className="space-y-4">
            <div className="h-4 bg-gray-200 rounded"></div>
            <div className="h-4 bg-gray-200 rounded"></div>
            <div className="h-4 bg-gray-200 rounded w-5/6"></div>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  if (error || !blog) {
    return (
      <div className="min-h-screen bg-white">
        <Navbar />
        <div className="max-w-7xl mx-auto px-4 py-40 text-center mt-16">
          <div className="bg-red-50 p-12 rounded-[3rem] border border-red-100 max-w-2xl mx-auto">
            <i className="ri-error-warning-line text-5xl text-red-500 mb-6 inline-block"></i>
            <h2 className="text-3xl font-black text-gray-900 mb-4">{error || 'Post Not Found'}</h2>
            <Link to="/blogs" className="px-8 py-4 bg-gray-900 text-white rounded-2xl font-black text-sm uppercase tracking-widest hover:bg-black transition-all">
              Back to Blog
            </Link>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white">
      <Navbar />

      <article className="pt-32 pb-20 mt-16">
        {/* Blog Header */}
        <header className="max-w-4xl mx-auto px-4 text-center mb-16">
          <Link to="/blogs" className="inline-flex items-center text-orange-600 font-black text-xs uppercase tracking-widest mb-8 hover:gap-3 transition-all gap-2">
            <i className="ri-arrow-left-line"></i>
            Back to News
          </Link>
          <div className="flex items-center justify-center gap-4 text-xs font-bold text-gray-400 uppercase tracking-widest mb-6">
            <span className="bg-gray-100 px-4 py-2 rounded-xl text-gray-600">Article</span>
            <span>{new Date(blog.created_at).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}</span>
          </div>
          <h1 className="text-4xl lg:text-6xl font-black text-gray-900 leading-tight tracking-tight mb-8">
            {blog.title}
          </h1>
          <div className="flex items-center justify-center gap-4">
               <div className="h-12 w-12 bg-orange-100 rounded-full flex items-center justify-center text-orange-600">
                    <i className="ri-user-smile-line text-2xl"></i>
               </div>
               <div className="text-left">
                    <p className="text-xs font-black text-gray-400 uppercase tracking-widest">Written By</p>
                    <p className="font-bold text-gray-900">{blog.author?.name || 'Admin'}</p>
               </div>
          </div>
        </header>

        {/* Featured Image */}
        {blog.image_url && (
          <div className="max-w-6xl mx-auto px-4 mb-20">
            <div className="rounded-[4rem] overflow-hidden shadow-2xl shadow-orange-100 border border-gray-100">
              <img
                src={blog.image_url}
                alt={blog.title}
                className="w-full h-full max-h-[70vh] object-cover"
              />
            </div>
          </div>
        )}

        {/* Content Section */}
        <div className="max-w-3xl mx-auto px-4">
          <div 
            className="prose prose-lg prose-orange max-w-none 
                       prose-headings:font-black prose-headings:tracking-tight prose-headings:text-gray-900
                       prose-p:text-gray-600 prose-p:leading-loose prose-p:font-medium
                       prose-a:text-orange-600 prose-a:font-bold hover:prose-a:underline
                       prose-img:rounded-[2rem] prose-img:shadow-xl
                       prose-blockquote:border-l-4 prose-blockquote:border-orange-500 prose-blockquote:bg-orange-50 
                       prose-blockquote:p-6 prose-blockquote:rounded-r-2xl prose-blockquote:font-bold prose-blockquote:text-orange-900"
            dangerouslySetInnerHTML={{ __html: blog.content }}
          />
        </div>

        {/* Footer Meta */}
        <footer className="max-w-3xl mx-auto px-4 mt-20 pt-10 border-t border-gray-100">
          <div className="flex flex-col sm:flex-row justify-between items-center gap-8">
            <div className="flex gap-4">
              {blog.meta_keywords?.split(',').map((tag, i) => (
                <span key={i} className="text-[10px] font-black uppercase tracking-widest text-gray-400 bg-gray-50 px-3 py-1.5 rounded-lg border border-gray-100">
                  #{tag.trim()}
                </span>
              ))}
            </div>
            <div className="flex items-center gap-4">
              <span className="text-xs font-black text-gray-400 uppercase tracking-widest">Share on</span>
              <div className="flex gap-3">
                {[
                  { id: 'facebook', icon: 'ri-facebook-fill', url: `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(window.location.href)}` },
                  { id: 'twitter', icon: 'ri-twitter-x-fill', url: `https://twitter.com/intent/tweet?url=${encodeURIComponent(window.location.href)}&text=${encodeURIComponent(blog.title)}` },
                  { id: 'linkedin', icon: 'ri-linkedin-box-fill', url: `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(window.location.href)}` }
                ].map((social) => (
                  <button 
                    key={social.id} 
                    onClick={() => window.open(social.url, '_blank', 'width=600,height=400')}
                    className="h-10 w-10 bg-gray-50 rounded-xl flex items-center justify-center text-gray-400 hover:text-orange-600 hover:bg-orange-50 hover:border-orange-100 transition-all border border-gray-100 group"
                  >
                    <i className={`${social.icon} group-hover:scale-110 transition-transform`}></i>
                  </button>
                ))}
              </div>
            </div>
          </div>
        </footer>
      </article>

      <Footer />
    </div>
  );
}
