import Container from "../shared/Container";
import { featuresData } from "@/data/homeData";

export default function FeaturesSection() {
    return (
        <section className="py-20 lg:py-28 bg-white relative">
            <div className="absolute top-20 right-10 w-72 h-72 bg-blue-100/30 rounded-full blur-3xl" />
            <div className="absolute bottom-10 left-10 w-96 h-96 bg-purple-100/20 rounded-full blur-3xl" />

            <Container className="relative">
                <div className="text-center mb-16">
                    <span className="inline-block text-sm font-semibold text-blue-600 bg-blue-50/80 backdrop-blur-sm px-5 py-2 rounded-full mb-4 border border-blue-100/50">
                        چرا ما را انتخاب می‌کنید؟
                    </span>
                    <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-gray-800 mb-4">
                        خرید آسان، <span className="bg-linear-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">مدرن و مطمئن</span>
                    </h2>
                    <p className="text-gray-500 max-w-2xl mx-auto text-base">
                        با ما خریدی لذت‌بخش و بدون دغدغه را تجربه کنید.
                    </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-8">
                    {featuresData.map((feature) => (
                        <div
                            key={feature.id}
                            className="group relative bg-white/80 backdrop-blur-sm rounded-3xl p-8 shadow-lg shadow-gray-100/50 border border-gray-100/80 hover:shadow-2xl hover:shadow-blue-100/50 hover:-translate-y-2 transition-all duration-500"
                        >
                            <div className={`absolute inset-0 bg-linear-to-br ${feature.linear} opacity-0 group-hover:opacity-5 rounded-3xl transition-opacity duration-500`} />
                            <div className={`w-14 h-14 rounded-2xl bg-linear-to-br ${feature.linear} flex items-center justify-center mb-5 shadow-lg shadow-blue-500/20 group-hover:scale-110 group-hover:rotate-3 transition-all duration-500`}>
                                {feature.svg}
                            </div>
                            <h3 className="text-xl font-bold text-gray-800 mb-2">{feature.title}</h3>
                            <p className="text-gray-500 text-sm leading-relaxed">{feature.description}</p>
                        </div>
                    ))}
                </div>
            </Container>
        </section>
    );
}