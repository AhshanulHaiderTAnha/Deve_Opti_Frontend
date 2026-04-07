import { useState, useEffect, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { legalService, LegalContent } from '../../services/legalService';
import LegalPageSkeleton from './LegalPageSkeleton';

interface LegalPageBaseProps {
  type: 'terms' | 'privacy' | 'cookies';
  title: string;
}

export default function LegalPageBase({ type, title }: LegalPageBaseProps) {
  const [data, setData] = useState<LegalContent | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [activeSection, setActiveSection] = useState('');

  const fetchData = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const result = await legalService.getLegalContent(type);
      setData(result);
      if (result.sections.length > 0) {
        setActiveSection(String(result.sections[0].id));
      }
    } catch (err) {
      setError('Failed to load content. Please try again later.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, [type]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  useEffect(() => {
    const handleScroll = () => {
      if (!data || !data.sections) return;
      const scrollPosition = window.scrollY + 150;

      for (const section of data.sections) {
        const element = document.getElementById(String(section.id));
        if (element) {
          const { offsetTop, offsetHeight } = element;
          if (scrollPosition >= offsetTop && scrollPosition < offsetTop + offsetHeight) {
            setActiveSection(String(section.id));
            break;
          }
        }
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [data]);

  const scrollToSection = (id: string | number) => {
    const stringId = String(id);
    setActiveSection(stringId);
    const element = document.getElementById(stringId);
    if (element) {
      const offset = 100;
      const elementPosition = element.getBoundingClientRect().top;
      const offsetPosition = elementPosition + window.pageYOffset - offset;

      window.scrollTo({
        top: offsetPosition,
        behavior: 'smooth'
      });
    }
  };

  if (loading) return <LegalPageSkeleton />;

  if (error || !data) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 p-6 text-center">
        <div className="max-w-md bg-white p-12 rounded-3xl border border-gray-100 shadow-xl">
          <div className="w-20 h-20 bg-red-50 text-red-500 rounded-full flex items-center justify-center mx-auto mb-6 text-3xl">
            <i className="ri-error-warning-line"></i>
          </div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Oops! Something went wrong</h2>
          <p className="text-gray-500 mb-8">{error}</p>
          <button
            onClick={fetchData}
            className="w-full py-4 bg-orange-500 text-white rounded-2xl font-bold shadow-lg shadow-orange-200 hover:shadow-orange-300 transition-all flex items-center justify-center gap-2"
          >
            <i className="ri-refresh-line"></i> Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-orange-50 font-['Inter',sans-serif]">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 sticky top-0 z-50 backdrop-blur-md bg-white/80">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <Link to="/" className="flex items-center gap-2 text-gray-900 hover:text-orange-600 transition-all font-semibold">
            <i className="ri-arrow-left-line text-xl"></i>
            <span>Back to Home</span>
          </Link>
          <div className="text-sm text-gray-400 font-medium tracking-tight">Last Updated: {data.lastUpdated}</div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-12">
        <div className="flex flex-col lg:flex-row gap-12">
          {/* Table of Contents Sidebar */}
          <aside className="hidden lg:block w-72 flex-shrink-0">
            <div className="sticky top-28 bg-white/60 backdrop-blur-sm rounded-2xl border border-gray-200/50 p-8 shadow-sm">
              <h3 className="font-bold text-gray-900 mb-6 text-xs uppercase tracking-[0.2em]">Table of Contents</h3>
              <nav className="space-y-1.5">
                {data.sections.map((section) => (
                  <button
                    key={section.id}
                    onClick={() => scrollToSection(section.id)}
                    className={`w-full text-left px-4 py-2.5 rounded-xl text-sm transition-all duration-300 transform ${activeSection === section.id
                      ? 'bg-orange-500 text-white font-bold shadow-lg shadow-orange-200 translate-x-2'
                      : 'text-gray-500 hover:bg-gray-50 hover:text-gray-900'
                      }`}
                  >
                    {section.title}
                  </button>
                ))}
              </nav>
            </div>
          </aside>

          {/* Main Content */}
          <main className="flex-1 bg-white rounded-[2.5rem] border border-gray-100 p-8 lg:p-16 shadow-xl shadow-gray-200/50">
            <div className="max-w-3xl">
              <div className="mb-12">
                <h1 className="text-5xl font-extrabold text-gray-900 tracking-tight mb-6">{data.title || title}</h1>
                <p className="text-lg text-gray-500 leading-relaxed font-medium">
                  We are committed to transparency and providing clear information about our legal policies.
                </p>
              </div>

              {data.sections.map((section, index) => (
                <section key={section.id} id={String(section.id)} className="mb-16 scroll-mt-28">
                  <h2 className="text-3xl font-bold text-gray-900 mb-6 flex items-center gap-4">
                    <span className="w-10 h-10 bg-orange-100 text-orange-600 rounded-2xl flex items-center justify-center text-lg font-black flex-shrink-0">
                      {index + 1}
                    </span>
                    {section.title}
                  </h2>
                  <div
                    className="prose prose-orange prose-lg max-w-none text-gray-600 leading-relaxed text-base"
                    dangerouslySetInnerHTML={{ __html: section.content }}
                  />
                </section>
              ))}

              {/* Final Footer Info */}
              <div className="pt-12 border-t border-gray-100 text-center opacity-50">
                <p className="text-sm font-medium">
                  By using our platform, you acknowledge that you have read and understood our policies.
                </p>
              </div>
            </div>
          </main>
        </div>
      </div>
    </div>
  );
}
