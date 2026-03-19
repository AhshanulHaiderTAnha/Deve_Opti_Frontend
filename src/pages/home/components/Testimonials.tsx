import { useState, useEffect } from 'react';

export default function Testimonials() {
  const [testimonials, setTestimonials] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

  const colors = [
    'from-orange-400 to-orange-600',
    'from-indigo-400 to-indigo-600',
    'from-pink-400 to-pink-600',
    'from-green-400 to-green-600',
    'from-purple-400 to-purple-600',
    'from-cyan-400 to-cyan-600'
  ];

  useEffect(() => {
    const fetchStories = async () => {
      try {
        const res = await fetch(`${API_BASE_URL}/public/success-stories`);
        const data = await res.json();
        if (res.ok) {
          // Based on screenshot, structure is { status: "success", data: [...] }
          const list = data.data || (Array.isArray(data) ? data : []);
          setTestimonials(list);
        }
      } catch (err) {
        console.error('Failed to fetch success stories');
      } finally {
        setIsLoading(false);
      }
    };
    fetchStories();
  }, []);

  return (
    <section className="py-20 bg-gradient-to-b from-gray-50 to-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-2 bg-orange-50 px-4 py-2 rounded-full mb-4">
            <i className="ri-chat-quote-line text-orange-600"></i>
            <span className="text-sm font-semibold text-orange-600">Success Stories</span>
          </div>
          <h2 className="text-4xl lg:text-5xl font-bold text-gray-900 mb-4">
            What Our Users Say
          </h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Join thousands of satisfied users earning daily. Real people, real earnings, real success stories.
          </p>
        </div>

        {/* Testimonials Grid */}
        {isLoading ? (
          <div className="flex justify-center py-12">
            <i className="ri-loader-4-line animate-spin text-3xl text-orange-500"></i>
          </div>
        ) : testimonials.length === 0 ? (
          <div className="text-center py-12 text-gray-500">
            No success stories available yet.
          </div>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {testimonials.map((testimonial, index) => (
              <div
                key={testimonial.id || index}
                className="bg-white rounded-2xl p-8 shadow-lg border border-gray-100 hover:shadow-2xl hover:-translate-y-1 transition-all duration-300"
              >
                {/* Header */}
                <div className="flex items-start justify-between mb-6">
                  <div className="flex items-center gap-3">
                    <div className={`w-14 h-14 bg-gradient-to-br ${colors[index % colors.length]} rounded-full flex items-center justify-center flex-shrink-0`}>
                      <span className="text-white font-bold text-lg">
                        {testimonial.name?.charAt(0) || 'U'}
                      </span>
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <h4 className="font-bold text-gray-900">{testimonial.name}</h4>
                      </div>
                      <p className="text-sm text-gray-500">{testimonial.designation || testimonial.role}</p>
                    </div>
                  </div>
                </div>

                {/* Star Rating */}
                <div className="flex items-center gap-1 mb-4">
                  {[...Array(Number(testimonial.rating || 5))].map((_, i) => (
                    <i key={i} className="ri-star-fill text-amber-400 text-lg"></i>
                  ))}
                </div>

                {/* Quote */}
                <div className="relative mb-6">
                  <i className="ri-double-quotes-l text-4xl text-orange-200 absolute -top-2 -left-2"></i>
                  <p className="text-gray-700 leading-relaxed pl-6 relative z-10">
                    {testimonial.review || testimonial.text}
                  </p>
                </div>

                {/* Stats */}
                <div className="flex items-center justify-between pt-6 border-t border-gray-100">
                  <div>
                    <p className="text-xs text-gray-500 mb-1">Total Earned</p>
                    <p className="text-lg font-bold text-green-600">{testimonial.total_earned || testimonial.earnings}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-xs text-gray-500 mb-1">Time Period</p>
                    <p className="text-sm font-semibold text-gray-900">{testimonial.time_period || testimonial.period}</p>
                  </div>
                </div>

                {/* Verified Badge */}
                <div className="mt-4 inline-flex items-center gap-2 bg-green-50 px-3 py-1.5 rounded-full">
                  <i className="ri-checkbox-circle-fill text-green-600 text-sm"></i>
                  <span className="text-xs font-semibold text-green-700">Verified User</span>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Bottom Stats */}
        <div className="mt-16 bg-gradient-to-r from-orange-50 to-amber-50 rounded-3xl p-8 border-2 border-orange-200">
          <div className="grid md:grid-cols-4 gap-6 text-center">
            <div>
              <div className="text-4xl font-bold text-gray-900 mb-2">4.9/5</div>
              <p className="text-sm text-gray-600">Average Rating</p>
              <div className="flex items-center justify-center gap-1 mt-2">
                {[...Array(5)].map((_, i) => (
                  <i key={i} className="ri-star-fill text-amber-400"></i>
                ))}
              </div>
            </div>
            <div>
              <div className="text-4xl font-bold text-gray-900 mb-2">12,453</div>
              <p className="text-sm text-gray-600">Active Users</p>
            </div>
            <div>
              <div className="text-4xl font-bold text-gray-900 mb-2">98%</div>
              <p className="text-sm text-gray-600">Satisfaction Rate</p>
            </div>
            <div>
              <div className="text-4xl font-bold text-gray-900 mb-2">24/7</div>
              <p className="text-sm text-gray-600">Support Available</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}