import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import Navbar from '../home/components/Navbar';
import Footer from '../home/components/Footer';
import { blogService, BlogPost } from '../../services/blogService';
import { useTranslation } from 'react-i18next';

export default function BlogListPage() {
  const { t } = useTranslation();
  const [blogs, setBlogs] = useState<BlogPost[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  useEffect(() => {
    fetchBlogs();
  }, [page]);

  const fetchBlogs = async () => {
    setLoading(true);
    try {
      const data = await blogService.getBlogs(page);
      setBlogs(data.blogs);
      setTotalPages(data.meta.last_page);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-white">
      <Navbar />

      {/* Header Section */}
      <section className="relative py-24 bg-gray-50 overflow-hidden mt-16">
        <div className="absolute inset-0 z-0">
          <img
            src="/assets/images/hero-bg-001.png"
            alt="Background"
            className="w-full h-full object-cover object-center opacity-30"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-transparent to-white"></div>
        </div>

        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-4xl lg:text-6xl font-black text-gray-900 mb-6 tracking-tight">
            Latest <span className="text-transparent bg-clip-text bg-gradient-to-r from-orange-600 to-amber-600">Insights</span> & News
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Stay updated with the latest trends, tips, and company announcements.
          </p>
        </div>
      </section>

      {/* Blog Grid */}
      <section className="py-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <div key={i} className="animate-pulse space-y-4">
                <div className="bg-gray-200 h-64 rounded-[2rem]"></div>
                <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                <div className="h-4 bg-gray-200 rounded w-1/2"></div>
              </div>
            ))}
          </div>
        ) : error ? (
          <div className="text-center py-20 bg-red-50 rounded-[3rem] border border-red-100">
            <i className="ri-error-warning-line text-4xl text-red-500 mb-4 inline-block"></i>
            <h3 className="text-xl font-bold text-gray-900 mb-2">{error}</h3>
            <button onClick={fetchBlogs} className="text-orange-600 font-bold hover:underline">Try Again</button>
          </div>
        ) : blogs.length === 0 ? (
          <div className="text-center py-40">
            <div className="w-24 h-24 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-6">
              <i className="ri-article-line text-4xl text-gray-300"></i>
            </div>
            <h3 className="text-2xl font-black text-gray-900">No blog posts found.</h3>
            <p className="text-gray-500 mt-2">Check back later for more updates.</p>
          </div>
        ) : (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
              {blogs.map((post) => (
                <Link
                  key={post.id}
                  to={`/blogs/${post.slug}`}
                  className="group bg-white rounded-[2.5rem] border border-gray-100 shadow-sm overflow-hidden hover:shadow-2xl hover:shadow-orange-100 transition-all duration-500 transform hover:-translate-y-2"
                >
                  <div className="relative h-64 overflow-hidden">
                    {post.image_url ? (
                      <img
                        src={post.image_url}
                        alt={post.title}
                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                      />
                    ) : (
                      <div className="w-full h-full bg-indigo-50 flex items-center justify-center">
                        <i className="ri-image-line text-4xl text-indigo-200"></i>
                      </div>
                    )}
                    <div className="absolute top-6 left-6">
                      <span className="bg-white/90 backdrop-blur-sm px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest text-orange-600 shadow-sm">
                        Article
                      </span>
                    </div>
                  </div>
                  <div className="p-8 space-y-4">
                    <div className="flex items-center gap-3 text-xs font-bold text-gray-400 uppercase tracking-widest">
                      <span>{new Date(post.created_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}</span>
                      <span className="w-1 h-1 bg-gray-300 rounded-full"></span>
                      <span>{post.author?.name || 'Admin'}</span>
                    </div>
                    <h3 className="text-2xl font-black text-gray-900 group-hover:text-orange-600 transition-colors leading-tight">
                      {post.title}
                    </h3>
                    <p className="text-gray-500 line-clamp-3 leading-relaxed font-medium">
                      {post.meta_description || 'Click to read more about this article and stay updated with the latest news.'}
                    </p>
                    <div className="pt-4 flex items-center text-orange-600 font-black text-sm uppercase tracking-widest group-hover:gap-3 transition-all gap-2">
                       Read Article
                      <i className="ri-arrow-right-line"></i>
                    </div>
                  </div>
                </Link>
              ))}
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="flex justify-center mt-16 space-x-3">
                {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
                  <button
                    key={p}
                    onClick={() => setPage(p)}
                    className={`h-12 w-12 rounded-2xl font-black text-sm transition-all ${
                      page === p
                        ? 'bg-gray-900 text-white shadow-lg shadow-gray-200'
                        : 'bg-white text-gray-400 hover:bg-gray-50 border border-gray-100'
                    }`}
                  >
                    {p}
                  </button>
                ))}
              </div>
            )}
          </>
        )}
      </section>

      <Footer />
    </div>
  );
}
