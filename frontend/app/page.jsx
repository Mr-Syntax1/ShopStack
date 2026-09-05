import { homeMetadata } from "@/metadata/home";
import HeroSection from "@/components/HeroSection";
import LatestProducts from "@/components/LatestProducts";
import FeaturesSection from "@/components/home/FeaturesSection";
import CategoriesSection from "@/components/home/CategoriesSection";
import Container from "@/components/shared/Container";
import { testimonialsData } from "@/data/homeData";

export const metadata = homeMetadata;

export default function Home() {
  return (
    <div className="bg-white overflow-hidden">
      {/* ===== Hero Section ===== */}
      <HeroSection />

      {/* ===== Latest Products ===== */}
      <LatestProducts />

      {/* ===== Features Section ===== */}
      <FeaturesSection />

      {/* ===== Categories Section ===== */}
      <CategoriesSection />


      {/* ===== Discount Banner ===== */}
      {/* <section className="py-20 lg:py-24">
        <Container>
          <div className="relative bg-linear-to-r from-indigo-600 via-blue-600 to-purple-600 rounded-[2.5rem] p-12 lg:p-16 overflow-hidden shadow-2xl shadow-indigo-200/50">
            <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-white/10 rounded-full blur-3xl translate-x-1/3 -translate-y-1/3" />
            <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-purple-400/20 rounded-full blur-3xl -translate-x-1/3 translate-y-1/3" />
            <div className="absolute inset-0 opacity-10" style={{ backgroundImage: 'radial-linear(rgba(255,255,255,0.3) 1px, transparent 1px)', backgroundSize: '32px 32px' }} />

            <div className="relative flex flex-col lg:flex-row items-center justify-between gap-10 text-white">
              <div className="text-center lg:text-right max-w-2xl">
                <span className="inline-block bg-white/20 backdrop-blur-sm px-5 py-2 rounded-full text-sm font-semibold mb-5 border border-white/20">
                  🔥 تخفیف ویژه
                </span>
                <h2 className="text-4xl lg:text-6xl font-bold mb-4 leading-tight">
                  جشنواره <br className="block lg:hidden" />
                  <span className="text-yellow-300 bg-yellow-400/20 px-3 py-1 rounded-2xl">پاییزه</span>
                </h2>
                <p className="text-blue-100/90 text-lg mb-8 leading-relaxed max-w-lg">
                  تا <span className="text-yellow-300 font-bold text-2xl">۴۰٪</span> تخفیف ویژه برای خرید اول شما. فرصت رو از دست نده!
                </p>
                <div className="flex flex-wrap items-center gap-4 justify-center lg:justify-start">
                  <Link
                    href="/products"
                    className="inline-flex items-center gap-2 bg-white text-blue-600 font-bold px-8 py-4 rounded-2xl hover:bg-blue-50 hover:scale-105 transition-all shadow-lg shadow-black/20"
                  >
                    خرید کنید
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M9 5l7 7-7 7" />
                    </svg>
                  </Link>
                  <span className="text-blue-100 text-sm hidden sm:inline">|</span>
                  <span className="text-blue-100/80 text-sm flex items-center gap-2">
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    فقط تا پایان هفته
                  </span>
                </div>
              </div>

              <div className="flex items-center gap-3 text-center">
                {[
                  { value: "۰۷", label: "روز" },
                  { value: "۱۸", label: "ساعت" },
                  { value: "۴۵", label: "دقیقه" },
                  { value: "۳۲", label: "ثانیه" }
                ].map((item, i) => (
                  <div key={i} className="bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl p-4 min-w-[70px] sm:min-w-[85px] hover:bg-white/20 transition-all duration-300">
                    <div className="text-3xl sm:text-4xl font-bold text-white tracking-wider">{item.value}</div>
                    <div className="text-blue-100/70 text-xs mt-1 uppercase tracking-wider">{item.label}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </Container>
      </section> */}

      {/* ===== Testimonials Section ===== */}
      <section className="py-20 lg:py-28 bg-white relative">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[400px] bg-blue-100/20 rounded-full blur-3xl" />

        <Container className="relative">
          <div className="text-center mb-16">
            <span className="inline-block text-sm font-semibold text-purple-600 bg-purple-50/80 backdrop-blur-sm px-5 py-2 rounded-full mb-4 border border-purple-100/50">
              نظرات مشتریان
            </span>
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-gray-800 mb-4">
              آنها به ما <span className="bg-linear-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">اعتماد کردند</span>
            </h2>
            <p className="text-gray-500 max-w-xl mx-auto text-base">
              تجربه خرید مشتریان ما، بهترین گواه برای کیفیت خدماتمان است.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 lg:gap-8">
            {testimonialsData.map((review) => (
              <div
                key={review.id}
                className="group bg-white/60 backdrop-blur-sm rounded-3xl p-8 border border-gray-100/80 hover:border-purple-200/50 hover:shadow-2xl hover:-translate-y-1 transition-all duration-500 relative"
              >
                <div className="absolute top-6 left-6 text-7xl text-purple-100/50 leading-none font-serif group-hover:text-purple-200/70 transition-colors duration-500">

                </div>

                <div className="flex gap-1 mb-5 relative">
                  {[...Array(5)].map((_, i) => (
                    <svg key={i} className={`w-5 h-5 ${i < review.rating ? 'text-yellow-400 fill-yellow-400' : 'text-gray-200 fill-gray-200'}`} viewBox="0 0 20 20">
                      <path d="M10 15l-5.878 3.09 1.123-6.545L.489 6.91l6.572-.955L10 0l2.939 5.955 6.572.955-4.756 4.635 1.123 6.545z" />
                    </svg>
                  ))}
                </div>

                <p className="text-gray-600 leading-relaxed mb-6 relative z-10">{review.text}</p>

                <div className="flex items-center gap-4 relative">
                  <div className="w-14 h-14 rounded-full bg-linear-to-br from-purple-100 to-indigo-100 flex items-center justify-center text-2xl font-bold text-indigo-600 shadow-md">
                    {review.name.charAt(0)}
                  </div>
                  <div>
                    <h4 className="font-bold text-gray-800">{review.name}</h4>
                    <div className="flex items-center gap-2">
                      <span className="text-sm text-gray-500">{review.role}</span>
                      <span className="text-xs text-gray-300">•</span>
                      <span className="text-xs text-gray-400">{review.date}</span>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </Container>
      </section>

      {/* ===== Newsletter Section ===== */}
      <section className="py-20 lg:py-28 bg-linear-to-b from-white via-blue-50/30 to-indigo-50/20">

        <Container>
          <div className="max-w-5xl mx-auto relative">
            <div className="absolute -top-20 -right-20 w-72 h-72 bg-blue-200/30 rounded-full blur-3xl" />
            <div className="absolute -bottom-20 -left-20 w-72 h-72 bg-purple-200/20 rounded-full blur-3xl" />

            <div className="relative bg-white/70 backdrop-blur-xl rounded-[2.5rem] p-12 md:p-16 shadow-2xl shadow-indigo-100/50 border border-white/60">
              <div className="text-center">
                <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-linear-to-br from-blue-100 to-indigo-100 text-4xl mb-6 shadow-lg shadow-blue-200/50">
                  <svg className="w-10 h-10 text-indigo-600" fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                  </svg>
                </div>

                <h2 className="text-3xl md:text-4xl font-bold text-gray-800 mb-4">
                  به <span className="bg-linear-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">خانواده</span> ما بپیوندید
                </h2>

                <p className="text-gray-500 mb-10 max-w-2xl mx-auto text-base">
                  با عضویت در خبرنامه، از جدیدترین تخفیف‌ها، محصولات و رویدادهای ویژه مطلع شوید.
                </p>

                <form className="flex flex-col sm:flex-row gap-3 max-w-lg mx-auto">
                  <input
                    type="email"
                    placeholder="آدرس ایمیل خود را وارد کنید"
                    className="flex-1 px-6 py-4 rounded-2xl bg-gray-50/80 backdrop-blur-sm border border-gray-200/80 focus:outline-none focus:border-indigo-500 focus:ring-4 focus:ring-indigo-100 transition-all text-right placeholder:text-gray-400"
                    required
                  />

                  <button
                    type="submit"
                    className="px-10 py-4 bg-linear-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-semibold rounded-2xl transition-all duration-300 shadow-lg shadow-blue-500/30 hover:shadow-xl hover:shadow-blue-500/40 hover:scale-105 active:scale-95 whitespace-nowrap"
                  >
                    عضویت
                    <svg className="inline-block w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M9 5l7 7-7 7" />
                    </svg>
                  </button>
                </form>

                <p className="text-xs text-gray-400 mt-6 flex items-center justify-center gap-2">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                  </svg>
                  بدون هرگونه اسپم. فقط بهترین‌ها.
                </p>
              </div>
            </div>
          </div>
        </Container>

      </section>
    </div>
  );
}